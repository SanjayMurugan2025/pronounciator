import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, User } from 'lucide-react'
import { useTutor } from '../context/useTutor'

const Auth = () => {
  const { setProfile, profile } = useTutor()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setProfile({ ...profile, name: name || 'Guest' })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Securely save progress to MongoDB and sync across devices.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <label className="block text-sm text-slate-600">
              Full name
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <User className="h-4 w-4 text-slate-400" />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full text-sm outline-none"
                  placeholder="Jamie Doe"
                />
              </div>
            </label>
          )}
          <label className="block text-sm text-slate-600">
            Email
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full text-sm outline-none"
                placeholder="you@company.com"
                type="email"
                required
              />
            </div>
          </label>
          <label className="block text-sm text-slate-600">
            Password
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full text-sm outline-none"
                placeholder="••••••••"
                type="password"
                required
              />
            </div>
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500"
          >
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="mt-4 text-sm text-indigo-600"
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-slate-900">Security & Sync</h2>
        <div className="space-y-4 text-sm text-slate-600">
          <p>✔ MongoDB storage for pronunciation history and weak sound alerts.</p>
          <p>✔ JWT protected sessions powered by Express.js.</p>
          <p>✔ Secure password hashing with bcrypt.</p>
          <p>✔ Device sync and progress recovery.</p>
        </div>
        <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-xs text-indigo-600">
          API endpoints: /api/auth/register, /api/auth/login, /api/profile
        </div>
      </motion.div>
    </div>
  )
}

export default Auth
