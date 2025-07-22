import { Reducer, useReducer } from 'react'
import { useStatus } from '../../useStatus'
import { TextSheet } from './TextSheet'
import { BalanceSheetView } from './BalanceSheetView'

type State = {
  activeLogbook: string
  logbooks: Record<string, TextSheet>
  text: string
}

type Action =
  | { type: 'setActiveLogbook'; name: string }
  | { type: 'setText'; text: string }

export function App() {
  const status = useStatus()

  const [state, dispatch] = useReducer(reducer(status), {
    activeLogbook: 'default',
    logbooks: {
      default: new TextSheet([['credit', 'debit', 'amount']]),
      'major accounting categories': new TextSheet([
        ['credit', 'debit', 'amount'],
        ['equity:capital contribution', 'expense:office supplies', '$200.00'],
        ['income:via client', 'liability:income receivable', '$500.00'],
        ['liability:income receivable', 'assets:checking', '$500.00'],
        ['liability:credit card', 'expense:government fees', '$135.00'],
        ['income:checking interest', 'assets:checking', '$1.00'],
        ['income:via client', 'liability:income receivable', '$500.00'],
        ['assets:checking', 'expense:income tax', '$100.00'],
        ['assets:checking', 'expense:net pay', '$300.00'],
        ['assets:checking', 'equity:draw', '$50.00'],
      ]),
      'timekeeping and credit': TextSheet.parse(
        ` credit,debit,amount
          my hours,income:via client,40.00 h
          income:via client,liability:client receivable,$1000.00
          liability:credit card,expense:mobile phone,$900.00
          expense:mobile phone,assets,1 Google Pixel 9
          liability:client receivable,assets:cash,$1000.00
        `,
      ),
    },
    text: new TextSheet([['credit', 'debit', 'amount']]).toText(),
  })

  const logbook = state.logbooks[state.activeLogbook]

  return (
    <>
      <p>
        Logbook is a quick bean counter. Each record moves something from one
        account to another.
      </p>
      <p>
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
      </p>
      <p>
        {' Try adding this line: '}
        <code>my bean factory, my bean lover, 1000 beans</code>
      </p>
      <p aria-label="app-status" hidden={status.message === undefined}>
        {status.message}
      </p>
      <div className="block">
        <textarea
          aria-label="transfers"
          onChange={(e) => dispatch({ type: 'setText', text: e.target.value })}
          rows={8}
          className="editor"
          value={state.text}
        />
      </div>
      <div className="block">
        <BalanceSheetView logbook={logbook} />
      </div>
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
        text: state.logbooks[action.name].toText(),
      }
    case 'setText':
      try {
        const sheet = TextSheet.parse(action.text)

        status.clear()

        return {
          ...state,
          logbooks: { ...state.logbooks, [state.activeLogbook]: sheet },
          text: action.text,
        }
      } catch (cause) {
        status.error('failed to parse sheet from text', cause)

        return { ...state, text: action.text }
      }
  }
}
