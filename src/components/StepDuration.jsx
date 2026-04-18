import { useState, useEffect } from 'react'

const N8N_BASE = 'https://lubiai.ca'
const DURATIONS = ['1hr', '2hr', '4hr', '8hr', '24hr']
const LABELS = { '1hr': '1 Hour', '2hr': '2 Hours', '4hr': '4 Hours', '8hr': '8 Hours', '24hr': '24 Hours' }

export default function StepDuration({ data, lotId, onNext, onBack }) {
  const [duration, setDuration] = useState(data.duration)
  const [prices, setPrices] = useState(null)
  const [lotName, setLotName] = useState('')
  const [occupancy, setOccupancy] = useState(null)
  const [capacity, setCapacity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${N8N_BASE}/webhook/parkskip-get-lot?lot_id=${lotId}`)
      .then(r => r.json())
      .then(d => {
        const lot = Array.isArray(d) ? d[0] : d
      if (!lot || lot.active === false) { setError("This lot is not verified or active. Please contact the lot owner."); setLoading(false); return }
        setPrices({ '1hr': lot.price_1hr, '2hr': lot.price_2hr, '4hr': lot.price_4hr, '8hr': lot.price_8hr, '24hr': lot.price_24hr })
        setLotName(lot.name)
        setCapacity(lot.capacity)
        setOccupancy(lot.current_occupancy)
        setLoading(false)
      })
      .catch(() => { setError('Could not load lot pricing.'); setLoading(false) })
  }, [lotId])

  if (loading) return <div className="card"><div className="card-title">Loading...</div><div className="card-subtitle">Fetching lot information</div></div>
  if (error) return <div className="card"><div className="card-title">Error</div><p style={{fontSize:'0.7rem',color:'var(--text-dim)',marginTop:'1rem'}}>{error}</p><button className="btn-back" onClick={onBack}>Back</button></div>

  return (
    <div className="card">
      <div className="card-title">Select Duration</div>
      <div className="card-subtitle">{lotName}</div>
      {capacity && <div className="card-subtitle" style={{fontSize:"0.65rem",opacity:0.7}}>{capacity - (occupancy||0)} of {capacity} spots available</div>}
      <div className="options-grid">
        {DURATIONS.filter(d => prices[d]).map(d => (
          <button key={d} className={`option-card ${duration === d ? 'selected' : ''}`} onClick={() => setDuration(d)}>
            <span className="option-label">{LABELS[d]}</span>
            <span className="option-sub">${Number(prices[d]).toFixed(2)} CAD</span>
          </button>
        ))}
      </div>
      <div className="btn-row">
        <button className="btn-primary" onClick={() => onNext({ duration, price: prices[duration] })} disabled={!duration}>Continue to Payment →</button>
        <button className="btn-back" onClick={onBack}>← Back</button>
      </div>
    </div>
  )
}
