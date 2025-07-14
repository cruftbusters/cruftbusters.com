import { Reducer, useReducer } from 'react'
import { useStatus } from '../../useStatus'
import { TextSheet } from './TextSheet'
import { TransferSheet } from './TransferSheet'
import { BalanceSheetView } from './BalanceSheetView'

type State = {
  text: string
  transfers: TransferSheet
}

type Action =
  | { type: 'setText'; text: string }
  | { type: 'setTransfers'; transfers: TransferSheet }

export function LogbookApp() {
  const status = useStatus()

  const [state, dispatch] = useReducer(reducer(status), {
    text: emptyTransfers.toTextSheet().toText(),
    transfers: emptyTransfers,
  })

  return (
    <>
      <p aria-label="app-status">{status.message}</p>
      <button
        onClick={() =>
          dispatch({ type: 'setTransfers', transfers: exampleTransfers })
        }
      >
        load example
      </button>
      <textarea
        aria-label="transfers"
        onChange={(e) => dispatch({ type: 'setText', text: e.target.value })}
        rows={8}
        className="block editor"
        value={state.text}
      />
      <BalanceSheetView state={state} />
    </>
  )
}

const reducer: (
  status: ReturnType<typeof useStatus>,
) => Reducer<State, Action> = (status) => (state: State, action: Action) => {
  switch (action.type) {
    case 'setText':
      try {
        const sheet = TextSheet.parse(action.text)

        const transfers = TransferSheet.fromTextSheet(sheet)

        status.clear()

        return { ...state, status: '', text: action.text, transfers }
      } catch (cause) {
        status.error('sheet error', cause)

        return { ...state, text: action.text }
      }
    case 'setTransfers':
      status.info('loaded example')

      return {
        ...state,
        text: action.transfers.toTextSheet().toText(),
        transfers: action.transfers,
      }
  }
}

const emptyTransfers = new TransferSheet(['credit', 'debit', 'amount'])

const exampleTransfers = TransferSheet.fromTextSheet(
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
)
