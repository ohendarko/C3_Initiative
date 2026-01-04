// context/UserContext.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface UserContextType {
  isAdmin: boolean
  userName: string | null
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      setLoading(true)
      return
    }

    if (status === "unauthenticated") {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    if (status === "authenticated" && session?.user?.email) {
      // Lightweight fetch - only admin status
      fetch(`/api/user/admin-status?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => setIsAdmin(data.admin || false))
        .finally(() => setLoading(false))
    }
  }, [status, session?.user?.email])

  return (
    <UserContext.Provider value={{ 
      isAdmin, 
      userName: session?.user?.name || null,
      loading 
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within UserProvider")
  return context
}