import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div>
      <h1>Cruftbusters</h1>
      <p>Cruftbusters is a flywheel for software.</p>
      <h2>Principal</h2>
      <div className="block">
        <div>Tyler Johnson</div>
        <div>Bothell, Washington, USA</div>
        <div>
          <a href="mailto:tyler@cruftbusters.com">tyler@cruftbusters.com</a>
        </div>
        <div>
          <a href="tel:+16123562513">(612) 356-2513</a>
        </div>
      </div>
      <h2>Apps</h2>
      <p>
        <Link to="/apps/logbook">Logbook</Link>
      </p>
    </div>
  )
}
