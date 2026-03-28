import type { UserProfile, WeakSoundStats } from '../types'

export const createInitialProfile = (): UserProfile => ({
  name: 'Guest',
  level: 'Beginner',
  xp: 120,
  streak: 2,
  successes: 0,
  sessionSuccesses: 0,
  accuracyHistory: [],
  weakSounds: {
    th: 0,
    rl: 0,
    vw: 0,
    silent: 0,
  },
  completedWords: [],
  achievements: ['First Session'],
})

export const incrementWeakSound = (stats: WeakSoundStats, key: keyof WeakSoundStats) => ({
  ...stats,
  [key]: stats[key] + 1,
})
