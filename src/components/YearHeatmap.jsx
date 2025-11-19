import React, { useMemo } from 'react'

function weekIndexOfYear(date){
  const d = new Date(date)
  d.setHours(0,0,0,0)
  const start = new Date(d.getFullYear(),0,1)
  const diff = Math.floor((d - start) / (1000*60*60*24))
  return Math.floor(diff / 7)
}

export default function YearHeatmap({ weeks, onSelectWeek }) {
  const weeksArr = useMemo(() => {
    const maxWeeks = 53
    const arr = new Array(maxWeeks).fill(0)
    weeks.forEach(w => {
      const i = weekIndexOfYear(new Date(w.start))
      arr[i] = w.pct
    })
    return arr
  }, [weeks])

  return (
    <div className="grid grid-cols-53 gap-1">
      {weeksArr.map((pct, i) => (
        <button key={i} className="w-3 h-3 rounded" style={{ backgroundColor: `rgba(16,185,129,${pct/100 || 0.1})` }} onClick={() => onSelectWeek(i)} />
      ))}
    </div>
  )
}
