import { useNavigate } from 'react-router-dom'
import { useContext } from './context'

export function Browser() {
  const [state, dispatch] = useContext()

  const navigate = useNavigate()

  return (
    <div className="block">
      <div className="browser">
        <div className="browser-row browser-header">
          <div />
          <div>id</div>
          <div>name</div>
        </div>
        {Object.values(state.logbooks).map(({ id, name }) => (
          <div key={id} className="browser-row">
            <button
              onClick={() => {
                dispatch({ type: 'setActiveLogbook', id })
                navigate('../editor')
              }}
            >
              edit
            </button>
            <div>{id}</div>
            <input
              value={name}
              onChange={(e) =>
                dispatch({ type: 'rename', id, name: e.target.value })
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}
