import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load token and fetch current user
  useEffect(() => {
    const token = localStorage.getItem('steadily_token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('steadily_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password)
    if (data?.token) localStorage.setItem('steadily_token', data.token)
    const me = await api.me()
    setUser(me)
    return me
  }, [])

  const register = useCallback(async (email, password) => {
    const data = await api.register(email, password)
    if (data?.token) localStorage.setItem('steadily_token', data.token)
    const me = await api.me()
    setUser(me)
    return me
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('steadily_token')
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, setUser, login, register, logout, loading }), [user, login, register, logout, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
