import { Routes, Route, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Mic, Sparkles, User } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Training from './pages/Training'
import Auth from './pages/Auth'
import { TutorProvider } from './context/TutorContext'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:bg-white/70'
  }`

function App() {
  return (
    <TutorProvider>
      <div className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/70 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">PronunciaPet</p>
                <p className="text-xs text-slate-500">Adaptive Pronunciation Studio</p>
              </div>
            </div>
            <nav className="hidden items-center gap-3 md:flex">
              <NavLink to="/" className={navLinkClass}>
                <Mic className="h-4 w-4" /> Training
              </NavLink>
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </NavLink>
              <NavLink to="/auth" className={navLinkClass}>
                <User className="h-4 w-4" /> Account
              </NavLink>
            </nav>
          </div>
        </header>

        <motion.main
          key="routes"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-6xl px-6 py-10"
        >
          <Routes>
            <Route path="/" element={<Training />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </motion.main>
      </div>
    </TutorProvider>
  )
}

export default App
