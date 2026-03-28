import { useContext } from 'react'
import { TutorContext } from './TutorContextDef'

export const useTutor = () => {
  const context = useContext(TutorContext)
  if (!context) {
    throw new Error('useTutor must be used within TutorProvider')
  }
  return context
}
