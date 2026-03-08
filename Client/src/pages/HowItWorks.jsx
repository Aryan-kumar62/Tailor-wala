import React from 'react'
import { Link } from 'react-router-dom'

export function HowItWorks() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">How It Works</h1>
      <p className="mt-2 text-slate-600">Get custom-fit clothes in four simple steps.</p>
      <div className="mt-10 space-y-8">
        {[
          { step: 1, title: 'Search & choose a tailor', desc: 'Enter your city and what you want stitched. Browse profiles, ratings and prices of tailors near you.' },
          { step: 2, title: 'Book a home visit', desc: 'Pick a date and time that suits you. The tailor will come to your home for measurements and design discussion.' },
          { step: 3, title: 'Stitching & updates', desc: 'Track your order status in the app—from measurement done to stitching in progress to out for delivery.' },
          { step: 4, title: 'Delivery & review', desc: 'Receive your finished garment at your doorstep. Rate your tailor to help others choose.' },
        ].map((item) => (
          <div key={item.step} className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">{item.step}</div>
            <div>
              <h2 className="font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-1 text-slate-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link to="/search" className="inline-flex rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">Find Tailors</Link>
      </div>
    </div>
  )
}
