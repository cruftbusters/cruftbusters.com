import { Route, Routes } from 'react-router-dom'
import { Logbook } from './Logbook'
import { Home } from './Home'

export default function Index() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path={'/apps/logbook/*'} element={<Logbook />} />
    </Routes>
  )
}
