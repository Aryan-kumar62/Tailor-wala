import React, { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../services/api.js'

export const TailorProfilePage = () => {
  const [form, setForm] = useState({
    bio: '',
    experienceYears: '',
    specializations: '',
    basePrice: '',
    city: '',
    pincode: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const loadProfile = async () => {
    setLoading(true)
    setMessage('')
    try {
      const profile = await apiGet('/tailors/profile/me')
      if (profile) {
        setForm({
          bio: profile.bio || '',
          experienceYears: profile.experienceYears || '',
          specializations: (profile.specializations || []).join(', '),
          basePrice: profile.basePrice || '',
          city: profile.city || '',
          pincode: profile.pincode || '',
        })
      }
    } catch (err) {
      // Ignore if not created yet
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await apiPost('/tailors/profile', {
        ...form,
        experienceYears: Number(form.experienceYears || 0),
        basePrice: Number(form.basePrice || 0),
        specializations: form.specializations
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      })
      setMessage('Profile saved.')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Tailor profile & pricing
        </h1>
        <p className="text-sm text-slate-600">
          This is what customers will see when they search in your city.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Short bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
            placeholder="e.g. 8+ years experience in ladies suits, blouses and lehengas."
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-slate-700">
              Experience (years)
            </label>
            <input
              type="number"
              name="experienceYears"
              value={form.experienceYears}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-700">
              Starting price (₹)
            </label>
            <input
              type="number"
              name="basePrice"
              value={form.basePrice}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-700">
            Specializations (comma separated)
          </label>
          <input
            type="text"
            name="specializations"
            value={form.specializations}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
            placeholder="Ladies suits, blouses, lehengas, kids wear"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-slate-700">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-700">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {message && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}

