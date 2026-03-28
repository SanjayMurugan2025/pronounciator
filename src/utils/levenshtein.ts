export const levenshteinDistance = (a: string, b: string) => {
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      )
    }
  }

  return matrix[a.length][b.length]
}

export const similarityScore = (spoken: string, target: string) => {
  const cleanSpoken = spoken.trim().toLowerCase()
  const cleanTarget = target.trim().toLowerCase()
  const maxLength = Math.max(cleanSpoken.length, cleanTarget.length)
  if (maxLength === 0) return 0
  const distance = levenshteinDistance(cleanSpoken, cleanTarget)
  const accuracy = (1 - distance / maxLength) * 100
  return Math.max(0, Math.min(100, Math.round(accuracy)))
}
