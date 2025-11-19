import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { api, startOfWeek, endOfWeek, addWeeks, formatDate } from '../lib/api'
import WeekGrid from '../components/WeekGrid'

const messages = [
  'You are a lighthouse made of toast.',
  'The moon is just the sun in pajamas.',
  'Somewhere a fern applauds your discipline.',
  'Your future self sends a thumbs-up from Tuesday.',
  'Consistency is a polite drumbeat.'
]

export default function AppShell() {
  const [habits, setHabits] = useState([])
  const [completions, setCompletions] = useState(new Set())
  const [weekDate, setWeekDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [motivation, setMotivation] = useState('')

  const fetchAll = useCallback(async (anchorDate = new Date()) => {
    const s = formatDate(startOfWeek(anchorDate))
    const e = formatDate(endOfWeek(anchorDate))
    const [hs, cs] = await Promise.all([
      api.getHabits(),
      api.getCompletions(s, e),
    ])
    setHabits(hs || [])
    const set = new Set()
    ;(cs || []).forEach(c => set.add(`${c.habit_id}-${c.date}`))
    setCompletions(set)
  }, [])

  useEffect(() => {
    setMotivation(messages[Math.floor(Math.random()*messages.length)])
  }, [])

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try { await fetchAll(weekDate) } finally { if (active) setLoading(false) }
    }
    load()
  }, [weekDate, fetchAll])

  useEffect(() => {
    const interval = setInterval(() => fetchAll(weekDate), 15*60*1000)
    return () => clearInterval(interval)
  }, [weekDate, fetchAll])

  useEffect(() => {
    let lastDay = new Date().getDate()
    const onVis = () => fetchAll(weekDate)
    const onTick = setInterval(() => {
      const now = new Date()
      if (now.getDate() !== lastDay) {
        lastDay = now.getDate()
        setWeekDate(new Date())
        fetchAll(new Date())
        setMotivation(messages[Math.floor(Math.random()*messages.length)])
      }
    }, 60*1000)
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('online', onVis)
    return () => { document.removeEventListener('visibilitychange', onVis); window.removeEventListener('online', onVis); clearInterval(onTick) }
  }, [fetchAll, weekDate])

  useEffect(() => {
    const isWeb = typeof window !== 'undefined' && !window.Capacitor
    if (!isWeb) return
    let currentVersion = null
    const check = async () => {
      try { const v = await api.version(); if (currentVersion && v.version !== currentVersion) window.location.reload(); currentVersion = v.version } catch {}
    }
    const id = setInterval(check, 30*1000)
    check()
    return () => clearInterval(id)
  }, [])

  const onToggle = async (habit_id, date) => {
    const key = `${habit_id}-${date}`
    const optimistic = new Set(completions)
    if (optimistic.has(key)) optimistic.delete(key); else optimistic.add(key)
    setCompletions(optimistic)
    try { await api.toggleCompletion(habit_id, date) } catch { /* revert? */ }
  }
  
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Steadily</h1>
          <div className="text-white/60 text-sm">{motivation}</div>
        </div>
        <a className="px-3 py-1.5 rounded bg-white/10" href="/">Home</a>
      </header>
      <main className="space-y-4">
        <WeekGrid
          habits={habits}
          completionsSet={completions}
          weekDate={weekDate}
          onToggle={onToggle}
          onPrev={() => setWeekDate(d => addWeeks(d, -1))}
          onNext={() => setWeekDate(d => addWeeks(d, 1))}
          onToday={() => setWeekDate(new Date())}
        />
      </main>
    </div>
  )
}
