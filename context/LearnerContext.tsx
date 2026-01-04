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
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [moduleSummary, setModuleSummary] = useState<ModuleSummary[]>([])
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress | null>(null)
  const [loading, setLoading] = useState(true)

  const isLoggedIn = !loading && !!userProfile
  const isLoggedOut = !loading && !userProfile

  useEffect(() => {
    let mounted = true

    const fetchModuleSummary = async (email: string) => {
      console.log("Fetching module summary...");
      try {
        const cached = localStorage.getItem(`c3-moduleSummary-${email}`)
        if (cached) {
          setModuleSummary(JSON.parse(cached))
        }

        const res = await fetch(`/api/module-summary`)
        const data = await res.json()
        console.log(data)

        if (Array.isArray(data.summaries)) {
          if (mounted) {
            setModuleSummary(data.summaries)
            localStorage.setItem(`c3-moduleSummary-${email}`, JSON.stringify(data.summaries))
          }
        } else {
          console.error("Invalid module summary format:", data)
          if (mounted) setModuleSummary([])
        }
      } catch (err) {
        console.error("Error fetching module summary", err)
        if (mounted) setModuleSummary([])
      }
    }


    const loadData = async () => {
      if (status === "unauthenticated") {
        router.push('/learn')
        return
      }

      if (status !== "authenticated" || !session?.user?.email) return

      try {
        const [profileResult, modulesResult] = await Promise.allSettled([
          fetch(`/api/user/profile?email=${session.user.email}`),
          fetch('/api/modules')
        ])

        if (mounted) {
          if (profileResult.status === "fulfilled") {
            const profileData = await profileResult.value.json()
            setUserProfile(profileData)
            fetchModuleSummary(profileData.email) // Run summary fetch once email is known
          }

          if (modulesResult.status === "fulfilled") {
            const modulesData = await modulesResult.value.json()
            setModules(modulesData)
          }
        }
      } catch (err) {
        console.error("Error loading learner data", err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [session, status, router])

  const canAccessModule = (moduleName: string) => {
    if (!userProfile) return false
    if (!userProfile.hasCompletedQuestionnaire) return false

    // Extract the numeric part (e.g., "module-3" -> 3)
    const currentIndex = parseInt(moduleName.split("-")[1], 10)

    // Name of the previous module
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
