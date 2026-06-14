import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, tokenVal) => {
    localStorage.setItem('token', tokenVal)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(tokenVal)
    setUser(userData)
  }

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  // Auto-logout after 5 minutes of inactivity
  useEffect(() => {
    if (!token || !user) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    const handleInactivity = () => {
      logout()
      toast('Logged out due to 5 minutes of inactivity', { icon: '💤' })
    }

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(handleInactivity, 5 * 60 * 1000)
    }

    resetTimer()
    const events = ['mousemove', 'keydown', 'scroll', 'click']
    events.forEach(e => window.addEventListener(e, resetTimer))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach(e => window.removeEventListener(e, resetTimer))
    }
  }, [token, user, logout])

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, loading, isAuthenticated: !!token && !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)




