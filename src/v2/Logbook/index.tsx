import { useState } from 'react'
import { useStatus } from '../../useStatus'
import { TextSheet } from './TextSheet'
import { BalanceSheet } from './BalanceSheet'
import { TransferSheet } from './TransferSheet'

import './index.css'

export function Logbook() {
  const [text, setText] = useState('')
  const [summary, setBalanceSheet] = useState<BalanceSheet>(new BalanceSheet())
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
      <textarea
        aria-label="transfers"
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="block editor"
        value={text}
      />
      <button
        className="block"
        onClick={() => {
          try {
            const sheet = TextSheet.parse(text)

            const transferSheet = TransferSheet.fromTextSheet(sheet)

            setBalanceSheet(transferSheet.toBalanceSheet())

            status.info('success')
          } catch (cause) {
            status.error('error', cause)
          }
        }}
      >
        save
      </button>
      <div aria-label="status" className="block">
        {status.message}
      </div>
      <pre aria-label="summary" className="block">
        {summary.toTextSheet().toText()}
      </pre>
    </div>
  )
}
