import { useState, useEffect } from 'react'
import { useStatus } from '../../useStatus'
import { BalanceSheet } from './BalanceSheet'
import { TextSheet } from './TextSheet'
import { AmountView } from './AmountView'

export function BalanceSheetView({ transfers }: { transfers: TextSheet }) {
  const status = useStatus()

  const [balanceSheet, setBalanceSheet] = useState(new BalanceSheet())

  useEffect(() => {
    try {
      setBalanceSheet(BalanceSheet.fromTransfers(transfers))

      status.clear()
    } catch (cause) {
      status.error('failed to generate balance sheet', cause)
    }
  }, [transfers])

  return (
    <>
      <p aria-label="summary-status" hidden={status.message === undefined}>
        {status.message}
      </p>
      <div className="block">
        <pre aria-label="summary-contents" className="balance-sheet">
          <div role="row" className="balance-sheet-row">
            <div>account</div>
            <div className="amount-header">amount</div>
          </div>
          {balanceSheet.pretty().map(([account, amount]) => (
            <div key={account} role="row" className="balance-sheet-row">
              <div>{account}</div>
              <AmountView amount={amount} />
            </div>
          ))}
        </pre>
      </div>
    </>
  )
}
