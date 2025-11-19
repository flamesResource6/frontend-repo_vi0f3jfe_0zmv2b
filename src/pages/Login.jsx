import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login, register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password)
    } catch (err) {
      setError(err.message || 'Error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-4">{mode === 'login' ? 'Login' : 'Create account'}</h1>
        <div className="space-y-3">
          <input className="w-full px-3 py-2 rounded bg-white/10" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full px-3 py-2 rounded bg-white/10" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <div className="text-red-400 text-sm mt-3">{error}</div>}
        <button type="submit" className="mt-4 w-full py-2 rounded bg-emerald-500 hover:bg-emerald-600">{mode === 'login' ? 'Login' : 'Register'}</button>
        <button type="button" onClick={()=>setMode(mode==='login'?'register':'login')} className="mt-2 w-full py-2 rounded bg-white/10">Switch to {mode==='login'?'Register':'Login'}</button>
      </form>
    </div>
  )
}
