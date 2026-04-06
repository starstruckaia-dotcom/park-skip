import { useState } from 'react'

const ZONES = [
  { id: 'A', label: 'Zone A', sub: 'Central' },
  { id: 'B', label: 'Zone B', sub: 'Adjacent' },
  { id: 'C', label: 'Zone C', sub: 'Peripheral' },
  { id: 'D', label: 'Zone D', sub: 'Remote' },
]

export default function StepZone({ data, onNext, onBack }) {
  const [zone, setZone] = useState(data.zone)

  return (
    <div className="card">
      <div className="card-title">Parking Zone</div>
      <div className="card-subtitle">Spatial Allocation Selection</div>

      <div className="options-grid cols-2">
        {ZONES.map(z => (
          <button
            key={z.id}
            className={`option-card ${zone === z.id ? 'selected' : ''}`}
            onClick={() => setZone(z.id)}
          >
            <span className="option-label">{z.label}</span>
            <span className="option-sub">{z.sub}</span>
          </button>
        ))}
      </div>

      <div className="btn-row">
        <button
          className="btn-primary"
          onClick={() => onNext({ zone })}
          disabled={!zone}
        >
          Proceed to Duration Selection →
        </button>
        <button className="btn-back" onClick={onBack}>← Back</button>
      </div>
    </div>
  )
}
