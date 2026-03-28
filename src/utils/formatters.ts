export const formatForSpeech = (input: string, mode: 'phone' | 'social' | 'address') => {
  const replacements: Record<string, string> = {
    '#': mode === 'phone' ? 'hash' : mode === 'social' ? 'hashtag' : 'number',
    '@': 'at',
    '%': 'percent',
    '&': 'and',
    '*': 'asterisk',
    '$': 'dollar',
    '₹': 'rupee',
    '/': 'slash',
    '-': 'dash',
    '_': 'underscore',
    ':': 'colon',
    ';': 'semicolon',
    '.': 'dot',
    ',': 'comma',
    '(': 'open parenthesis',
    ')': 'close parenthesis',
  }

  if (input.includes('@') && input.includes('.')) {
    return input
      .replace('_', ' underscore ')
      .replace('@', ' at ')
      .replace('.', ' dot ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  return input
    .split('')
    .map((char) => replacements[char] || char)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
