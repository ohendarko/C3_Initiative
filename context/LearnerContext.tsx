"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Module, ModuleSummary } from '@/lib/types'

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
  password?: string
  currentModule: string
  preTestCompleted: string[]
  postTestCompleted: string[]
  completedModules: string[]
  completedSections: string[]
  moduleProgress: string[]
  admin?: boolean
  hasCompletedQuestionnaire?: boolean
  certificate?: boolean
  certificateIssueDate?: string
  certificateUrl?: string
  certificateId?: string
  emailVerified?: boolean
  createdAt?: Date
  updatedAt?: Date
}

type ModuleProgress = {
  [id: number]: {
    completed: boolean
    unlocked: boolean
  }
}

interface LearnerContextType {
  userProfile: UserProfile | null
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
  loading: boolean
  modules: Module[]
  moduleSummary: ModuleSummary[]
  moduleProgress: ModuleProgress | null
  canAccessModule: (moduleName: string) => boolean
  isLoggedIn: boolean
  isLoggedOut: boolean
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined)

export const LearnerProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("[LearnerProvider] RENDERED")
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [moduleSummary, setModuleSummary] = useState<ModuleSummary[]>([])
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const isLoggedIn = status === "authenticated" && !!userProfile
  const isLoggedOut = status === "unauthenticated"

  const refetch = () => {
    console.log("[LearnerContext] Manual refetch triggered")
    setRefetchTrigger(prev => prev + 1)
  }

  // Calculate module progress whenever userProfile or moduleSummary changes
  useEffect(() => {
    if (!userProfile || !moduleSummary.length) {
      setModuleProgress(null)
      return
    }
    console.log("[LearnerContext] Calculating module progress")

    const progress: ModuleProgress = {}
    
    moduleSummary.forEach((module) => {
      const isCompleted = userProfile.completedModules.includes(module.module)
      const isUnlocked = canAccessModule(module.module)
      
      progress[module.order] = {
        completed: isCompleted,
        unlocked: isUnlocked,
      }
    })

    setModuleProgress(progress)
  }, [userProfile, moduleSummary])

  useEffect(() => {
    let mounted = true
    let abortController = new AbortController()

    const fetchModuleSummary = async (email: string) => {
      console.log("[LearnerContext] Fetching module summary for:", email)
      console.log("Fetching module summary...")
      try {
        const cached = localStorage.getItem(`c3-moduleSummary-${email}`)
        if (cached && mounted) {
          setModuleSummary(JSON.parse(cached))
        }

        const res = await fetch(`/api/module-summary`, { 
          signal: abortController.signal 
        })
        const data = await res.json()

        if (Array.isArray(data.summaries) && mounted) {
          console.log("[LearnerContext] Module summary fetched:", data.summaries.length, "modules")
          setModuleSummary(data.summaries)
          localStorage.setItem(`c3-moduleSummary-${email}`, JSON.stringify(data.summaries))
        } else {
          console.error("Invalid module summary format:", data)
          if (mounted) setModuleSummary([])
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("[LearnerContext] Error fetching module summary:", err)
        }
        if (mounted) setModuleSummary([])
      }
    }

    const loadData = async () => {
      console.log(`[LearnerContext] Status: ${status}, Email: ${session?.user?.email}`)
      // Handle NextAuth loading state
      if (status === "loading") {
        console.log("[LearnerContext] Session loading, waiting...")
        setLoading(true)
        return
      }

      // Handle unauthenticated - clear everything
      if (status === "unauthenticated") {
        console.log("[LearnerContext] User unauthenticated, clearing data")
        if (mounted) {
          setUserProfile(null)
          setModules([])
          setModuleSummary([])
          setModuleProgress(null)
          setLoading(false)
          router.push('/learn')
        }
        return
      }

      // Handle authenticated - fetch data
      if (status === "authenticated" && session?.user?.email) {

      if (userProfile && !userProfile.emailVerified) {
          router.push(`/pending-verification?email=${encodeURIComponent(userProfile.email)}`);
      }

      console.log(`[LearnerContext] User authenticated: ${session.user.email}, fetching data...`)
        setLoading(true)
        
        try {
          const [profileResult, modulesResult] = await Promise.allSettled([
            fetch(`/api/user/profile?email=${session.user.email}`),
            fetch('/api/modules', { 
              signal: abortController.signal 
            })
          ])

          if (!mounted) return

          // Handle profile
          if (profileResult.status === "fulfilled") {
            const profileData = await profileResult.value.json()
            setUserProfile(profileData)
            
            // Fetch module summary after we have the email
            await fetchModuleSummary(profileData.email)
          } else {
            console.error("Failed to fetch profile:", profileResult.reason)
            setUserProfile(null)
          }

          // Handle modules
          if (modulesResult.status === "fulfilled") {
            const modulesData = await modulesResult.value.json()
            setModules(modulesData)
          } else {
            console.error("Failed to fetch modules:", modulesResult.reason)
            setModules([])
          }
        } catch (err) {
          console.error("Error loading learner data", err)
          if (mounted) {
            setUserProfile(null)
            setModules([])
            setModuleSummary([])
          }
        } finally {
          if (mounted) {
            setLoading(false)
          }
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [status, session?.user?.email])

  const canAccessModule = (moduleName: string) => {
    if (!userProfile) return false
    if (!userProfile?.emailVerified) return false
    if (!userProfile.hasCompletedQuestionnaire) return false

    const currentIndex = parseInt(moduleName.split("-")[1], 10)
    const prevModule = currentIndex > 1 ? `module-${currentIndex - 1}` : null

    return (
      moduleName === "module-1" ||
      moduleName === userProfile.currentModule ||
      userProfile.completedModules.includes(moduleName) ||
      (prevModule !== null && userProfile.completedModules.includes(prevModule))
    )
  }

  return (
    <LearnerContext.Provider value={{
      userProfile,
      setUserProfile,
      loading,
      modules,
      moduleSummary,
      moduleProgress,
      canAccessModule,
      isLoggedIn,
      isLoggedOut,
    }}>
      {children}
    </LearnerContext.Provider>
  )
}

export const useLearner = () => {
  const context = useContext(LearnerContext)
  if (!context) throw new Error("useLearner must be used within LearnerProvider")
  return context
}