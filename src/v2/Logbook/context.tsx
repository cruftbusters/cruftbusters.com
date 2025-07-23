import {
  createContext,
  Dispatch,
  PropsWithChildren,
  Reducer,
  useContext as useReactContext,
  useReducer,
} from 'react'
import { TextSheet } from './TextSheet'

const defaultState = createDefaultState({
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
})

function createDefaultState(defaultEntries: Record<string, TextSheet>) {
  const defaultIdName = Object.keys(defaultEntries)[0]

  const defaultLogbooks = Object.entries(defaultEntries).reduce(
    (logbooks, [name, sheet]) =>
      Object.assign(logbooks, { [name]: { id: name, name, sheet } }),
    {} as Record<string, Logbook>,
  )

  return {
    id: defaultIdName,
    logbook: defaultLogbooks[defaultIdName],
    logbooks: defaultLogbooks,
    textParseStatus: '',
    text: defaultLogbooks[defaultIdName].sheet.toText(),
  }
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

export type Logbook = { id: string; name: string; sheet: TextSheet }

type State = {
  id: string
  logbook: Logbook
  logbooks: Record<string, Logbook>
  textParseStatus: string
  text: string
}

type Action =
  | { type: 'setActiveLogbook'; id: string }
  | { type: 'setText'; text: string }
  | { type: 'rename'; id: string; name: string }

const reducer: Reducer<State, Action> = (state: State, action: Action) => {
  switch (action.type) {
    case 'setActiveLogbook':
      const logbook = state.logbooks[action.id]

      return {
        ...state,
        id: action.id,
        logbook,
        text: logbook.sheet.toText(),
      }
    case 'setText':
      try {
        const logbook = {
          ...state.logbook,
          sheet: TextSheet.parse(action.text),
        }

        return {
          ...state,
          logbook,
          logbooks: { ...state.logbooks, [state.id]: logbook },
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
    case 'rename': {
      const logbook = state.logbooks[action.id]

      return {
        ...state,
        logbooks: {
          ...state.logbooks,
          [action.id]: { ...logbook, name: action.name },
        },
      }
    }
  }
}
