export const detectWeakSounds = (spoken: string, target: string) => {
  const issues: Array<'th' | 'rl' | 'vw' | 'silent'> = []
  const lowerSpoken = spoken.toLowerCase()
  const lowerTarget = target.toLowerCase()

  if (lowerTarget.includes('th') && !lowerSpoken.includes('th')) issues.push('th')
  if (/(r|l)/.test(lowerTarget) && !(lowerSpoken.match(/r|l/) || []).length) issues.push('rl')
  if (/(v|w)/.test(lowerTarget) && !(lowerSpoken.match(/v|w/) || []).length) issues.push('vw')
  if (/(b|k|t|d)$/i.test(lowerTarget) && lowerSpoken.endsWith(lowerTarget.slice(0, -1))) {
    issues.push('silent')
  }

  return issues
}
