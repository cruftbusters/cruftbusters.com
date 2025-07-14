import { useState, useEffect } from 'react'
import { useStatus } from '../../useStatus'
import { BalanceSheet } from './BalanceSheet'
import { TransferSheet } from './TransferSheet'

export function BalanceSheetView({ transfers }: { transfers: TransferSheet }) {
  const status = useStatus()

  const [balanceSheet, setBalanceSheet] = useState(new BalanceSheet())

  useEffect(() => {
    try {
      setBalanceSheet(BalanceSheet.fromTransferSheet(transfers))

      status.clear()
    } catch (cause) {
      status.error('failed to generate balance sheet', cause)
    }
  }, [transfers])

  return (
    <div>
      <p aria-label="summary-status">{status.message}</p>
      <pre aria-label="summary-contents" className="block balance-sheet">
        {balanceSheet.toTextSheet().rows.map(([key, value]) => (
          <div key={key} role="row" className="balance-sheet-row">
            <div>{key}</div>
            <div>{value}</div>
          </div>
        ))}
      </pre>
    </div>
  )
}
