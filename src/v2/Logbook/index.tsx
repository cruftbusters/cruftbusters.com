import { useState } from 'react'
import { useStatus } from '../../useStatus'
import { TextSheet } from './TextSheet'
import { Amount } from './Amount'
import { BalanceSheet } from './BalanceSheet'

export function Logbook() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState<BalanceSheet>(new BalanceSheet())
  const status = useStatus()

  return (
    <div>
      <h1>Logbook</h1>
      <p>
        Logbook is for ad-hoc summarizations of transactions. Transactions could
        be financial. However Logbook supports units beyond money like hours or
        kilowatt hours or physical assets. Logbook is inspired by Datadog
        notebooks and rich ad-hoc reporting and monitoring for software
        telemetry.
      </p>
      <label>
        {' transfers '}
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <button
        onClick={() => {
          try {
            const sheet = TextSheet.parse(text)

            const [headers, records] = sheet.split()

            const wantHeaders = ['credit', 'debit', 'amount']

            for (const wantHeader of wantHeaders) {
              if (headers.indexOf(wantHeader) < 0) {
                throw new Error(
                  'transfer text sheet does not include all headers of \"credit\", \"debit\", and \"amount\"',
                )
              }
            }

            const summary = new BalanceSheet()

            for (const [credit, debit, amountText] of records) {
              const amount = Amount.parse(amountText)
              summary.accrue(credit, amount.negate())
              summary.accrue(debit, amount)
            }

            setSummary(summary)

            status.info('success')
          } catch (cause) {
            status.error('error', cause)
          }
        }}
      >
        save
      </button>
      <div aria-label="status">{status.message}</div>
      <pre aria-label="summary">{summary.toTextSheet().toText()}</pre>
    </div>
  )
}
