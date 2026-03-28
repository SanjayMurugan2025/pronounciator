export type TutorId = 'panda' | 'owl' | 'fox'

export interface TutorProfile {
  id: TutorId
  name: string
  tone: string
  accentColor: string
}

export interface WeakSoundStats {
  th: number
  rl: number
  vw: number
  silent: number
}

export interface AccuracyEntry {
  timestamp: string
  score: number
}

export interface UserProfile {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  xp: number
  streak: number
  successes: number
  sessionSuccesses: number
  accuracyHistory: AccuracyEntry[]
  weakSounds: WeakSoundStats
  completedWords: string[]
  achievements: string[]
}

export type WordModule = 'words' | 'numbers' | 'mix'

export type NumeralCategory = 'cardinal' | 'ordinal' | 'nominal' | 'multiplicative'

export interface WordItem {
  text: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  module: WordModule
  numeralCategory?: NumeralCategory
  syllables: string[]
  tips: string[]
  meaning?: string // Adding meaning property
}
