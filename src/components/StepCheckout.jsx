import { useState } from 'react'

const N8N_BASE = 'https://lubiai.ca'

export default function StepCheckout({ data, lotId, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${N8N_BASE}/webhook/parkskip-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lot_id: lotId, plate: data.plate, duration: data.duration })
      })
      const json = await res.json()
      if (json.url) {
        window.location.href = json.url
      } else {
        setError('Could not create payment session. Please try again.')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-title">Confirm & Pay</div>
      <div className="card-subtitle">Review your session</div>

      <div className="review-rows">
        <div className="review-row">
          <span>Plate</span>
          <span className="review-val">{data.plate}</span>
        </div>
        <div className="review-row">
          <span>Duration</span>
          <span className="review-val">{data.duration}</span>
        </div>
        <div className="review-divider" />
        <div className="review-row total">
          <span>Total</span>
          <span className="review-val gold">${Number(data.price).toFixed(2)} CAD</span>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="btn-row" style={{marginTop: '1.5rem'}}>
        <button className="btn-primary" onClick={handlePayment} disabled={loading}>
          {loading ? 'Redirecting to payment...' : 'Pay Now →'}
        </button>
        <button className="btn-back" onClick={onBack}>← Back</button>
      </div>
    </div>
  )
}
