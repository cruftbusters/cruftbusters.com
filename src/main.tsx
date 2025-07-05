import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './v2/index.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Index />
    </BrowserRouter>
  </StrictMode>,
)
