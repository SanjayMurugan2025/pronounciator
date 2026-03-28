import { createContext } from 'react'
import type { TutorProfile, UserProfile } from '../types'

export interface TutorContextValue {
  profile: UserProfile
  setProfile: (profile: UserProfile) => void
  tutor: TutorProfile
  setTutor: (tutor: TutorProfile) => void
}

export const TutorContext = createContext<TutorContextValue | undefined>(undefined)
