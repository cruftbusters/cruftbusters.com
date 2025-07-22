import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext as useReactContext,
  useReducer,
} from 'react'
import { TextSheet } from './TextSheet'

const defaultLogbook = new TextSheet([['credit', 'debit', 'amount']])

const defaultState = {
  activeLogbook: 'default',
  logbook: defaultLogbook,
  logbooks: {
    default: defaultLogbook,
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
  textParseStatus: '',
  text: defaultLogbook.toText(),
}

export const context = createContext<[State, Dispatch<Action>]>([
  defaultState,
  () => {
    throw Error('dispatch not ready')
  },
])

export function ContextProvider(props: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, defaultState)

  return <context.Provider {...props} value={[state, dispatch]} />
}

export function useContext() {
  return useReactContext(context)
}

type State = {
  activeLogbook: string
  logbook: TextSheet
  logbooks: Record<string, TextSheet>
  textParseStatus: string
  text: string
}

type Action =
  | { type: 'setActiveLogbook'; name: string }
  | { type: 'setText'; text: string }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setActiveLogbook':
      const logbook = state.logbooks[action.name]

      return {
        ...state,
        activeLogbook: action.name,
        logbook,
        text: logbook.toText(),
      }
    case 'setText':
      try {
        const logbook = TextSheet.parse(action.text)

        return {
          ...state,
          logbook,
          logbooks: { ...state.logbooks, [state.activeLogbook]: logbook },
          parseStatus: '',
          text: action.text,
        }
      } catch (cause) {
        const parseStatus = 'failed to parse sheet from text'

        console.error(parseStatus, cause)

        return {
          ...state,
          parseStatus,
          text: action.text,
        }
      }
  }
}
