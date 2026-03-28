interface SpeechRecognitionResult {
  readonly transcript: string
  readonly confidence: number
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent {
  readonly results: {
    readonly length: number
    item(index: number): { item(index: number): SpeechRecognitionResult }
    [index: number]: { item(index: number): SpeechRecognitionResult; 0: SpeechRecognitionResult }
  }
}

interface SpeechRecognitionErrorEvent {
  readonly error: string
}

interface SpeechRecognition {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  start(): void
  stop(): void
  abort(): void
}

type SpeechRecognitionConstructor = new () => SpeechRecognition

interface Window {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}
