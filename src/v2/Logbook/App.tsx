import { Route, Routes } from 'react-router-dom'
import { ContextProvider } from './context'
import { Editor } from './Editor'
import { Planning } from './Planning'
import { Landing } from './Landing'
import { NavLink } from './NavLink'

export function App() {
  return (
    <ContextProvider>
      <nav className="block-start">
        <NavLink to=".">Logbook</NavLink>
        <NavLink to="editor">Editor</NavLink>
        <NavLink to="planning">Planning</NavLink>
      </nav>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="editor" element={<Editor />} />
        <Route path="planning" element={<Planning />} />
      </Routes>
    </ContextProvider>
  )
}
