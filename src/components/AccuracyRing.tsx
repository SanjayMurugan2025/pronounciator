interface AccuracyRingProps {
  value: number
}

export const AccuracyRing = ({ value }: AccuracyRingProps) => {
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative h-24 w-24">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="10" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#4f46e5"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-slate-900">
        {value}%
      </div>
    </div>
  )
}
