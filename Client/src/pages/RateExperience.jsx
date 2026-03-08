import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiGet, apiPost } from '../services/api.js'

export function RateExperience() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [stitchingQuality, setStitchingQuality] = useState(75)
  const [timeliness, setTimeliness] = useState(80)
  const [communication, setCommunication] = useState(90)
  const [reviewComment, setReviewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) {
      setMessage('Please select an overall rating.')
      return
    }
    setSubmitting(true)
    setMessage('')
    try {
      const comment = [
        `Stitching: ${stitchingQuality}%`,
        `Timeliness: ${timeliness}%`,
        `Communication: ${communication}%`,
        reviewComment,
      ].filter(Boolean).join('. ')
      await apiPost(`/bookings/${id}/review`, { rating, reviewComment: comment })
      setMessage('Thank you! Your review has been submitted.')
      setTimeout(() => (window.location.href = '/bookings'), 1500)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="py-12 text-center text-slate-500">Loading...</div>
  if (!booking) return <div className="py-12 text-center text-slate-600">Order not found. <Link to="/bookings" className="text-blue-600 hover:underline">My Bookings</Link></div>

  const tailorName = booking.tailorProfile?.user?.name || 'Tailor'

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Rate Your Experience</h1>
      <div className="mt-6 flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-semibold text-slate-500">{tailorName.charAt(0)}</div>
        <h2 className="mt-3 text-lg font-semibold text-slate-900">Rate {tailorName}</h2>
        <p className="mt-1 text-sm text-slate-600">Thank you for choosing TailorOnDemand! Your feedback helps our community grow.</p>
        <p className="mt-2 text-xs text-slate-500">Order #{booking._id?.toString().slice(-6)} • Delivered</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-medium text-slate-900">How was your overall experience?</h3>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRating(r)}
                className={`rounded p-2 text-2xl ${rating >= r ? 'text-amber-400' : 'text-slate-300 hover:text-amber-200'}`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">Tap to rate</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-medium text-slate-900">Detailed Feedback</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm text-slate-700">Stitching Quality</label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-slate-500">Poor</span>
                <input type="range" min="0" max="100" value={stitchingQuality} onChange={(e) => setStitchingQuality(Number(e.target.value))} className="flex-1" />
                <span className="text-xs text-slate-500">Excellent</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-700">Timeliness</label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-slate-500">Very Late</span>
                <input type="range" min="0" max="100" value={timeliness} onChange={(e) => setTimeliness(Number(e.target.value))} className="flex-1" />
                <span className="text-xs text-slate-500">On Time</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-700">Behavior & Communication</label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-slate-500">Rude</span>
                <input type="range" min="0" max="100" value={communication} onChange={(e) => setCommunication(Number(e.target.value))} className="flex-1" />
                <span className="text-xs text-slate-500">Professional</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-medium text-slate-900">Write Your Review</h3>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Tell us about the fitting, the fabric handling, and your overall thoughts..."
            rows={4}
            className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
          />
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm font-medium text-slate-700">Show off your garment</p>
          <p className="mt-1 text-xs text-slate-500">Photo upload coming soon</p>
        </div>

        {message && <p className={`text-sm ${message.includes('Thank') ? 'text-emerald-600' : 'text-red-600'}`}>{message}</p>}

        <div className="flex gap-4">
          <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            Submit Review
          </button>
          <Link to="/bookings" className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
