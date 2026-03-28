interface ProgressBarProps {
  value: number
  label: string
}

export const ProgressBar = ({ value, label }: ProgressBarProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs text-slate-500">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${value}%` }} />
    </div>
  </div>
)
