import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Onboard from './pages/Onboard.jsx'
import OnboardComplete from './pages/OnboardComplete.jsx'
import Admin from './pages/Admin.jsx'
import './index.css'

const path = window.location.pathname

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {path === '/onboard' ? <Onboard /> : 
     path === '/onboard-complete' ? <OnboardComplete /> : 
     path === '/admin' ? <Admin /> : 
     <App />}
  </React.StrictMode>
)
