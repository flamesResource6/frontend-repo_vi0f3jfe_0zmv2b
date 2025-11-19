import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LayoutContext = createContext(null)

export function LayoutProvider({ children }) {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight >= window.innerWidth)
  const [compact, setCompact] = useState(() => localStorage.getItem('steadily_compact') === '1')

  useEffect(() => {
    let t
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        setIsPortrait(window.innerHeight >= window.innerWidth)
      }, 150)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    localStorage.setItem('steadily_compact', compact ? '1' : '0')
  }, [compact])

  const value = useMemo(() => ({ isPortrait, compact, setCompact }), [isPortrait, compact])

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export function useLayout() {
  return useContext(LayoutContext)
}
