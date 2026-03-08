import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiGet } from '../services/api.js'

export function PaymentSuccess() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    apiGet(`/bookings/${id}`)
      .then(setBooking)
      .catch(() => setBooking(null))
      .finally(() => setLoading(false))
  }, [id])

  const estDelivery = booking?.scheduledAt ? (() => {
    const d = new Date(booking.scheduledAt)
    d.setDate(d.getDate() + 10)
    return d
  })() : null

  if (loading) return <div className="py-12 text-center text-slate-500">Loading...</div>

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Payment Successful</h1>
        <p className="mt-2 text-blue-600 font-medium">Order Confirmed</p>
        <p className="text-sm text-slate-500">Order ID: #{booking?._id?.toString().slice(-8).toUpperCase() || id}</p>

        {booking && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
            <h2 className="font-semibold text-slate-900">Order Summary</h2>
            <div className="mt-3 flex gap-4">
              <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-200" />
              <div className="min-w-0 flex-1 text-sm">
                <p><span className="text-slate-500">Service</span> {booking.serviceType}</p>
                <p><span className="text-slate-500">Booking Date</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
                <p><span className="text-slate-500">Tailor</span> {booking.tailorProfile?.user?.name || '—'}</p>
                <p><span className="text-slate-500">Total Paid</span> ₹{booking.price}</p>
              </div>
            </div>
          </div>
        )}

        {estDelivery && (
          <div className="mt-4 flex items-center justify-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <span className="text-blue-600">🚚</span>
            <div className="text-left">
              <p className="text-sm font-medium text-slate-900">Estimated Handover Date</p>
              <p className="text-slate-600">{estDelivery.toLocaleDateString('en-US')} (10 days from today)</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/bookings" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">
            Track My Order
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 hover:bg-slate-50">
            Go to Home
          </Link>
        </div>
        <p className="mt-4 text-xs text-slate-500">A confirmation email has been sent to your registered email address.</p>
        <p className="mt-1 text-xs text-slate-500">Need help? <Link to="/support" className="text-blue-600 hover:underline">Contact Support</Link></p>
      </div>
    </div>
  )
}
