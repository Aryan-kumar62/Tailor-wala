import React, { useEffect, useState } from 'react'
import { apiGet, apiPatch, apiPost } from '../services/api.js'

const statusOptions = [
  'measurement_done',
  'stitching',
  'ready_for_delivery',
  'out_for_delivery',
  'delivered',
  'cancelled',
]

const statusLabels = {
  pending: 'Pending',
  measurement_scheduled: 'Measurement scheduled',
  measurement_done: 'Measurements done',
  stitching: 'Stitching in progress',
  ready_for_delivery: 'Ready for delivery',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const TailorDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [measurements, setMeasurements] = useState([
    { name: 'Chest', value: '', unit: 'inch' },
    { name: 'Waist', value: '', unit: 'inch' },
  ])
  const [message, setMessage] = useState('')

  const loadBookings = async () => {
    setLoading(true)
    setMessage('')
    try {
      const data = await apiGet('/bookings/tailor')
      setBookings(data)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleStatusChange = async (bookingId, status) => {
    try {
      await apiPatch(`/bookings/${bookingId}/status`, { status })
      await loadBookings()
    } catch (err) {
      setMessage(err.message)
    }
  }

  const updateMeasurementField = (index, key, value) => {
    setMeasurements((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [key]: value } : m)),
    )
  }

  const addMeasurementRow = () => {
    setMeasurements((prev) => [...prev, { name: '', value: '', unit: 'inch' }])
  }

  const saveMeasurements = async (e) => {
    e.preventDefault()
    if (!selectedBooking) return
    try {
      await apiPost(`/bookings/${selectedBooking._id}/measurements`, {
        measurements: measurements.filter((m) => m.name && m.value),
      })
      setSelectedBooking(null)
      setMeasurements([
        { name: 'Chest', value: '', unit: 'inch' },
        { name: 'Waist', value: '', unit: 'inch' },
      ])
      await loadBookings()
      setMessage('Measurements saved.')
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[3fr,2fr]">
      <div className="space-y-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Tailor Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            View your upcoming home visits and update order status.
          </p>
        </div>

        {message && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-slate-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            No bookings yet. Once customers start booking you, they will show up
            here.
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      {b.serviceType}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {b.customer?.name}
                    </div>
                    <div className="text-xs text-slate-600">
                      {b.customer?.city} {b.customer?.pincode}
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      Visit:{' '}
                      {b.scheduledAt
                        ? new Date(b.scheduledAt).toLocaleString()
                        : '—'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                      {statusLabels[b.status] || b.status}
                    </span>
                    <span className="text-slate-700">
                      ₹{b.price?.toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(b._id, s)}
                      className={`rounded-full border px-2 py-0.5 ${
                        b.status === s
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-300 text-slate-600 hover:border-blue-400'
                      }`}
                    >
                      {statusLabels[s]}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="ml-auto rounded-full border border-slate-300 px-2 py-0.5 text-[11px] text-slate-700 hover:border-blue-500"
                  >
                    Add measurements
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-slate-700">
          Measurement sheet
        </h2>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
          {!selectedBooking ? (
            <p className="text-slate-600">
              Select a booking and fill customer measurements during your home
              visit. This will be stored along with the order.
            </p>
          ) : (
            <form onSubmit={saveMeasurements} className="space-y-3">
              <div className="rounded-lg bg-slate-100 p-3 text-slate-700">
                <div className="font-medium">
                  {selectedBooking.customer?.name}
                </div>
                <div className="text-slate-600">
                  {selectedBooking.serviceType}
                </div>
              </div>
              <div className="space-y-2">
                {measurements.map((m, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[2fr,1fr,1fr] gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Part (Chest, Waist...)"
                      value={m.name}
                      onChange={(e) =>
                        updateMeasurementField(index, 'name', e.target.value)
                      }
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Value"
                      value={m.value}
                      onChange={(e) =>
                        updateMeasurementField(index, 'value', e.target.value)
                      }
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-blue-500"
                    />
                    <select
                      value={m.unit}
                      onChange={(e) =>
                        updateMeasurementField(index, 'unit', e.target.value)
                      }
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 outline-none focus:border-blue-500"
                    >
                      <option value="inch">inch</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMeasurementRow}
                  className="text-[11px] text-blue-600 hover:text-blue-700"
                >
                  + Add measurement row
                </button>
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                Save measurements
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

