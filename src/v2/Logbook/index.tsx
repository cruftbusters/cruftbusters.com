import { useState } from 'react'
import { useStatus } from '../../useStatus'
import { TextSheet } from './TextSheet'
import { BalanceSheet } from './BalanceSheet'
import { TransferSheet } from './TransferSheet'

import './index.css'

export function Logbook() {
  const [text, setText] = useState('')

  const [transferSheet, setTransferSheet] = useState(new TransferSheet())

  const status = useStatus()

  const [balanceSheet, setBalanceSheet] = useState(new BalanceSheet())

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
      <textarea
        aria-label="transfers"
        onChange={(e) => {
          const text = e.target.value

          setText(text)

          try {
            const sheet = TextSheet.parse(text)

            const transferSheet = TransferSheet.fromTextSheet(sheet)

            setTransferSheet(transferSheet)

            status.info('success')
          } catch (cause) {
            status.error('error', cause)
          }
        }}
        rows={8}
        className="block editor"
        value={text}
      />
      <div aria-label="status" className="block">
        {status.message}
      </div>
      <button
        className="block"
        onClick={() => setBalanceSheet(transferSheet.toBalanceSheet())}
      >
        summarize
      </button>
      <pre aria-label="summary" className="block">
        {balanceSheet.toTextSheet().toText()}
      </pre>
    </div>
  )
}
