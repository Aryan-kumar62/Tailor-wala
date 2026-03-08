import React, { useEffect, useState } from 'react'
import { apiGet } from '../services/api.js'

export function TailorEarnings() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet('/tailors/earnings')
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-12 text-center text-slate-500">Loading...</div>
  if (!data) return <div className="py-12 text-center text-slate-600">Unable to load earnings.</div>

  const { totalEarnings, monthlyEarnings, pendingPayout, transactions } = data

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const weeklyData = weekDays.map((d, i) => {
    const dayTransactions = transactions.filter((t) => new Date(t.date).getDay() === i)
    return { day: d, amount: dayTransactions.reduce((s, t) => s + t.netEarned, 0) }
  })
  const maxAmount = Math.max(...weeklyData.map((w) => w.amount), 1)

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Earnings Dashboard</h1>
      <p className="mt-1 text-slate-600">Overview of your professional tailoring income and payouts.</p>

      <div className="mt-8 flex flex-wrap items-start gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-w-[200px]">
          <p className="text-xs font-medium uppercase text-slate-500">Total Earnings</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">₹{totalEarnings?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-w-[200px]">
          <p className="text-xs font-medium uppercase text-slate-500">Monthly Earnings</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">₹{monthlyEarnings?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-w-[200px]">
          <p className="text-xs font-medium uppercase text-slate-500">Pending Payout</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">₹{pendingPayout?.toFixed(2) || '0.00'}</p>
          <p className="mt-1 text-xs text-slate-500">Est. 2 days</p>
        </div>
        <button type="button" className="ml-auto rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">Withdraw Funds</button>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">Weekly Performance</h2>
        <p className="mt-1 text-sm text-slate-500">Daily earnings breakdown for the current week</p>
        <div className="mt-6 flex items-end gap-2 h-40">
          {weeklyData.map((w) => (
            <div key={w.day} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-slate-200 rounded-t flex-1 flex flex-col justify-end" style={{ minHeight: 20 }}>
                <div className="bg-blue-500 rounded-t w-full" style={{ height: `${(w.amount / maxAmount) * 100}%`, minHeight: w.amount ? 4 : 0 }} />
              </div>
              <span className="mt-2 text-xs font-medium text-slate-600">{w.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="font-semibold text-slate-900">Transaction History</h2>
          <a href="#" className="text-sm text-blue-600 hover:underline">Download CSV</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-700">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Order ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Service</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">Amount</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">Fee (15%)</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">Net Earned</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No transactions yet</td></tr>
              ) : (
                transactions.slice(0, 10).map((t) => (
                  <tr key={t._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-blue-600 font-mono">{t.orderId}</td>
                    <td className="px-4 py-3 text-slate-700">{t.customer}</td>
                    <td className="px-4 py-3 text-slate-700">{t.service}</td>
                    <td className="px-4 py-3 text-right text-slate-600">₹{t.amount}</td>
                    <td className="px-4 py-3 text-right text-red-600">-₹{t.fee}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">₹{t.netEarned}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-center gap-3">
        <span className="text-blue-600">ℹ</span>
        <p className="text-sm text-slate-700">Your funds are automatically transferred to your linked bank account every Friday. Manual withdrawals take 1-3 business days.</p>
        <p className="ml-auto text-sm font-medium text-slate-700">Next payout: Friday</p>
      </div>
    </div>
  )
}
