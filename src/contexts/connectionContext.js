import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [connected, setConnected] = useState(false)
  const isLogged = async () => {
    try {
      const res = await axios("/api/connection")
      const { loggedIn } = res.data
      setConnected(loggedIn)
    } catch (error) {
      setConnected(false)
    }
  }

  useEffect(() => {
    isLogged()
  }, [])

  return (
    <AuthContext.Provider value={{ connected, refreshConnection: isLogged }}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext)
