// components/ClientLayoutWrapper.tsx
"use client"

import { useEffect, useContext, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { getLoggedInUser } from "@/services/auth/auth.service"
import { UserContext } from "@/contexts/user-context"

interface ClientLayoutWrapperProps {
  children: React.ReactNode
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {

  const [loading, setLoading] = useState(false)

  const userContext = useContext(UserContext)
    
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const { data } = await getLoggedInUser()
        userContext?.setUser(data.user)
      } catch (err : any) {
        console.error("Error fetching user:", err.response.data.message)
        toast({
          title: "Error in fetching user",
          description: "Please Log in again or Sign up to continue",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-3">Loading...</span>
      </div>
    )
  }

  return <>{children}</>
}