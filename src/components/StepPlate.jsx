import { useState } from 'react'

export default function StepPlate({ data, onNext }) {
  const [plate, setPlate] = useState(data.plate)

  const handleNext = () => {
    if (plate.trim().length >= 2) onNext({ plate: plate.trim().toUpperCase() })
  }

  return (
    <div className="card">
      <div className="card-title">Premium Plate</div>
      <div className="card-subtitle">Registration Identification Protocol</div>

      <input
        className="premium-input"
        type="text"
        placeholder="ABC 123"
        value={plate}
        onChange={e => setPlate(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleNext()}
        maxLength={10}
        autoFocus
      />
      <span className="input-label">Enter your premium vehicle registration</span>

      <div className="btn-row">
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={plate.trim().length < 2}
        >
          Proceed to Zone Selection →
        </button>
      </div>
    </div>
  )
}
