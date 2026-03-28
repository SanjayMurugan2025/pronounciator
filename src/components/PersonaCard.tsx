import { motion } from 'framer-motion'
import type { TutorProfile } from '../types'

interface PersonaCardProps {
  tutor: TutorProfile
  selected: boolean
  onSelect: (tutor: TutorProfile) => void
}

export const PersonaCard = ({ tutor, selected, onSelect }: PersonaCardProps) => {
  return (
    <motion.button
      onClick={() => onSelect(tutor)}
      whileHover={{ y: -6 }}
      className={`w-full rounded-3xl border px-6 py-6 text-left shadow-sm transition ${
        selected ? 'border-indigo-500 bg-indigo-50' : 'border-white bg-white/80'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">{tutor.name}</p>
          <p className="text-sm text-slate-500">{tutor.tone} tutor</p>
        </div>
        <div className="text-4xl">
          {tutor.id === 'panda' && '🐼'}
          {tutor.id === 'owl' && '🦉'}
          {tutor.id === 'fox' && '🦊'}
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-white/60 p-3 text-xs text-slate-600">
        Voice style: {tutor.tone}. Adaptively reacts to your accuracy.
      </div>
    </motion.button>
  )
}
