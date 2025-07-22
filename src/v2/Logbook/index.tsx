import './index.css'
import { Planning } from './Planning'
import { Link, Route, Routes } from 'react-router-dom'
import { App } from './App'

export function Logbook() {
  return (
    <div>
      <h1>Logbook</h1>
      <nav>
        <Link to=".">App</Link>
        <Link to="./planning">Planning</Link>
      </nav>
      <Routes>
        <Route path="*" element={<App />} />
        <Route path="planning" element={<Planning />} />
      </Routes>
    </div>
  )
}
