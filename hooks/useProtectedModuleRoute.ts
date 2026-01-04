
"use client"

import { useEffect } from "react"
import { useLearner } from "@/context/LearnerContext"
import { useRouter, usePathname } from "next/navigation"

export const useProtectedModuleRoute = () => {
  const { userProfile, loading, canAccessModule } = useLearner()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    if (pathname.includes("/certificate")) return

    if (!loading && !userProfile) {
      router.push("/learn")
      return
    } else {
      const moduleMatch = pathname.match(/module-(\d+)/)
      const moduleName = moduleMatch ? `module-${moduleMatch[1]}` : null
      // console.log(moduleName, moduleMatch)

      if (moduleName && !canAccessModule(moduleName)) {
        router.push("/learn/cervical-cancer/locked")
      }
    }
  }, [userProfile, loading, pathname])
}
