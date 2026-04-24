import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const storageKey = 'powerpulse-web-auth'

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth())

  const value = useMemo(() => ({
    auth,
    login(nextAuth) {
      localStorage.setItem(storageKey, JSON.stringify(nextAuth))
      setAuth(nextAuth)
    },
    logout() {
      localStorage.removeItem(storageKey)
      setAuth(null)
    }
  }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
