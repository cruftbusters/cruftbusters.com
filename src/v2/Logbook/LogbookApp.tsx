import { useState } from 'react'
import { useStatus } from '../../useStatus'
import { BalanceSheet } from './BalanceSheet'
import { TextSheet } from './TextSheet'
import { TransferSheet } from './TransferSheet'

type State = {
  activeLogbook: string
  balanceSheet: BalanceSheet
  logbooks: Record<string, TransferSheet>
  text: string
}

export function LogbookApp() {
  const status = useStatus()

  const [state, setState] = useState<State>(() => ({
    activeLogbook: 'default',
    balanceSheet: new BalanceSheet(),
    logbooks: {
      default: new TransferSheet(),
      example: TransferSheet.fromTextSheet(
        new TextSheet([
          ['credit', 'debit', 'amount'],
          ['equity:capital contribution', 'expense:office supplies', '200'],
          ['income:via client', 'liability:income receivable', '500'],
          ['liability:income receivable', 'assets:checking', '500'],
          ['liability:credit card', 'expense:government fees', '135'],
          ['income:checking interest', 'assets:checking', '1'],
          ['income:via client', 'liability:income receivable', '500'],
          ['assets:checking', 'expense:income tax', '100'],
          ['assets:checking', 'expense:net pay', '300'],
          ['assets:checking', 'equity:draw', '50'],
        ]),
      ),
    },
    text: new TransferSheet().toTextSheet().toText(),
  }))

  return (
    <div>
      <div aria-label="status" className="block">
        {status.message}
      </div>
      <label>
        {' select logbook: '}
        <select
          onChange={(e) => {
            const name = e.target.value

            setState((state) => ({
              ...state,
              activeLogbook: name,
              text: state.logbooks[name].toTextSheet().toText(),
            }))
          }}
        >
          {Object.keys(state.logbooks).map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>
      </label>
      <textarea
        aria-label="transfers"
        onChange={(e) => {
          const text = e.target.value

          setState((state) => ({ ...state, text }))

          try {
            const sheet = TextSheet.parse(text)

            const transferSheet = TransferSheet.fromTextSheet(sheet)

            setState((state) => ({
              ...state,
              logbooks: {
                ...state.logbooks,
                [state.activeLogbook]: transferSheet,
              },
            }))

            status.info('sheet ok')
          } catch (cause) {
            status.error('sheet error', cause)
          }
        }}
        rows={8}
        className="block editor"
        value={state.text}
      />
      <pre aria-label="summary" className="block balance-sheet">
        {state.logbooks[state.activeLogbook]
          .toBalanceSheet()
          .toTextSheet()
          .rows.map(([key, value]) => (
            <div key={key} className="balance-sheet-row">
              <div>{key}</div>
              <div>{value}</div>
            </div>
          ))}
      </pre>
    </div>
  )
}
