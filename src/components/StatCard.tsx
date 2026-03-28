import type { ReactNode } from 'react'

export const StatCard = ({ label, value, icon }: { label: string; value: string; icon: ReactNode }) => (
  <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="text-slate-400">{icon}</div>
    </div>
    <p className="mt-4 text-2xl font-semibold text-slate-900">{value}</p>
  </div>
)
