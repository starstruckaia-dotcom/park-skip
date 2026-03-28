import { useState } from 'react'

const DURATIONS = [
  { id: '1hr', label: '1 Hour', base: 3.00 },
  { id: '2hr', label: '2 Hours', base: 5.00 },
  { id: '4hr', label: '4 Hours', base: 9.00 },
  { id: '8hr', label: '8 Hours', base: 15.00 },
  { id: '24hr', label: '24 Hours', base: 25.00 },
]

const FEE_RATE = 0.15

export default function StepDuration({ data, onNext, onBack }) {
  const [duration, setDuration] = useState(data.duration)

  const selected = DURATIONS.find(d => d.id === duration)
  const base = selected?.base || 0
  const fee = parseFloat((base * FEE_RATE).toFixed(2))
  const total = parseFloat((base + fee).toFixed(2))

  const handleNext = () => {
    if (!selected) return
    onNext({ duration, base_amount: base, fee_amount: fee, total })
  }

  return (
    <div className="card">
      <div className="card-title">Premium Duration</div>
      <div className="card-subtitle">Temporal Parking Allocation</div>

      <div className="options-grid">
        {DURATIONS.map(d => (
          <button
            key={d.id}
            className={`option-card ${duration === d.id ? 'selected' : ''}`}
            onClick={() => setDuration(d.id)}
          >
            <span className="option-label">{d.label}</span>
            <span className="option-sub">${d.base.toFixed(2)} base rate</span>
          </button>
        ))}
      </div>

      <div className="btn-row">
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={!duration}
        >
          Proceed to Premium Review →
        </button>
        <button className="btn-back" onClick={onBack}>← Back</button>
      </div>
    </div>
  )
}
