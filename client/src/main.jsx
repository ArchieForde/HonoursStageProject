import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Main-page.css'
import App from './Main-page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
