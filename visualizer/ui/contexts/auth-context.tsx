"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AuthState, User } from "@/types/auth"

interface AuthContextType extends AuthState {
  signIn: (user: User) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, check for existing session/token
        const savedUser = localStorage.getItem("auth-user")
        if (savedUser) {
          const user = JSON.parse(savedUser)
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          })
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    checkAuth()
  }, [])

  const signIn = (user: User) => {
    localStorage.setItem("auth-user", JSON.stringify(user))
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: true,
    })
  }

  const signOut = () => {
    localStorage.removeItem("auth-user")
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
