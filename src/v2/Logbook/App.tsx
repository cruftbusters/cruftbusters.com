import { BalanceSheetView } from './BalanceSheetView'
import { useContext, ContextProvider } from './context'

export function App() {
  return (
    <ContextProvider>
      <p>
        Logbook is a quick bean counter. Each record moves something from one
        account to another.
      </p>
      <Editor />
    </ContextProvider>
  )
}

function Editor() {
  const [state, dispatch] = useContext()

  return (
    <>
      <p hidden={state.textParseStatus === ''}>{state.textParseStatus}</p>
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
        <BalanceSheetView logbook={state.logbook} />
      </div>
    </>
  )
}
