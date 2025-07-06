import { Route, Routes } from 'react-router-dom'
import { Logbook } from './Logbook'

export default function Index() {
  return (
    <Routes>
      <Route
        index
        element={
          <div>
            <h1>Cruftbusters</h1>
            <p>Cruftbusters is a flywheel for software.</p>
            <h2>Principal</h2>
            <div className="block">
              <div>Tyler Johnson</div>
              <div>Bothell, Washington, USA</div>
              <div>
                <a href="mailto:tyler@cruftbusters.com">
                  tyler@cruftbusters.com
                </a>
              </div>
              <div>
                <a href="tel:+16123562513">(612) 356-2513</a>
              </div>
            </div>
            <h2>Links</h2>
            <p>
              <a href="/apps/logbook">Logbook</a>
            </p>
          </div>
        }
      />
      <Route path={'/apps/logbook'} element={<Logbook />} />
    </Routes>
  )
}
