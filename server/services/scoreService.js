export const calculateAccuracy = (spoken, target) => {
  const cleanSpoken = spoken.trim().toLowerCase()
  const cleanTarget = target.trim().toLowerCase()
  const maxLength = Math.max(cleanSpoken.length, cleanTarget.length)
  if (maxLength === 0) return 0
  let distance = 0
  const matrix = Array.from({ length: cleanSpoken.length + 1 }, () =>
    new Array(cleanTarget.length + 1).fill(0),
  )
  for (let i = 0; i <= cleanSpoken.length; i += 1) matrix[i][0] = i
  for (let j = 0; j <= cleanTarget.length; j += 1) matrix[0][j] = j
  for (let i = 1; i <= cleanSpoken.length; i += 1) {
    for (let j = 1; j <= cleanTarget.length; j += 1) {
      const cost = cleanSpoken[i - 1] === cleanTarget[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      )
    }
  }
  distance = matrix[cleanSpoken.length][cleanTarget.length]
  const accuracy = (1 - distance / maxLength) * 100
  return Math.max(0, Math.min(100, Math.round(accuracy)))
}
