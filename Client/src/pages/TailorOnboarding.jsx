import React, { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../services/api.js'

const STEPS = ['PERSONAL', 'SKILLS', 'PORTFOLIO', 'BANKING', 'VERIFICATION']

export function TailorOnboarding() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    experienceYears: '',
    specializations: [],
    bio: '',
    basePrice: '',
    city: '',
    pincode: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const skills = ['Bespoke Suits', 'Sherwanis', 'Tuxedos', 'Formal Shirts', 'Alterations', 'Traditional Wear', 'Blazers']

  useEffect(() => {
    apiGet('/tailors/profile/me')
      .then((p) => {
        if (p) {
          setForm({
            name: p.user?.name || '',
            phone: '',
            email: '',
            experienceYears: p.experienceYears || '',
            specializations: p.specializations || [],
            bio: p.bio || '',
            basePrice: p.basePrice || '',
            city: p.city || '',
            pincode: p.pincode || '',
          })
        }
      })
      .catch(() => {})
  }, [])

  const toggleSkill = (s) => {
    setForm((f) => ({
      ...f,
      specializations: f.specializations.includes(s) ? f.specializations.filter((x) => x !== s) : [...f.specializations, s],
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage('')
    try {
      await apiPost('/tailors/profile', {
        bio: form.bio,
        experienceYears: Number(form.experienceYears || 0),
        specializations: form.specializations,
        basePrice: Number(form.basePrice || 0),
        city: form.city,
        pincode: form.pincode,
      })
      setMessage('Profile saved.')
      if (step < 5) setStep((s) => s + 1)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Partner Onboarding</h1>
      <p className="mt-1 text-slate-600">Set up your professional profile to start receiving orders.</p>
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600">STEP {step} OF 5</span>
        <div className="flex-1 h-2 rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${step * 20}%` }} />
        </div>
        <span className="text-sm text-slate-500">{step * 20}% Complete</span>
      </div>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <button key={s} type="button" onClick={() => setStep(i + 1)} className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium ${step === i + 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900">Personal Information</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Legal Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="John Doe" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="john@tailorondemand.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Years of Experience</label>
              <select value={form.experienceYears} onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="">Select experience</option>
                {[1, 2, 3, 5, 8, 10, 15].map((n) => (
                  <option key={n} value={n}>{n}+ years</option>
                ))}
              </select>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900">Core Skills & Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <button key={s} type="button" onClick={() => toggleSkill(s)} className={`rounded-lg border px-4 py-2 text-sm font-medium ${form.specializations.includes(s) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                  {s}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Short bio</label>
              <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="8+ years experience in ladies suits, blouses..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Starting price (₹)</label>
              <input type="number" value={form.basePrice} onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
          </div>
        )}
        {(step === 3 || step === 4 || step === 5) && (
          <div className="space-y-4">
            {step === 3 && (
              <>
                <h2 className="font-semibold text-slate-900">Portfolio Showcase</h2>
                <p className="text-sm text-slate-500">Min: 3 high-quality photos</p>
                <div className="mt-4 flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 w-24 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">Upload</div>
                  ))}
                </div>
              </>
            )}
            {step === 4 && (
              <>
                <h2 className="font-semibold text-slate-900">Banking Details</h2>
                <p className="text-sm text-slate-500">Add your bank account for payouts. (Coming soon)</p>
              </>
            )}
            {step === 5 && (
              <>
                <h2 className="font-semibold text-slate-900">Verification</h2>
                <p className="text-sm text-slate-500">ID proof and skill assessment. (Coming soon)</p>
              </>
            )}
          </div>
        )}

        {message && <p className="mt-4 text-sm text-emerald-600">{message}</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={handleSave} className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 hover:bg-slate-50">Save Draft</button>
          <button type="button" onClick={handleSave} disabled={loading} className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {step < 5 ? 'Continue to ' + STEPS[step] : 'Complete'}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: '🛡', title: 'Secure Platform', desc: 'Your personal data is encrypted and used only for verification.' },
          { icon: '💰', title: 'Fast Payouts', desc: 'We settle payments within 48 hours of order delivery.' },
          { icon: '🎧', title: 'Dedicated Support', desc: 'Get 24/7 assistance from our tailor success team.' },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="text-2xl">{f.icon}</span>
            <h3 className="mt-2 font-medium text-slate-900">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
