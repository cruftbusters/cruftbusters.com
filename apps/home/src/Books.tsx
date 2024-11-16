import { useLedgers } from './database'
import { MarginAboveBelow, MarginAround } from './MarginAround'
import { LedgerSummary } from './LedgerSummary'
import { TransferEditor } from './TransferEditor'
import { LedgerEditor } from './LedgerEditor'

export function Bookkeeping() {
  const state = useLedgers()

  return (
    <MarginAround>
      <h2>Bookkeeping</h2>
      {state === undefined ? (
        'Loading ledgers'
      ) : (
        <>
          <div hidden={state.ledger !== undefined}>No ledger selected</div>
          <MarginAboveBelow>
            <LedgerEditor {...state} />
          </MarginAboveBelow>
          <MarginAboveBelow>
            <TransferEditor {...state} />
          </MarginAboveBelow>
          <MarginAboveBelow>
            <LedgerSummary {...state} />
          </MarginAboveBelow>
        </>
      )}
    </MarginAround>
  )
}
