import { Reducer, useReducer } from 'react'
import { useStatus } from '../../useStatus'
import { TextSheet } from './TextSheet'
import { TransferSheet } from './TransferSheet'
import { BalanceSheetView } from './BalanceSheetView'

type State = {
  activeLogbook: string
  logbooks: Record<string, TransferSheet>
  text: string
}

type Action =
  | { type: 'setActiveLogbook'; name: string }
  | { type: 'setText'; text: string }

export function LogbookApp() {
  const status = useStatus()

  const [state, dispatch] = useReducer(reducer(status), {
    activeLogbook: 'default',
    logbooks: {
      default: emptyTransfers,
      example: exampleTransfers,
    },
    text: emptyTransfers.toTextSheet().toText(),
  })

  return (
    <>
      <p aria-label="app-status">{status.message}</p>
      <label>
        {' select logbook: '}
        <select
          onChange={(e) =>
            dispatch({ type: 'setActiveLogbook', name: e.target.value })
          }
        >
          {Object.keys(state.logbooks).map((key) => (
            <option key={key}>{key}</option>
          ))}
        </select>
      </label>
      <textarea
        aria-label="transfers"
        onChange={(e) => dispatch({ type: 'setText', text: e.target.value })}
        rows={8}
        className="block editor"
        value={state.text}
      />
      <BalanceSheetView transfers={state.logbooks[state.activeLogbook]} />
    </>
  )
}

const reducer: (
  status: ReturnType<typeof useStatus>,
) => Reducer<State, Action> = (status) => (state: State, action: Action) => {
  switch (action.type) {
    case 'setActiveLogbook':
      return {
        ...state,
        activeLogbook: action.name,
        text: state.logbooks[action.name].toTextSheet().toText(),
      }
    case 'setText':
      try {
        const sheet = TextSheet.parse(action.text)

        const transfers = TransferSheet.fromTextSheet(sheet)

        status.clear()

        return {
          ...state,
          logbooks: { ...state.logbooks, [state.activeLogbook]: transfers },
          text: action.text,
        }
      } catch (cause) {
        status.error('failed to parse sheet from text', cause)

        return { ...state, text: action.text }
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
