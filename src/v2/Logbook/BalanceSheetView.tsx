import { useState, useEffect } from 'react'
import { useStatus } from '../../useStatus'
import { BalanceSheet } from './BalanceSheet'
import { State } from './LogbookApp'

export function BalanceSheetView({ state }: { state: State }) {
  const status = useStatus()

  const [balanceSheet, setBalanceSheet] = useState(new BalanceSheet())

  useEffect(() => {
    try {
      setBalanceSheet(BalanceSheet.fromTransferSheet(state.transfers))

      status.clear()
    } catch (cause) {
      status.error('failed to generate balance sheet', cause)
    }
  }, [state.transfers])

  return (
    <div>
      <p aria-label="summary-status">{status.message}</p>
      <pre aria-label="summary-contents" className="block balance-sheet">
        {balanceSheet.toTextSheet().rows.map(([key, value]) => (
          <div key={key} className="balance-sheet-row">
            <div>{key}</div>
            <div>{value}</div>
          </div>
        ))}
      </pre>
    </div>
  )
}
