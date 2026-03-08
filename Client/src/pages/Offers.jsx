import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const OFFERS = [
  { code: 'STITCH20', title: '20% OFF ON STITCHING CHARGES', desc: 'Valid on all standard and premium stitching services. Minimum booking value ₹500.', expiry: '30 Nov 2024', color: 'from-blue-100 to-indigo-100' },
  { code: 'FREESHIP', title: 'FREE SHIP ON FABRIC SOURCING', desc: 'Get free pickup and delivery for fabric samples and finished garments. Valid for orders over ₹500.', expiry: '15 Dec 2024', color: 'from-emerald-100 to-teal-100' },
  { code: 'WELCOME50', title: 'NEW50 FIRST ORDER SPECIAL', desc: 'Welcome offer for new users. Flat ₹200 discount on your first custom tailoring experience.', expiry: 'No Expiry', color: 'from-amber-100 to-orange-100' },
]

export function Offers() {
  const [copied, setCopied] = useState(null)

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Offers</h1>
      <p className="mt-1 text-slate-600">Save on your next tailoring order.</p>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
        <span className="rounded bg-amber-500 px-2 py-0.5 text-xs font-medium text-white">SEASONAL SALE</span>
        <h2 className="mt-3 text-xl font-bold text-slate-900">Flat 30% Off on All Premium Stitching</h2>
        <p className="mt-2 text-slate-600">Experience master craftsmanship at home. Limited time offer for the festive season.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/search" className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">Book Now</Link>
          <button type="button" className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 hover:bg-slate-100">View Details</button>
        </div>
      </div>

      <div className="mt-8 flex gap-2">
        {['All Offers', 'Stitching', 'Fabric', 'First Order'].map((tab) => (
          <button key={tab} type="button" className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === 'All Offers' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OFFERS.map((o) => (
          <div key={o.code} className={`rounded-xl bg-gradient-to-br ${o.color} p-4`}>
            <h3 className="font-semibold text-slate-900">{o.title}</h3>
            <div className="mt-3 flex items-center gap-2">
              <code className="rounded bg-white/80 px-2 py-1 text-sm font-mono">{o.code}</code>
              <button type="button" onClick={() => copyCode(o.code)} className="rounded bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">
                {copied === o.code ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600">{o.desc}</p>
            <p className="mt-2 text-xs text-slate-500">Expires {o.expiry} • <a href="#tc" className="text-blue-600 hover:underline">T&C Apply</a></p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="font-semibold text-slate-900">Share the Love, Earn Rewards</h2>
        <p className="mt-2 text-slate-600">Invite your friends to TailorOnDemand and you both get ₹150 credit for your next custom fit.</p>
        <p className="mt-1 text-sm text-slate-500">Successfully referred over 500+ happy customers this month!</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2">
            <p className="text-xs font-medium text-slate-500">YOUR REFERRAL CODE</p>
            <p className="font-mono font-semibold text-slate-900">STYLE99</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => copyCode('STYLE99')} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Copy Link</button>
            <button type="button" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Refer Now</button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {[
          { step: 1, title: 'Copy Code', desc: 'Pick an offer and copy the code.' },
          { step: 2, title: 'Add Service', desc: 'Add stitching or fabric to your cart.' },
          { step: 3, title: 'Save Big', desc: 'Apply code at checkout for discount.' },
        ].map((s) => (
          <div key={s.step} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">{s.step}</span>
            <h3 className="mt-3 font-medium text-slate-900">{s.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
