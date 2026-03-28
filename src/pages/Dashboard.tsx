import { BarChart, ShieldCheck, TrendingUp } from 'lucide-react'
import { useTutor } from '../context/useTutor'
import { StatCard } from '../components/StatCard'
import { ProgressBar } from '../components/ProgressBar'

const Dashboard = () => {
  const { profile } = useTutor()

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Performance Dashboard</p>
          <h1 className="text-3xl font-semibold text-slate-900">Welcome back, {profile.name}</h1>
          <p className="mt-2 text-sm text-slate-500">Track your accuracy and pronunciation trends.</p>
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-xs text-slate-500 shadow">Level: {profile.level}</div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard label="XP Total" value={`${profile.xp} XP`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Accuracy Avg" value={`${Math.round(profile.accuracyHistory.reduce((acc, item) => acc + item.score, 0) / Math.max(1, profile.accuracyHistory.length))}%`} icon={<BarChart className="h-5 w-5" />} />
        <StatCard label="Achievement Badges" value={`${profile.achievements.length}`} icon={<ShieldCheck className="h-5 w-5" />} />
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Accuracy history</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-6">
          {profile.accuracyHistory.length === 0 && (
            <div className="col-span-6 rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Start a training session to see analytics here.
            </div>
          )}
          {profile.accuracyHistory.map((entry) => (
            <div key={entry.timestamp} className="flex flex-col items-center gap-2">
              <div className="h-24 w-6 rounded-full bg-slate-200">
                <div className="w-6 rounded-full bg-indigo-500" style={{ height: `${entry.score}%` }} />
              </div>
              <span className="text-xs text-slate-500">{entry.score}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Weak sound statistics</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {Object.entries(profile.weakSounds).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span>{key.toUpperCase()}</span>
                <span className="font-semibold text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Level progress</h3>
          <div className="mt-4 space-y-4">
            <ProgressBar value={profile.level === 'Beginner' ? 45 : profile.level === 'Intermediate' ? 72 : 90} label="Pronunciation mastery" />
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
              Keep your accuracy above 90% to unlock the next level.
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
