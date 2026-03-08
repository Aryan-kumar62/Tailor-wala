import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, apiPost } from '../services/api.js'

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

export function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await apiGet('/bookings/my')
      setBookings(data)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleMarkPaid = async (id) => {
    try {
      await apiPost(`/bookings/${id}/mark-paid`, {})
      await load()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
      <p className="mt-1 text-slate-600">Track your tailoring orders and payments.</p>

      {message && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{message}</p>}

      {loading ? (
        <div className="mt-8 py-12 text-center text-slate-500">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center text-slate-500">
          <p>You have no bookings yet.</p>
          <Link to="/search" className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">Find Tailors</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{b.serviceType}</p>
                  <p className="text-sm text-slate-600">Tailor: {b.tailorProfile?.user?.name || '—'}</p>
                  <p className="text-sm text-slate-500">Visit: {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : '—'}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${b.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                      {STATUS_LABELS[b.status] || b.status}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${b.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {b.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-slate-900">₹{b.price}</p>
                  {b.paymentStatus !== 'paid' && (
                    <button onClick={() => handleMarkPaid(b._id)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Mark as Paid
                    </button>
                  )}
                  {b.status === 'delivered' && !b.rating && (
                    <Link to={`/rate/${b._id}`} className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
                      Rate Experience
                    </Link>
                  )}
                  <Link to={`/bookings/${b._id}`} className="text-sm font-medium text-blue-600 hover:underline">Track</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
