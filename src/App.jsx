import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Home from './pages/Home'
import AppShell from './pages/AppShell'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LayoutProvider } from './components/LayoutProvider'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <div className="min-h-screen bg-slate-950">
          <nav className="flex items-center justify-between px-4 py-3 border-b border-white/10 text-white">
            <Link to="/" className="font-semibold">Steadily.me</Link>
            <div className="flex items-center gap-3 text-sm">
              <Link to="/login" className="px-3 py-1.5 rounded bg-white/10">Login</Link>
              <a href="https://steadily.me" className="px-3 py-1.5 rounded bg-emerald-600">Website</a>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/app" element={<PrivateRoute><AppShell /></PrivateRoute>} />
          </Routes>
        </div>
      </LayoutProvider>
    </AuthProvider>
  )
}
