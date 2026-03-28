const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Server error' }))
    throw new Error(error.message || 'Server error')
  }

  return response.json()
}
