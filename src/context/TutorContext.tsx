import { useMemo, useState } from 'react'
import type { TutorProfile, UserProfile } from '../types'
import { createInitialProfile } from '../utils/profile'
import { TutorContext } from './TutorContextDef'

export const TutorProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(createInitialProfile())
  const [tutor, setTutor] = useState<TutorProfile>({
    id: 'panda',
    name: 'Panda',
    tone: 'Friendly',
    accentColor: '#f97316',
  })

  const value = useMemo(() => ({ profile, setProfile, tutor, setTutor }), [profile, tutor])

  return <TutorContext.Provider value={value}>{children}</TutorContext.Provider>
}
