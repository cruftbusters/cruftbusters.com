import { BalanceSheetView } from './BalanceSheetView'
import { useContext } from './context'

export function Editor() {
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
            value={state.activeLogbook}
          >
            {Object.keys(state.logbooks).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
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
        <h2>Balance</h2>
        <BalanceSheetView sheet={state.logbook} />
      </div>
    </>
  )
}
