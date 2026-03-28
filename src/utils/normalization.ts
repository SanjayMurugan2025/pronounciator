const numberMap: Record<string, string> = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '10': 'ten',
  '20': 'twenty',
  '30': 'thirty',
  '40': 'forty',
  '50': 'fifty',
  '60': 'sixty',
  '70': 'seventy',
  '80': 'eighty',
  '90': 'ninety',
}

const tensMap: Record<string, string> = {
  '2': 'twenty',
  '3': 'thirty',
  '4': 'forty',
  '5': 'fifty',
  '6': 'sixty',
  '7': 'seventy',
  '8': 'eighty',
  '9': 'ninety',
}

const convertTwoDigits = (num: number): string => {
  if (num === 0) return ''
  if (num <= 10) return numberMap[num.toString()]
  if (num < 20) {
    const teens: Record<number, string> = {
      11: 'eleven',
      12: 'twelve',
      13: 'thirteen',
      14: 'fourteen',
      15: 'fifteen',
      16: 'sixteen',
      17: 'seventeen',
      18: 'eighteen',
      19: 'nineteen',
    }
    return teens[num]
  }
  const tens = Math.floor(num / 10)
  const ones = num % 10
  return `${tensMap[tens.toString()]}${ones > 0 ? ' ' + numberMap[ones.toString()] : ''}`
}

const homophones: Record<string, string> = {
  'to': '2',
  'too': '2',
  'two': '2', // Explicitly handle two just in case
  'for': '4',
  'four': '4',
  'fore': '4',
  'ate': '8',
  'eight': '8',
  'won': '1',
  'one': '1',
  'oh': '0',
  'zero': '0',
  'tree': '3', // Common mispronunciation of three
  'free': '3', // Common mispronunciation of three
  'then': '10', // Sometimes ten sounds like then
}

const preprocessHomophones = (text: string): string => {
  let processed = text.toLowerCase()
  Object.entries(homophones).forEach(([word, replacement]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'g')
    processed = processed.replace(regex, replacement)
  })
  return processed
}

export const normalizeNumbers = (text: string): string => {
  const preprocessed = preprocessHomophones(text)
  return preprocessed.replace(/\b\d+\b/g, (match) => {
    const num = parseInt(match, 10)
    if (isNaN(num)) return match

    if (num === 0) return 'zero'

    let result = ''
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000)
      result += `${convertTwoDigits(thousands)} thousand `
      const remainder = num % 1000
      if (remainder > 0) {
        if (remainder < 100) result += 'and '
        result += normalizeNumbers(remainder.toString())
      }
    } else if (num >= 100) {
      const hundreds = Math.floor(num / 100)
      result += `${numberMap[hundreds.toString()]} hundred `
      const remainder = num % 100
      if (remainder > 0) {
        result += `and ${convertTwoDigits(remainder)}`
      }
    } else {
      result = convertTwoDigits(num)
    }

    return result.trim()
  })
}

export const normalizeDigits = (text: string): string => {
  const preprocessed = preprocessHomophones(text)
  return preprocessed.replace(/\b\d+\b/g, (match) => {
    return match.split('').map(digit => numberMap[digit] || digit).join(' ')
  })
}
