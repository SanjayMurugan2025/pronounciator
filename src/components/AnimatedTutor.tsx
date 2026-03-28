import { motion } from 'framer-motion'
import type { TutorProfile } from '../types'

interface AnimatedTutorProps {
  tutor: TutorProfile
  mood: 'happy' | 'encouraging' | 'teaching'
  message: string
}

const moodGradient: Record<AnimatedTutorProps['mood'], string> = {
  happy: 'from-emerald-200 via-emerald-100 to-white',
  encouraging: 'from-amber-200 via-amber-100 to-white',
  teaching: 'from-rose-200 via-rose-100 to-white',
}

export const AnimatedTutor = ({ tutor, mood, message }: AnimatedTutorProps) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br ${moodGradient[mood]} p-6 shadow-xl`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tutor</p>
          <h3 className="text-2xl font-semibold text-slate-900">{tutor.name}</h3>
          <p className="text-sm text-slate-600">{tutor.tone} guidance</p>
        </div>
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl"
          animate={{ rotate: mood === 'happy' ? [0, 10, -10, 0] : 0 }}
          transition={{ duration: 1.6, repeat: mood === 'happy' ? Infinity : 0 }}
        >
          {tutor.id === 'panda' && '🐼'}
          {tutor.id === 'owl' && '🦉'}
          {tutor.id === 'fox' && '🦊'}
        </motion.div>
      </div>
      <motion.p
        className="mt-4 text-base text-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
      <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-600">
        Facial expression: <span className="font-semibold text-slate-800">{mood}</span>
      </div>
    </motion.div>
  )
}
