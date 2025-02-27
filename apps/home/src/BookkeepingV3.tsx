import { SetStateAction, useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import Dexie, { EntityTable } from 'dexie'

import { MarginAround } from './MarginAround'
import { Amount } from './Amount'
import { useStatus } from './bookkeeping_v2/useStatus'

export function BookkeepingV3() {
  const [key, setKey] = useState('')

  const keys = useLiveQuery(async () => {
    const result: string[] = []
    for (const key of await database.journals.toCollection().keys()) {
      if (typeof key !== 'string') {
        throw Error(`expected key of type string got '${key}'`)
      }
      result.push(key)
    }
    return result
  }, [])

  return (
    <MarginAround>
      <h2>Bookkeeping v3</h2>
      {keys && (
        <JournalList
          journalKey={key}
          journalKeys={keys}
          onJournalKeyChange={(key) => setKey(key)}
        />
      )}
      <JournalView journalKey={key} />
    </MarginAround>
  )
}

function JournalList({
  journalKey,
  journalKeys,
  onJournalKeyChange,
}: {
  journalKey: string
  journalKeys: string[]
  onJournalKeyChange: (key: string) => void
}) {
  return (
    <p>
      <label>
        {' select journal: '}
        <select
          onChange={(e) => onJournalKeyChange(e.target.value)}
          value={journalKey}
        >
          {journalKey === '' && <option value={''} />}
          {journalKeys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </label>
      <button
        aria-label={'create journal'}
        onClick={async () => {
          let index = 1
          if (journalKeys.indexOf('new journal') > -1) {
            for (
              index += 1;
              journalKeys.indexOf(`new journal (${index})`) > -1;
              index++
            ) {
              /* eslint-disable-no-empty */
            }
          }
          const suffix = index === 1 ? '' : ` (${index})`
          const key = 'new journal' + suffix
          await database.journals.put({ key, transfers: [] })
          onJournalKeyChange(key)
        }}
      >
        +
      </button>
    </p>
  )
}

function JournalView({ journalKey }: { journalKey?: string }) {
  const status = useStatus()

  const journal = useLiveQuery(async () => {
    if (journalKey !== undefined) {
      try {
        const result = await database.journals.get(journalKey)
        if (result === undefined) {
          status.info('ready to load journal')
        } else {
          status.clear()
          return new Journal(journalKey, result.transfers)
        }
      } catch (cause) {
        status.error('failed to load journal', cause)
      }
    }
  }, [journalKey])

  return (
    <>
      <p>{status.message}</p>
      {journal !== undefined && (
        <>
          <JournalEditor journal={journal} />
          <JournalSummary journal={journal} />
        </>
      )}
    </>
  )
}

class Journal {
  constructor(
    public key: string,
    public transfers: Transfer[],
    private table = database.journals,
  ) {}

  setTransfers(updateOrBlock: SetStateAction<Transfer[]>) {
    const update =
      typeof updateOrBlock === 'function'
        ? updateOrBlock(this.transfers)
        : updateOrBlock
    return this.table.put({ key: this.key, transfers: update })
  }

  addTransfer() {
    this.setTransfers((transfers) =>
      transfers.concat([
        { date: '', memo: '', credit: '', debit: '', amount: '' },
      ]),
    )
  }

  deleteTransfer(deleteIndex: number) {
    this.setTransfers((transfers) =>
      transfers.filter((_, index) => index !== deleteIndex),
    )
  }

  updateTransfer(index: number, block: (transfer: Transfer) => Transfer) {
    this.setTransfers((transfers) =>
      transfers.map((transfer, k) =>
        k === index ? block(transfer) : transfer,
      ),
    )
  }
}

type Transfer = {
  date: string
  memo: string
  credit: string
  debit: string
  amount: string
}

const database = new Dexie('cruftbusters.com/bookkeeping_v3') as Dexie & {
  journals: EntityTable<Journal, 'key'>
}

database.version(1).stores({
  journals: 'key',
})

function JournalEditor({ journal }: { journal: Journal }) {
  const journalText = useMemo(
    () => TransferSerde.serialize(journal.transfers),
    [journal.transfers],
  )

  const [journalTextInFlight, setJournalTextInFlight] = useState<string>()
  const status = useStatus()

  function onTextChanged(text: string) {
    try {
      const transfers = TransferSerde.deserialize(text)
      journal.setTransfers(transfers)
      setJournalTextInFlight(undefined)
      status.clear()
    } catch (cause) {
      setJournalTextInFlight(text)
      status.error('failed to deserialize transfers', cause)
    }
  }

  return (
    <>
      <p>{status.message}</p>
      <div
        className={'grid'}
        style={{
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(7, auto)',
          gridGap: '1px',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            gridColumn: '1/-1',
            display: 'grid',
            gridTemplateColumns: 'subgrid',
            gridGap: '1em',
          }}
        >
          <span />
          <span>date</span>
          <span>memo</span>
          <span>credit</span>
          <span>debit</span>
          <span>amount</span>
        </div>
        {journal.transfers.map((transfer, index) => (
          <div
            aria-label={index.toString()}
            key={index}
            style={{
              gridColumn: '1/-1',
              display: 'grid',
              gridTemplateColumns: 'subgrid',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgb(43, 42, 51)',
                padding: '0.25em 0.5em',
                textAlign: 'right',
              }}
            >
              {index}
            </div>
            <input
              aria-label={'date'}
              onChange={(e) =>
                journal.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  date: e.target.value,
                }))
              }
              value={transfer.date}
            />
            <input
              aria-label={'memo'}
              onChange={(e) =>
                journal.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  memo: e.target.value,
                }))
              }
              value={transfer.memo}
            />
            <input
              aria-label={'credit'}
              onChange={(e) =>
                journal.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  credit: e.target.value,
                }))
              }
              value={transfer.credit}
            />
            <input
              aria-label={'debit'}
              onChange={(e) =>
                journal.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  debit: e.target.value,
                }))
              }
              value={transfer.debit}
            />
            <input
              aria-label={'amount'}
              onChange={(e) =>
                journal.updateTransfer(index, (transfer) => ({
                  ...transfer,
                  amount: e.target.value,
                }))
              }
              value={transfer.amount}
            />
            <button
              aria-label={'delete'}
              onClick={() => journal.deleteTransfer(index)}
              style={{ borderRadius: 0, backgroundColor: 'rgb(43, 42, 51)' }}
            >
              &times;
            </button>
          </div>
        ))}
        <textarea
          aria-label={'journal as text'}
          onChange={(e) => onTextChanged(e.target.value)}
          style={{ gridColumn: '1/-1', resize: 'vertical' }}
          value={journalText || journalTextInFlight}
        />
      </div>
      <p>
        <button onClick={() => journal.addTransfer()}>add transfer</button>
      </p>
    </>
  )
}

class TransferSerde {
  static serialize(
    transfers: Transfer[],
    fields = ['date', 'memo', 'credit', 'debit', 'amount'],
  ) {
    const records = transfers.map((transfer) => {
      const record = []
      let index = 0
      for (const [key, value] of Object.entries(transfer)) {
        if (key !== fields[index]) {
          throw Error(`expected '${fields[index]}' got '${key}'`)
        }
        record.push(value)
        index++
      }
      return record
    })

    return [fields]
      .concat(records)
      .map((row) => row.join('\t'))
      .join('\n')
  }

  static deserialize(
    text: string,
    expectedFields = ['date', 'memo', 'credit', 'debit', 'amount'],
  ) {
    const rows = text.split('\n').map((line) => line.split('\t'))
    const fields = rows.shift() || []

    if (fields.length === 1 && fields[0] === '') {
      return []
    }

    {
      if (fields.length !== expectedFields.length) {
        throw Error(`expected fields '${expectedFields}' got '${fields}'`)
      }

      for (let index = 0; index < fields.length; index++) {
        if (fields[index] !== expectedFields[index]) {
          throw Error(
            `at position ${index} expected '${expectedFields[index]}' got '${fields[index]}'`,
          )
        }
      }
    }

    const result: Transfer[] = []

    for (const row of rows) {
      const transfer: Record<string, string> = {}
      let index = 0
      for (const field of fields) {
        transfer[field] = row[index++]
      }
      result.push(transfer as Transfer)
    }

    return result
  }
}

function JournalSummary({ journal }: { journal: Journal }) {
  const status = useStatus()
  const summary = useMemo(() => {
    try {
      const summary = journal.transfers.reduce((accounts, transfer) => {
        const amount = Amount.parse(transfer.amount)
        const credit = accounts.get(transfer.credit)
        const debit = accounts.get(transfer.debit)
        return accounts
          .set(
            transfer.credit,
            credit ? credit.plus(amount.negate()) : amount.negate(),
          )
          .set(transfer.debit, debit ? debit.plus(amount) : amount)
      }, new Map<string, Amount>())
      status.info('successfully summarized journal')
      return summary
    } catch (cause) {
      status.error('failed to summarize journal', cause)
      return new Map()
    }
  }, [status, journal.transfers])

  return (
    <>
      <h3>summary</h3>
      <p>{status.message}</p>
      <div>
        {Array.from(summary.entries()).map(([account, amount]) => (
          <div key={account}>
            {` ${account}: `}
            <span aria-label={account}>{` ${amount.format()} `}</span>
          </div>
        ))}
      </div>
    </>
  )
}
