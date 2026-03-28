import { useMemo, useState } from 'react'
import { Award, Mic, Play, Star } from 'lucide-react'
import { AnimatedTutor } from '../components/AnimatedTutor'
import { AccuracyRing } from '../components/AccuracyRing'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { PersonaCard } from '../components/PersonaCard'
import { ProgressBar } from '../components/ProgressBar'
import { useSpeechEngine } from '../hooks/useSpeechEngine'
import { useTutor } from '../context/useTutor'
import { getWordsByLevel } from '../utils/words'
import { speakText } from '../utils/speech'
import { formatForSpeech } from '../utils/formatters'
import { incrementWeakSound } from '../utils/profile'
import type { NumeralCategory, TutorProfile, WordItem, WordModule } from '../types'

const tutors: TutorProfile[] = [
  { id: 'panda', name: 'Panda', tone: 'Friendly', accentColor: '#f97316' },
  { id: 'owl', name: 'Owl', tone: 'Serious', accentColor: '#0f172a' },
  { id: 'fox', name: 'Fox', tone: 'Motivator', accentColor: '#f43f5e' },
]

const modes = [
  { label: 'Phone', value: 'phone' },
  { label: 'Social', value: 'social' },
  { label: 'Address', value: 'address' },
] as const

const levelTargets = {
  Beginner: 3,
  Intermediate: 3,
  Advanced: 3,
}

const numeralCategoryMeta: Record<
  NumeralCategory,
  { label: string; purpose: string }
> = {
  cardinal: { label: 'Cardinal number', purpose: 'Counts or shows quantity.' },
  ordinal: { label: 'Ordinal number', purpose: 'Shows order or rank.' },
  nominal: { label: 'Nominal number', purpose: 'Identifies or names (no math value).' },
  multiplicative: { label: 'Multiplicative number', purpose: 'Shows repetition.' },
}

const weakSoundLabels: Record<string, string> = {
  th: 'TH sound is missing or weak.',
  rl: 'R / L sound is unclear.',
  vw: 'V / W sound is unclear.',
  silent: 'Last consonant is dropped.',
}

const Training = () => {
  const { tutor, setTutor, profile, setProfile } = useTutor()
  const [selectedMode, setSelectedMode] = useState<(typeof modes)[number]['value']>('phone')
  const [selectedModule, setSelectedModule] = useState<WordModule>('words')
  const [currentWord, setCurrentWord] = useState<WordItem>(
    getWordsByLevel(profile.level, 'words')[0],
  )
  const [wordIndex, setWordIndex] = useState(0)
/* [successCount removed] */
  const [showConfetti, setShowConfetti] = useState(false)
  const [inputText, setInputText] = useState('batman_hero@gmail.com')

  const wordsForLevel = useMemo(() => {
    const levelWords = getWordsByLevel(profile.level, selectedModule)
    if (levelWords.length > 0) return levelWords
    // Fallback: if no words exist for this level + module,
    // show Beginner examples so the Pronunciation Drill still updates.
    return getWordsByLevel('Beginner', selectedModule)
  }, [profile.level, selectedModule])

  const [activeWordsKey, setActiveWordsKey] = useState(() => `${profile.level}:${selectedModule}`)
  const currentWordsKey = `${profile.level}:${selectedModule}`

  if (currentWordsKey !== activeWordsKey) {
    setActiveWordsKey(currentWordsKey)
    setWordIndex(0)
    setCurrentWord(wordsForLevel[0] ?? getWordsByLevel('Beginner', selectedModule)[0])
  }

  const { state, beginListening, tutorMessage } = useSpeechEngine(currentWord, (accuracy) => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 1200)

    const nextSuccess = profile.sessionSuccesses + 1
    const leveledUp = nextSuccess >= levelTargets[profile.level]

    const updatedLevel =
      profile.level === 'Beginner' && leveledUp
        ? 'Intermediate'
        : profile.level === 'Intermediate' && leveledUp
        ? 'Advanced'
        : profile.level

    if (wordsForLevel.length > 0) {
      const nextIndex =
        wordIndex < wordsForLevel.length - 1 ? wordIndex + 1 : wordIndex
      const nextWord = wordsForLevel[nextIndex] ?? currentWord
      setWordIndex(nextIndex)
      setCurrentWord(nextWord)
    }

    setProfile({
      ...profile,
      level: updatedLevel,
      xp: profile.xp + Math.round(accuracy),
      streak: profile.streak + 1,
      successes: profile.successes + 1,
      sessionSuccesses: leveledUp ? 0 : nextSuccess,
      accuracyHistory: [
        ...profile.accuracyHistory,
        { timestamp: new Date().toISOString(), score: accuracy },
      ].slice(-12),
      achievements: leveledUp ? [...profile.achievements, `${updatedLevel} unlocked`] : profile.achievements,
    })
  })

  const handleListen = () => {
    beginListening()
    if (state.status !== 'success') {
      if (state.weakSounds.length) {
        let updatedWeak = { ...profile.weakSounds }
        state.weakSounds.forEach((issue) => {
          updatedWeak = incrementWeakSound(updatedWeak, issue)
        })
        setProfile({ ...profile, weakSounds: updatedWeak })
      }
    }
  }

  const mood = state.accuracy >= 90 ? 'happy' : state.accuracy >= 75 ? 'encouraging' : 'teaching'

  const modeText = formatForSpeech(inputText, selectedMode)

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pronunciation Drill</p>
              <h1 className="text-3xl font-semibold text-slate-900">"{currentWord.text}"</h1>
              <p className="mt-2 text-sm text-slate-500">Level: {profile.level}</p>
              {currentWord.meaning && (
                <p className="mt-2 text-sm text-slate-700 max-w-lg">
                  <span className="font-semibold text-slate-900">Meaning:</span> {currentWord.meaning}
                </p>
              )}
              {currentWord.numeralCategory && (
                <p className="mt-1 text-xs text-emerald-700">
                  {numeralCategoryMeta[currentWord.numeralCategory].label} —{' '}
                  {numeralCategoryMeta[currentWord.numeralCategory].purpose}
                </p>
              )}
            </div>
            <AccuracyRing value={state.accuracy} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {currentWord.syllables.map((syllable) => (
              <div key={syllable} className="rounded-2xl bg-indigo-50 px-4 py-3 text-center text-sm font-semibold text-indigo-700">
                {syllable}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {(['words', 'numbers', 'mix'] as WordModule[]).map((moduleKey) => (
                <button
                  key={moduleKey}
                  onClick={() => setSelectedModule(moduleKey)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedModule === moduleKey
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {moduleKey === 'words' && 'Words'}
                  {moduleKey === 'numbers' && 'Numbers'}
                  {moduleKey === 'mix' && 'Mix'}
                </button>
              ))}
            </div>
            <button
              onClick={handleListen}
              className={`flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 ${
                state.status === 'listening' ? 'animate-pulse ring-2 ring-indigo-300 ring-offset-2 ring-offset-white' : ''
              }`}
            >
              <Mic className="h-4 w-4" /> Speak now
            </button>
            <button
              onClick={() => speakText(currentWord.text)}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Play className="h-4 w-4" /> Listen
            </button>
            <span className="text-xs text-slate-500">Practice as many times as you like.</span>
          </div>
          <div className="space-y-2">
            <ProgressBar value={Math.min(100, Math.round((profile.sessionSuccesses / levelTargets[profile.level]) * 100))} label="Level progress" />
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              {currentWord.tips.map((tip) => (
                <span key={tip} className="rounded-full bg-slate-100 px-3 py-1">
                  {tip}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Transcript:</p>
            {state.transcript || 'Waiting for your pronunciation...'}
            {state.transcript && state.weakSounds.length > 0 && state.status !== 'success' && (
              <div className="mt-3 space-y-1 text-xs">
                <p className="font-semibold text-rose-600">Detected issues in this attempt:</p>
                <ul className="list-disc space-y-1 pl-4 text-rose-600">
                  {state.weakSounds.map((issue) => (
                    <li key={issue}>{weakSoundLabels[issue] ?? issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="relative">
            <AnimatedTutor tutor={tutor} mood={mood} message={tutorMessage} />
            <ConfettiBurst active={showConfetti} />
          </div>
          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Professional Communication Mode</h2>
            <p className="mt-1 text-sm text-slate-500">Supports numbers, currency, and symbols.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {modes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setSelectedMode(mode.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    selectedMode === mode.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <input
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            />
            <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Pronounce as: <span className="font-semibold text-slate-700">{modeText}</span>
            </div>
            <button
              onClick={() => speakText(modeText)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Play className="h-4 w-4" /> Hear pronunciation
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tutor Personalities</p>
            <h2 className="text-2xl font-semibold text-slate-900">Pick your animal mentor</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs text-slate-500">
            <Award className="h-4 w-4 text-amber-500" /> XP {profile.xp}
          </div>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {tutors.map((item) => (
            <PersonaCard key={item.id} tutor={item} selected={tutor.id === item.id} onSelect={setTutor} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Rewards</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Star rating</span>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4 fill-amber-400" />
                <Star className="h-4 w-4" />
                <Star className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Daily streak</span>
              <span className="font-semibold text-slate-900">{profile.streak} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Achievements</span>
              <span className="font-semibold text-slate-900">{profile.achievements.length}</span>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Weak sound alerts</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {Object.entries(profile.weakSounds).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span>{key.toUpperCase()}</span>
                <span className="font-semibold text-slate-900">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-xs text-rose-600">
            We track your weak sounds to personalize future practice modules.
          </div>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Session status</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Current accuracy</span>
              <span className="font-semibold text-slate-900">{state.accuracy}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Successful words</span>
              <span className="font-semibold text-slate-900">{profile.successes}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Training
