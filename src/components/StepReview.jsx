import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import './StepReview.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function StepReview({ data, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const stripe = await stripePromise

      // Create a Stripe Checkout session via Stripe's client-only integration
      // Since we have no backend, we'll use Stripe Payment Links or direct charge
      // For now we redirect to a Stripe Payment Link with metadata as URL params
      // In production, you'd call your backend to create a checkout session

      // Build a simple payment page redirect with Stripe.js
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {
            price_data: {
              currency: 'cad',
              product_data: {
                name: `Park&Skip — Zone ${data.zone} (${data.duration})`,
                description: `Premium parking for plate ${data.plate}. Includes 15% premium convenience fee.`,
              },
              unit_amount: Math.round(data.total * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        successUrl: `${window.location.origin}/park-skip/?success=true&plate=${data.plate}`,
        cancelUrl: `${window.location.origin}/park-skip/`,
        clientReferenceId: data.plate,
        metadata: {
          plate: data.plate,
          zone: data.zone,
          duration: data.duration,
          base_amount: data.base_amount,
          fee_amount: data.fee_amount,
          total: data.total,
          layer_count: data.layer_count,
        },
      })

      if (error) setError(error.message)
    } catch (err) {
      setError('A premium error has occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle success redirect
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('success') === 'true') {
    return (
      <div className="card">
        <div className="success-icon">✦</div>
        <div className="card-title">Transaction Authorized</div>
        <div className="card-subtitle">Premium Session Confirmed</div>
        <p className="success-msg">
          Your premium parking session has been authorized.<br />
          Welcome to the premium experience.
        </p>
        <p className="success-plate">Plate: {urlParams.get('plate')}</p>
        <button className="btn-primary" style={{marginTop:'2rem'}} onClick={() => window.location.href = '/park-skip/'}>
          Initiate New Premium Session →
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-title">Premium Review</div>
      <div className="card-subtitle">Transaction Authorization Summary</div>

      <div className="review-rows">
        <div className="review-row">
          <span>Vehicle Registration</span>
          <span className="review-val">{data.plate}</span>
        </div>
        <div className="review-row">
          <span>Premium Zone</span>
          <span className="review-val">Zone {data.zone}</span>
        </div>
        <div className="review-row">
          <span>Duration</span>
          <span className="review-val">{data.duration}</span>
        </div>
        <div className="review-divider" />
        <div className="review-row">
          <span>Base Rate</span>
          <span className="review-val">${data.base_amount.toFixed(2)}</span>
        </div>
        <div className="review-row">
          <span>Premium Convenience Fee™</span>
          <span className="review-val gold">${data.fee_amount.toFixed(2)}</span>
        </div>
        <div className="review-row total">
          <span>Total Premium Amount</span>
          <span className="review-val gold">${data.total.toFixed(2)} CAD</span>
        </div>
      </div>

      <p className="fine-print">
        * Premium convenience fee is mandatory, non-negotiable, and enhances your premium experience.
        By proceeding you agree to our Premium Terms of Premium Service (Premium Edition).
      </p>

      {error && <p className="error-msg">{error}</p>}

      <div className="btn-row" style={{marginTop: '1.5rem'}}>
        <button
          className="btn-primary"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Authorizing Premium Transaction...' : 'Authorize Premium Transaction →'}
        </button>
        <button className="btn-back" onClick={onBack}>← Back</button>
      </div>
    </div>
  )
}
