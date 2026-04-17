import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Onboard from './pages/Onboard.jsx'
import OnboardComplete from './pages/OnboardComplete.jsx'
import Admin from './pages/Admin.jsx'
import Patrol from './pages/Patrol.jsx'
import Owner from './pages/Owner.jsx'
import './index.css'

const path = window.location.pathname

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {path === '/onboard' ? <Onboard /> :
     path === '/onboard-complete' ? <OnboardComplete /> :
     path === '/admin' ? <Admin /> :
     path === '/patrol' ? <Patrol /> :
     path === '/owner' ? <Owner /> :
     <App />}
  </React.StrictMode>
)
