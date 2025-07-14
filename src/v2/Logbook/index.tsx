import './index.css'
import { Planning } from './Planning'
import { Link, Route, Routes } from 'react-router-dom'
import { LogbookApp } from './LogbookApp'

export function Logbook() {
  return (
    <div>
      <h1>Logbook</h1>
      <p>
        Logbook is a quick bean counter. Currently it supports whole number
        transfers between named accounts. The <code>{' select logbook '}</code>
        dropdown holds an example featuring a few real account names from each
        major account category. The balance sheet will update in response to
        changes in the log sheet. Read the plan <Link to="planning">here</Link>.
      </p>
      <Routes>
        <Route index element={<LogbookApp />} />
        <Route path={'/planning'} element={<Planning />} />
      </Routes>
    </div>
  )
}
