import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiGet } from '../services/api.js'

const STATUS_LABELS = {
  pending: 'Pending',
  measurement_scheduled: 'Measurement Scheduled',
  measurement_done: 'Measurements Done',
  stitching: 'Stitching in Progress',
  ready_for_delivery: 'Ready for Delivery',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export function BookingDetail() {
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

  if (loading) return <div className="py-12 text-center text-slate-500">Loading...</div>
  if (!booking) return <div className="py-12 text-center text-slate-600">Order not found. <Link to="/bookings" className="text-blue-600 hover:underline">My Bookings</Link></div>

  const estDelivery = booking.scheduledAt ? (() => {
    const d = new Date(booking.scheduledAt)
    d.setDate(d.getDate() + 10)
    return d
  })() : null

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/bookings" className="hover:text-blue-600">My Bookings</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Order #{booking._id?.toString().slice(-8)}</span>
      </nav>
      <h1 className="text-2xl font-bold text-slate-900">Order Details</h1>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">{STATUS_LABELS[booking.status] || booking.status}</span>
          <span className="font-semibold text-slate-900">₹{booking.price}</span>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <p><span className="text-slate-500">Service</span> {booking.serviceType}</p>
          <p><span className="text-slate-500">Tailor</span> {booking.tailorProfile?.user?.name || '—'}</p>
          <p><span className="text-slate-500">Visit</span> {booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : '—'}</p>
          <p><span className="text-slate-500">Payment</span> {booking.paymentStatus}</p>
        </div>
        {estDelivery && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <span>🚚</span>
            <div>
              <p className="text-sm font-medium text-slate-900">Estimated Handover</p>
              <p className="text-slate-600">{estDelivery.toLocaleDateString()}</p>
            </div>
          </div>
        )}
        <Link to="/bookings" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">← Back to all orders</Link>
      </div>
    </div>
  )
}
