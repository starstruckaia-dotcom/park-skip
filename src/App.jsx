import { useState } from 'react'
import StepPlate from './components/StepPlate'
import StepZone from './components/StepZone'
import StepDuration from './components/StepDuration'
import StepReview from './components/StepReview'
import './App.css'

const STEPS = ['PLATE', 'ZONE', 'DURATION', 'REVIEW']

export default function App() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    plate: '',
    zone: '',
    duration: '',
    base_amount: 0,
    fee_amount: 0,
    total: 0,
    layer_count: 1,
  })

  const next = (updates = {}) => {
    setData(d => ({ ...d, ...updates }))
    setStep(s => s + 1)
  }

  const back = () => setStep(s => s - 1)

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo">P&amp;S</div>
        <div className="brand">PARK<span>&amp;</span>SKIP</div>
        <div className="tagline">Premium Urban Parking Solutions™</div>
      </header>

      <div className="step-indicator">
        {STEPS.map((s, i) => (
          <div key={s} className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <span>{i + 1}</span>
          </div>
        ))}
      </div>

      <div className="card-container">
        {step === 0 && <StepPlate data={data} onNext={next} />}
        {step === 1 && <StepZone data={data} onNext={next} onBack={back} />}
        {step === 2 && <StepDuration data={data} onNext={next} onBack={back} />}
        {step === 3 && <StepReview data={data} onBack={back} />}
      </div>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Park&amp;Skip Premium Parking Solutions Inc.</p>
        <p>Premium convenience fee is non-refundable, for conviance.</p>
      </footer>
    </div>
  )
}
