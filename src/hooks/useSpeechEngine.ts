import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { similarityScore } from '../utils/levenshtein'
import { detectWeakSounds } from '../utils/weakSounds'
import { speechToText, speakText } from '../utils/speech'
import { normalizeNumbers, normalizeDigits } from '../utils/normalization'
import type { WordItem } from '../types'

interface SpeechState {
  transcript: string
  accuracy: number
  status: 'idle' | 'listening' | 'success' | 'retry' | 'teaching'
  weakSounds: Array<'th' | 'rl' | 'vw' | 'silent'>
}

const initialState: SpeechState = {
  transcript: '',
  accuracy: 0,
  status: 'idle',
  weakSounds: [],
}

export const useSpeechEngine = (word: WordItem, onSuccess: (accuracy: number) => void) => {
  const [state, setState] = useState<SpeechState>(initialState)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const beginListening = useCallback(() => {
    const recognition = speechToText(
      (text) => {
        const transcriptFull = normalizeNumbers(text)
        const transcriptDigits = normalizeDigits(text)
        const targetFull = normalizeNumbers(word.text)
        const targetDigits = normalizeDigits(word.text)
        
        const accuracyFull = similarityScore(transcriptFull, targetFull)
        const accuracyDigits = similarityScore(transcriptDigits, targetDigits)
        const accuracy = Math.max(accuracyFull, accuracyDigits)
        
        const normalizedTranscript = accuracyFull >= accuracyDigits ? transcriptFull : transcriptDigits
        const normalizedTarget = accuracyFull >= accuracyDigits ? targetFull : targetDigits
        const weak = detectWeakSounds(normalizedTranscript, normalizedTarget)
        
        let passThreshold = word.difficulty === 'Beginner' ? 75 : 90
        if (word.module === 'numbers') {
          passThreshold -= 35 // Make numbers 35% easier as requested
        }
        
        const isPass = accuracy >= passThreshold
        setState((prev) => ({
          ...prev,
          transcript: text,
          accuracy,
          status: isPass ? 'success' : accuracy < 50 ? 'teaching' : 'retry', // Adjusted retry threshold for numbers
          weakSounds: weak,
        }))
        if (isPass) {
          speakText(
            `Great job! You pronounced ${word.text} clearly with about ${Math.round(
              accuracy,
            )} percent accuracy. Let's move to the next one.`,
          )
          onSuccess(accuracy)
        } else {
          const coachingParts: string[] = []

          if (weak.includes('th')) {
            coachingParts.push(
              'Your TH sound is missing. Gently place your tongue between your teeth and push air out: th.',
            )
          }
          if (weak.includes('rl')) {
            coachingParts.push(
              'Your R or L is not clear. For R, round your lips. For L, touch the ridge just behind your top teeth.',
            )
          }
          if (weak.includes('vw')) {
            coachingParts.push(
              'Your V or W needs work. For V, bite your lower lip and add voice. For W, round your lips forward.',
            )
          }
          if (weak.includes('silent')) {
            coachingParts.push(
              'You are dropping the last consonant. Add a small clear sound at the end of the word.',
            )
          }

          const baseLine = `Let me help you say ${word.text}. Listen: ${word.syllables.join(
            ' - ',
          )}.`
          const detail = coachingParts.join(' ')

          speakText(`${baseLine} ${detail}`, 0.95)
        }
      },
      (error) => {
        setState((prev) => ({ ...prev, status: 'idle' }))
        console.error(error)
      },
    )

    if (recognition) {
      recognitionRef.current = recognition
      setState((prev) => ({ ...prev, status: 'listening' }))
      recognition.start()
    }
  }, [word, onSuccess])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setState((prev) => ({ ...prev, status: 'idle' }))
  }, [])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  const tutorMessage = useMemo(() => {
    if (state.status === 'success') return 'Excellent pronunciation!'

    if (state.status === 'teaching' || state.status === 'retry') {
      if (!state.weakSounds.length) {
        return 'Listen carefully and match the model pronunciation.'
      }

      const parts: string[] = []

      if (state.weakSounds.includes('th')) {
        parts.push('Your "th" sound is missing. Put your tongue gently between your teeth and push air.')
      }
      if (state.weakSounds.includes('rl')) {
        parts.push('Your R/L sound is unclear. Round for R, and touch the ridge behind your teeth for L.')
      }
      if (state.weakSounds.includes('vw')) {
        parts.push('Your V/W sound is weak. Bite your lower lip for V, and round your lips forward for W.')
      }
      if (state.weakSounds.includes('silent')) {
        parts.push('You are dropping the last consonant. Release a small sound at the end of the word.')
      }

      return parts.join(' ')
    }

    return 'Tap the mic to begin.'
  }, [state.status, state.weakSounds])

  useEffect(() => () => recognitionRef.current?.abort(), [])

  const [prevWordText, setPrevWordText] = useState(word.text)

  if (word.text !== prevWordText) {
    setPrevWordText(word.text)
    setState(initialState)
  }

  return { state, beginListening, stopListening, reset, tutorMessage }
}
