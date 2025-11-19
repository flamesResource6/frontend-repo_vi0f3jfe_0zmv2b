import React, { useMemo } from 'react'
import { formatDate, startOfWeek, endOfWeek } from '../lib/api'

export default function WeekGrid({ habits, completionsSet, weekDate, onToggle, onPrev, onNext, onToday }) {
  const days = useMemo(() => {
    const s = startOfWeek(weekDate)
    const arr = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(s)
      d.setDate(s.getDate() + i)
      arr.push(d)
    }
    return arr
  }, [weekDate])

  const todayStr = formatDate(new Date())

  const canNext = new Date(endOfWeek(weekDate)) < new Date(endOfWeek(new Date()))

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900/40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="text-white/80 text-sm">
          {formatDate(startOfWeek(weekDate))} - {formatDate(endOfWeek(weekDate))}
        </div>
        <div className="flex gap-2">
          <button onClick={onPrev} className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm">Prev</button>
          <button onClick={onToday} className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-sm">Today</button>
          <button onClick={onNext} disabled={!canNext} className={`px-3 py-1.5 rounded text-white text-sm ${canNext ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-50 cursor-not-allowed'}`}>Next</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: `240px repeat(7, minmax(0, 1fr))` }}>
        <div className="px-3 py-2 text-xs uppercase tracking-wide text-white/50 border-b border-white/10">Habit</div>
        {days.map((d, i) => (
          <div key={i} className="px-3 py-2 text-center text-xs uppercase tracking-wide text-white/50 border-b border-white/10">
            {d.toLocaleDateString(undefined, { weekday: 'short' })}<br />
            <span className="text-white/30">{d.getDate()}</span>
          </div>
        ))}
        {habits.map(h => {
          const count = days.reduce((acc, d) => acc + (completionsSet.has(`${h.id}-${formatDate(d)}`) ? 1 : 0), 0)
          const pct = Math.min(100, Math.round((count / h.weekly_goal) * 100))
          return (
            <React.Fragment key={h.id}>
              <div className="px-3 py-2 border-b border-white/5 flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0`} style={{ background: 'white' }} />
                <div className="">
                  <div className="text-white font-medium">{h.name}</div>
                  <div className="text-white/50 text-xs">{count}/{h.weekly_goal} this week</div>
                </div>
                <div className="ml-auto text-xs text-white/60">{pct}%</div>
              </div>
              {days.map((d, i) => {
                const key = `${h.id}-${formatDate(d)}`
                const isFuture = formatDate(d) > todayStr
                const done = completionsSet.has(key)
                return (
                  <button
                    key={i}
                    onClick={() => !isFuture && onToggle(h.id, formatDate(d))}
                    disabled={isFuture}
                    className={`h-14 border-b border-white/5 flex items-center justify-center ${done ? 'bg-emerald-500/40 hover:bg-emerald-500/60' : 'hover:bg-white/10'} ${isFuture ? 'opacity-40 cursor-not-allowed' : ''}`}
                    title={formatDate(d)}
                  >
                    {done ? '✓' : ''}
                  </button>
                )
              })}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
