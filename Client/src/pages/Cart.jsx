import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const HOME_VISIT_FEE = 25

export function Cart() {
  const { cart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/auth')
    return null
  }

  if (!cart) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
        <p className="mt-4 text-slate-600">Your cart is empty.</p>
        <Link to="/search" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">Find Tailors</Link>
      </div>
    )
  }

  const fabricCost = 0
  const stitchingCharge = cart.price || 0
  const homeVisitFee = HOME_VISIT_FEE
  const deliveryFee = 15
  const total = fabricCost + stitchingCharge + homeVisitFee + deliveryFee

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Shopping Cart</span>
      </nav>
      <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">✂</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">Stitching Service</p>
                <p className="text-sm text-slate-600">Master Tailor: {cart.tailorName}</p>
                <p className="mt-1 text-sm text-slate-600">Service: {cart.serviceType}</p>
                <span className="mt-2 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">TOP RATED</span>
              </div>
              <p className="font-semibold text-slate-900">₹{stitchingCharge}</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">🏠</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">Home Measurement Visit</p>
                <p className="text-sm text-slate-600">Scheduled for {cart.scheduledAt ? new Date(cart.scheduledAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : '—'}</p>
                <p className="text-xs text-slate-500">Professional measurement assistant will visit your home.</p>
              </div>
              <p className="font-semibold text-slate-900">₹{homeVisitFee}</p>
            </div>
          </div>
        </div>

        <div className="h-fit rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            {fabricCost > 0 && <div className="flex justify-between"><span>Fabric Cost</span><span>₹{fabricCost}</span></div>}
            <div className="flex justify-between"><span>Stitching Charge</span><span>₹{stitchingCharge}</span></div>
            <div className="flex justify-between"><span>Home Visit Fee</span><span>₹{homeVisitFee}</span></div>
            <div className="flex justify-between"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
          </div>
          <p className="mt-4 flex justify-between font-semibold text-slate-900">Total <span>₹{total}</span></p>
          <div className="mt-4">
            <input type="text" placeholder="Enter promo code" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            <button type="button" className="mt-2 w-full rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Apply</button>
          </div>
          <Link to="/checkout" className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700">
            Proceed to Payment →
          </Link>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span className="text-emerald-500">✓</span> Secure checkout
          </p>
        </div>
      </div>
    </div>
  )
}
