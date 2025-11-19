import React from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex items-center justify-between py-6">
          <h1 className="text-3xl font-bold">Steadily.me</h1>
          <a href="/app" className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600">Open App</a>
        </header>
        <section className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Why weekly habits?</h2>
            <p className="text-white/70">Focus on showing up several times a week. Tap to mark a day done. Celebrate weekly goals instead of daily streak anxiety.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Live preview</h2>
            <p className="text-white/70">The main grid and year dots are optimized for wall-mounted displays on any device.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
