import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Onboard from './pages/Onboard.jsx'
import './index.css'

const path = window.location.pathname

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {path === '/onboard' ? <Onboard /> : <App />}
  </React.StrictMode>
)
