import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { apiGet } from '../services/api.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const SLOTS = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM']

export function TailorDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [tailor, setTailor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [serviceType, setServiceType] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    apiGet(`/tailors/${id}`)
      .then(setTailor)
      .catch(() => setTailor(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleBookVisit = (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/auth')
      return
    }
    if (!serviceType || !selectedDate || !selectedSlot || !price) {
      setMessage('Please fill service, date, time and price.')
      return
    }
    const [hour, min, period] = selectedSlot.replace(':', ' ').split(' ')
    let h = parseInt(hour, 10)
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h = 0
    const scheduledAt = new Date(selectedDate)
    scheduledAt.setHours(h, parseInt(min, 10), 0, 0)
    addToCart({
      tailorId: tailor._id,
      tailorName: tailor.user?.name,
      tailorProfile: tailor,
      serviceType,
      scheduledAt: scheduledAt.toISOString(),
      price: Number(price),
      description: '',
    })
    navigate('/cart')
  }

  if (loading) return <div className="py-12 text-center text-slate-500">Loading...</div>
  if (!tailor) return <div className="py-12 text-center text-slate-600">Tailor not found. <Link to="/search" className="text-blue-600 hover:underline">Browse tailors</Link></div>

  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/search" className="hover:text-blue-600">Tailors</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{tailor.user?.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="aspect-[2/1] bg-slate-200 flex items-center justify-center">
              <span className="text-6xl font-semibold text-slate-400">{tailor.user?.name?.charAt(0)}</span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{tailor.user?.name}</h1>
                {tailor.isVerified && <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">VERIFIED</span>}
              </div>
              <p className="mt-2 text-slate-600">{tailor.bio || 'Master craftsman specializing in custom tailoring.'}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                <span>⏱ Experience {tailor.experienceYears || 0}+ years</span>
                <span>📍 {tailor.city || tailor.user?.city || '—'}</span>
                <span>★ {tailor.ratingAverage?.toFixed(1) || 'New'} ({tailor.ratingCount || 0} reviews)</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900">Portfolio</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-sm">Work {i}</div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900">Reviews</h2>
            <p className="mt-2 text-slate-600">★ {tailor.ratingAverage?.toFixed(1) || '—'} from {tailor.ratingCount || 0} reviews</p>
            <p className="mt-4 text-sm text-slate-500">Reviews are shown after customers complete their orders.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 sticky top-24">
            <h2 className="font-semibold text-slate-900">Book Home Visit</h2>
            <form onSubmit={handleBookVisit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Select Service</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Choose service</option>
                  <option value="Custom Suit">Custom Suit</option>
                  <option value="Blouse">Blouse</option>
                  <option value="Sherwani">Sherwani</option>
                  <option value="Lehenga">Lehenga</option>
                  <option value="Alteration">Alteration</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Select Date</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {nextDays.map((d) => (
                    <button
                      key={d.toISOString()}
                      type="button"
                      onClick={() => setSelectedDate(d.toISOString().slice(0, 10))}
                      className={`shrink-0 rounded-lg border px-3 py-2 text-sm ${selectedDate === d.toISOString().slice(0, 10) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 text-slate-700'}`}
                    >
                      {d.toLocaleDateString('en-US', { weekday: 'short' })} {d.getDate()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Available Slots</label>
                <div className="grid grid-cols-2 gap-2">
                  {SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-lg border py-2 text-sm ${selectedSlot === slot ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 text-slate-700'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Amount (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={tailor.basePrice || '0'}
                  min="0"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
                  required
                />
              </div>
              <p className="text-xs text-slate-500">Est. stitching time: 7–10 days. Deposit is deductible from final price.</p>
              {message && <p className="text-sm text-red-600">{message}</p>}
              <button type="submit" className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700">
                Book Visit • ₹{price || tailor.basePrice || 0} deposit
              </button>
            </form>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="text-sm font-medium text-slate-700">Pricing starts from</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>Custom suit: ₹{tailor.basePrice || 0}+</li>
                <li>Blouse / Shirt: from ₹{(tailor.basePrice || 0) * 0.4}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
