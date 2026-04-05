import { useState, useEffect } from 'react'
import StepPlate from './components/StepPlate'
import StepDuration from './components/StepDuration'
import StepCheckout from './components/StepCheckout'
import './App.css'

export default function App() {
  const [step, setStep] = useState(0)
  const [lotId, setLotId] = useState(null)
  const [data, setData] = useState({ plate: '', duration: '', price: 0 })

  const urlParams = new URLSearchParams(window.location.search)
  const success = urlParams.get('success')
  const plate = urlParams.get('plate')

  useEffect(() => {
    const id = urlParams.get('lot')
    if (id) setLotId(id)
  }, [])

  const next = (updates = {}) => {
    setData(d => ({ ...d, ...updates }))
    setStep(s => s + 1)
  }

  const back = () => setStep(s => s - 1)

  if (success === 'true') {
    return (
      <div className="app-shell">
        <header className="app-header">
          <div className="logo">P&S</div>
          <div className="brand">PARK<span>&</span>SKIP</div>
        </header>
        <div className="card">
          <div className="success-icon">✦</div>
          <div className="card-title">Payment Confirmed</div>
          <div className="card-subtitle">Your parking session is active</div>
          <p className="success-msg">Plate <strong>{plate}</strong> is registered.<br />You are good to go.</p>
          <button className="btn-primary" style={{marginTop:'2rem'}}
            onClick={() => window.location.href = '/park-skip/?lot=' + (urlParams.get('lot') || '')}>
            New Session
          </button>
        </div>
        <footer className="app-footer"><p>© {new Date().getFullYear()} Park&Skip</p></footer>
      </div>
    )
  }

  if (!lotId && step === 0 && !urlParams.get('lot')) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <div className="logo">P&S</div>
          <div className="brand">PARK<span>&</span>SKIP</div>
        </header>
        <div className="card">
          <div className="card-title">Scan QR Code</div>
          <div className="card-subtitle">No lot found</div>
          <p style={{fontSize:'0.7rem',color:'var(--text-dim)',marginTop:'1rem'}}>Please scan the QR code at your parking location.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo">P&S</div>
        <div className="brand">PARK<span>&</span>SKIP</div>
        <div className="tagline">Fast. Simple. Parking.</div>
      </header>
      <div className="step-indicator">
        {[1,2,3].map(i => (
          <div key={i} className={`step-dot ${i===step+1?'active':''} ${i<step+1?'done':''}`}>
            <span>{i}</span>
          </div>
        ))}
      </div>
      <div className="card-container">
        {step === 0 && <StepPlate data={data} onNext={next} />}
        {step === 1 && <StepDuration data={data} lotId={lotId} onNext={next} onBack={back} />}
        {step === 2 && <StepCheckout data={data} lotId={lotId} onBack={back} />}
      </div>
      <footer className="app-footer"><p>© {new Date().getFullYear()} Park&Skip</p></footer>
    </div>
  )
}
