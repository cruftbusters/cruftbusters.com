import './index.css'
import { Planning } from './Planning'
import { Link, Route, Routes } from 'react-router-dom'
import { LogbookApp } from './LogbookApp'

export function Logbook() {
  return (
    <div>
      <h1>Logbook</h1>
      <p>
        Logbook is a quick bean counter. The log sheet has one line per transfer
        between one credit and one debit account. The balance sheet will update
        in response to changes in the log sheet. The
        <code>{' select logbook '}</code>
        dropdown has an example featuring a few real account names from major
        account categories. Read the plan <Link to="planning">here</Link>.
      </p>
      <Routes>
        <Route index element={<LogbookApp />} />
        <Route path={'/planning'} element={<Planning />} />
      </Routes>
    </div>
  )
}
