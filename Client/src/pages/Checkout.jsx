import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiPost } from '../services/api.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const HOME_VISIT_FEE = 25
const DELIVERY_FEE = 15

export function Checkout() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    navigate('/auth')
    return null
  }

  if (!cart) {
    navigate('/cart')
    return null
  }

  const total = (cart.price || 0) + HOME_VISIT_FEE + DELIVERY_FEE

  const handlePayNow = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const booking = await apiPost('/bookings', {
        tailorId: cart.tailorId,
        serviceType: cart.serviceType,
        description: cart.description || '',
        scheduledAt: cart.scheduledAt,
        price: total,
      })
      await apiPost(`/bookings/${booking._id}/mark-paid`, {})
      clearCart()
      navigate(`/payment-success/${booking._id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/cart" className="hover:text-blue-600">Cart</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Checkout</span>
      </nav>
      <h1 className="text-2xl font-bold text-slate-900">Secure Checkout</h1>
      <p className="mt-1 text-slate-600">Complete your payment to confirm your tailoring session at home.</p>

      <div className="mt-8 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Order Summary</h2>
          <div className="mt-4 flex gap-4">
            <div className="h-20 w-20 shrink-0 rounded-lg bg-slate-200" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">Master Tailor: {cart.tailorName}</p>
              <p className="text-sm text-slate-600">Service: {cart.serviceType} (Home Visit)</p>
              <span className="mt-2 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">Confirmed</span>
            </div>
            <p className="font-bold text-slate-900">₹{total}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Select Payment Method</h2>
          <div className="mt-4 flex gap-2">
            {['upi', 'card', 'netbank', 'cod'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize ${paymentMethod === m ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 text-slate-700'}`}
              >
                {m === 'upi' ? 'UPI' : m === 'card' ? 'Cards' : m === 'netbank' ? 'Net Banking' : 'COD'}
              </button>
            ))}
          </div>
          {paymentMethod === 'upi' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">Pay using UPI</label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="username@bank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
                />
                <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Verify</button>
              </div>
              <p className="mt-2 text-xs text-slate-500">A payment request will be sent to your UPI app.</p>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handlePayNow}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Processing...' : `Pay Now ₹${total}`}
          <span className="text-sm">🔒</span>
        </button>
        <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <span className="text-emerald-500">✓</span> SECURE 256-BIT SSL ENCRYPTED PAYMENT
        </p>
        <p className="text-center text-xs text-slate-400">POWERED BY Razorpay</p>
      </div>
    </div>
  )
}
