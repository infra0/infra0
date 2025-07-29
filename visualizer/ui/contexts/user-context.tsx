"use client"

import type React from "react"
import { createContext, useState } from "react"
import type { User } from "@/types/user"


interface UserState {
    data: User | null,
    setUser: (user: User) => void,
    removeUser: () => void,
}

export const UserContext = createContext<UserState | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState({
    data: null as User | null,
  })

  const setUser = (user: User) => {
    setUserState({
      data: user,
    })
  }
  
  const removeUser = () => {
    setUserState({
      data: null,
    })
  }


  return (
    <UserContext.Provider
      value={{
        ...userState,
        setUser,
        removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}