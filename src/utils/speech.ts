type SpeechRecognitionConstructor = new () => SpeechRecognition

export const speechToText = (onResult: (text: string) => void, onError: (error: string) => void) => {
  const SpeechRecognitionClass =
    (window as typeof window & {
      webkitSpeechRecognition?: SpeechRecognitionConstructor
    }).webkitSpeechRecognition ||
    (window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor
    }).SpeechRecognition

  if (!SpeechRecognitionClass) {
    onError('Speech Recognition API not supported in this browser.')
    return null
  }

  const recognition = new SpeechRecognitionClass()
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript
    onResult(transcript)
  }
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onError(event.error)
  }

  return recognition
}

export const speakText = (text: string, rate = 1) => {
  if (!window.speechSynthesis) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = rate
  utterance.pitch = 1
  utterance.lang = 'en-US'
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}
