import { useState, useEffect } from 'react'
import { useStatus } from '../../useStatus'
import { BalanceSheet } from './BalanceSheet'
import { TextSheet } from './TextSheet'
import { TransferSheet } from './TransferSheet'

export function LogbookApp() {
  const [text, setText] = useState('')

  const [transferSheet, setTransferSheet] = useState(new TransferSheet())

  const status = useStatus()

  const [balanceSheet, setBalanceSheet] = useState(new BalanceSheet())

  useEffect(() => {
    setBalanceSheet(transferSheet.toBalanceSheet())
  }, [transferSheet])

  return (
    <div>
      <textarea
        aria-label="transfers"
        onChange={(e) => {
          const text = e.target.value

          setText(text)

          try {
            const sheet = TextSheet.parse(text)

            const transferSheet = TransferSheet.fromTextSheet(sheet)

            setTransferSheet(transferSheet)

            status.info('sheet ok')
          } catch (cause) {
            status.error('sheet error', cause)
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
        onClick={() => {
          const sheet = new TextSheet([
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
          ])

          const text = sheet.toText()

          setText(text)

          const transferSheet = TransferSheet.fromTextSheet(sheet)

          setTransferSheet(transferSheet)

          status.info('loaded example sheet')
        }}
      >
        load example
      </button>
      <pre aria-label="summary" className="block">
        {balanceSheet.toTextSheet().toText()}
      </pre>
    </div>
  )
}
