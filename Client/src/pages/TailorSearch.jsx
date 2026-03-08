import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiGet } from '../services/api.js'

const SORT_OPTIONS = [
  { id: 'near', label: 'Near Me' },
  { id: 'rated', label: 'Top Rated' },
  { id: 'delivery', label: 'Fast Delivery' },
  { id: 'budget', label: 'Budget Friendly' },
]

export function TailorSearch() {
  const [searchParams] = useSearchParams()
  const city = searchParams.get('city') || ''
  const specialization = searchParams.get('specialization') || searchParams.get('q') || ''
  const [filters, setFilters] = useState({
    categoryMen: true,
    categoryWomen: true,
    categoryKids: false,
    serviceStitching: true,
    serviceAlteration: false,
    minPrice: 0,
    maxPrice: 500,
    rating: '',
  })
  const [sort, setSort] = useState('rated')
  const [showFilters, setShowFilters] = useState(false)
  const [tailors, setTailors] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const perPage = 9

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (city) params.set('city', city)
    if (specialization) params.set('specialization', specialization)
    apiGet(`/tailors?${params.toString()}`)
      .then((data) => {
        let list = data
        if (filters.rating === '4.5') list = list.filter((t) => (t.ratingAverage || 0) >= 4.5)
        else if (filters.rating === '4') list = list.filter((t) => (t.ratingAverage || 0) >= 4)
        if (filters.minPrice > 0 || filters.maxPrice < 500) list = list.filter((t) => (t.basePrice || 0) >= filters.minPrice && (t.basePrice || 0) <= filters.maxPrice)
        if (sort === 'budget') list = [...list].sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0))
        else if (sort === 'rated') list = [...list].sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0))
        setTailors(list)
      })
      .catch(() => setTailors([]))
      .finally(() => setLoading(false))
  }, [city, specialization, filters.rating, filters.minPrice, filters.maxPrice, sort])

  const resetFilters = () => setFilters({
    categoryMen: true,
    categoryWomen: true,
    categoryKids: false,
    serviceStitching: true,
    serviceAlteration: false,
    minPrice: 0,
    maxPrice: 500,
    rating: '',
  })

  const paginated = tailors.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(tailors.length / perPage)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Tailor Search</span>
      </nav>
      <p className="mt-1 text-slate-600">Skilled tailors for home-measured custom clothing at your doorstep.</p>

      <div className="mt-6 flex lg:hidden">
        <button 
          onClick={() => setShowFilters(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-bold text-slate-700 shadow-sm"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          Filters & Sorting
        </button>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Drawer Overlay */}
        {showFilters && (
          <div 
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}

        <aside className={`fixed inset-y-0 left-0 z-[70] w-80 bg-white p-6 shadow-2xl transition-transform lg:relative lg:inset-auto lg:z-0 lg:w-64 lg:p-0 lg:shadow-none lg:translate-x-0 ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between mb-6 lg:mb-4">
            <span className="text-xl font-bold text-slate-900 lg:text-base lg:font-medium">Filters</span>
            <div className="flex items-center gap-4">
              <button type="button" onClick={resetFilters} className="text-sm font-bold text-blue-600 hover:underline">RESET</button>
              <button onClick={() => setShowFilters(false)} className="lg:hidden text-slate-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] lg:max-h-none">
            <div className="lg:hidden">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Sort By</p>
              <div className="grid grid-cols-2 gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSort(opt.id)}
                    className={`rounded-lg px-3 py-2 text-xs font-bold ${sort === opt.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Category</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer"><input type="checkbox" checked={filters.categoryMen} onChange={(e) => setFilters((f) => ({ ...f, categoryMen: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Men&apos;s Wear</label>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer"><input type="checkbox" checked={filters.categoryWomen} onChange={(e) => setFilters((f) => ({ ...f, categoryWomen: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Women&apos;s Wear</label>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer"><input type="checkbox" checked={filters.categoryKids} onChange={(e) => setFilters((f) => ({ ...f, categoryKids: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Kids</label>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Service Type</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer"><input type="checkbox" checked={filters.serviceStitching} onChange={(e) => setFilters((f) => ({ ...f, serviceStitching: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Stitching</label>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer"><input type="checkbox" checked={filters.serviceAlteration} onChange={(e) => setFilters((f) => ({ ...f, serviceAlteration: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Alteration</label>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Price Range</p>
              <div className="px-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>₹{filters.minPrice}</span>
                  <span>₹{filters.maxPrice}+</span>
                </div>
                <input type="range" min="0" max="500" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Ratings</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer"><input type="radio" name="rating" checked={filters.rating === '4.5'} onChange={() => setFilters((f) => ({ ...f, rating: '4.5' }))} className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500" /> 4.5 & above ★</label>
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 cursor-pointer"><input type="radio" name="rating" checked={filters.rating === '4'} onChange={() => setFilters((f) => ({ ...f, rating: '4' }))} className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500" /> 4.0 & above ★</label>
              </div>
            </div>

            <button 
              onClick={() => setShowFilters(false)}
              className="w-full lg:hidden rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 hidden lg:flex flex-wrap items-center gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSort(opt.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${sort === opt.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading tailors...</div>
          ) : paginated.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center text-slate-500">No tailors found. Try changing filters or city.</div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((t) => (
                  <Link key={t._id} to={`/tailor/${t._id}`} className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-blue-200 hover:shadow-md">
                    <div className="aspect-[4/3] bg-slate-200 flex items-center justify-center text-slate-400">
                      <span className="text-5xl font-semibold text-slate-300">{t.user?.name?.charAt(0) || 'T'}</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-amber-600 font-medium">★ {t.ratingAverage?.toFixed(1) || 'New'}</span>
                        <span className="text-xs text-slate-500">{(t.ratingCount || 0)} reviews</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">{t.user?.name?.charAt(0)}</span>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600">{t.user?.name}</p>
                          <p className="text-xs text-slate-500">{t.city || '—'} • from ₹{t.basePrice || 0}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-slate-600">{t.specializations?.slice(0, 3).join(' • ') || 'Tailoring'}</p>
                      <span className="mt-3 inline-block w-full rounded-lg bg-blue-600 py-2 text-center text-sm font-medium text-white group-hover:bg-blue-700">View Profile</span>
                    </div>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50">←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} type="button" onClick={() => setPage(p)} className={`rounded px-3 py-1 text-sm ${page === p ? 'bg-blue-600 text-white' : 'border border-slate-300'}`}>{p}</button>
                  ))}
                  <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded border border-slate-300 px-3 py-1 text-sm disabled:opacity-50">→</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
