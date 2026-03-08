import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiGet } from '../services/api.js'

export function MeasurementProfile() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [measurements, setMeasurements] = useState([
    { name: 'Chest', value: '', unit: 'cm' },
    { name: 'Waist', value: '', unit: 'cm' },
    { name: 'Hips', value: '', unit: 'cm' },
    { name: 'Shoulder Width', value: '', unit: 'cm' },
    { name: 'Sleeve Length', value: '', unit: 'cm' },
    { name: 'Full Length', value: '', unit: 'cm' },
  ])
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    apiGet('/bookings/my')
      .then((data) => {
        setBookings(data)
        const lastWithMeasurements = data.find((b) => b.measurements?.length > 0)
        if (lastWithMeasurements?.measurements) {
          setMeasurements((prev) =>
            prev.map((p) => {
              const m = lastWithMeasurements.measurements.find((x) => x.name?.toLowerCase().includes(p.name.toLowerCase().slice(0, 4)))
              return m ? { ...p, value: m.value, unit: m.unit || 'cm' } : p
            })
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const lastUpdated = bookings.find((b) => b.measurements?.length)?.updatedAt

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">My Measurement Profile</span>
      </nav>
      <h1 className="text-2xl font-bold text-slate-900">My Measurement Profile</h1>
      <p className="mt-1 text-slate-600">Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleDateString() : 'Never'} • Profile: Slim Fit Standard</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900">Body Visualization</h2>
            <div className="mt-4 aspect-[3/4] rounded-lg bg-slate-100 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <p className="text-sm">Chest</p>
                <p className="text-sm">Waist</p>
                <p className="text-sm">Hips</p>
                <p className="text-sm">Sleeve</p>
                <p className="text-sm">Shoulder</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-xs font-medium uppercase text-slate-500">Height</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{height || '—'} cm</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-xs font-medium uppercase text-slate-500">Weight</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{weight || '—'} kg</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Key Measurements</h2>
              <button type="button" onClick={() => setEditing(!editing)} className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Edit Measurements
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">Metric (cm)</p>
            <div className="mt-4 space-y-3">
              {measurements.map((m) => (
                <div key={m.name} className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-700">{m.name}</span>
                  <span className="font-semibold text-slate-900">{m.value || '—'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900">Special Instructions</h2>
            <p className="mt-3 text-slate-600">{specialInstructions || 'No special instructions saved. Add preferences like fit, shoulder structure, or cuff style.'}</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <p className="font-medium text-slate-900">Ready to order? Your measurements are verified.</p>
            <Link to="/search" className="mt-3 inline-block rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">Find a Tailor</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
