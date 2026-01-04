"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Microscope,
  Search,
  Shield,
  Stethoscope,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Lock,
} from "lucide-react"
import { useLearner } from "@/context/LearnerContext"
import Skeleton from "@mui/material/Skeleton"

interface Module {
  id: string;
  order: number;
  description: string;
  name: string;
  module: string;         // e.g., "module-1"
  title: string;
  shortTitle: string;
  completed: boolean;
  unlocked: boolean;
  icon: string;         // name of the Lucide icon (e.g., "Users", "Shield")
  introVideo: string;
  current?: boolean
}


interface InteractiveProgressBarProps {
  modules: Module[]
  currentModule?: number
  onModuleClick?: (moduleId: string) => void
  showCertificate?: boolean
}

const moduleIcons = [
  BookOpen, // Module 1: Introduction
  Microscope,
  Microscope, // Module 2: HPV Connection
  Search, // Module 3: Screening
  Shield, // Module 4: Prevention
  Stethoscope, // Module 5: Treatment
  Users, // Module 6: Community Health
]

export default function InteractiveProgressBar({
  modules,
  currentModule,
  onModuleClick,
  showCertificate = true,
}: InteractiveProgressBarProps) {
  const { userProfile, loading } = useLearner()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const completedModules = userProfile?.completedModules?.length ?? 0
  const totalModules = modules.length
  const allModulesCompleted = userProfile?.completedModules.length === totalModules

  const moduleUnlocked = (moduleName: string) => {
    if(!moduleName) return
    if (!userProfile) return false;

    const getModuleNumber = (name: string) => parseInt(name.split("-")[1]);
    const targetNumber = getModuleNumber(moduleName);

    // Always unlock current module
    if (userProfile.currentModule === moduleName) return true;

    // module-1 is always unlocked
    if (targetNumber === 1) return true;

    const previousModule = `module-${targetNumber - 1}`;
    return userProfile.completedModules.includes(previousModule);
  };


  const moduleCompleted = (moduleName: string) => userProfile?.completedModules?.includes(moduleName) ?? false

  

  // Add certificate as final step if enabled
  const progressItems = [
    ...modules.map((module: Module, index) => ({
      ...module,
      icon: moduleIcons[index] || BookOpen,
      isCertificate: false,
    })),
    ...(showCertificate
      ? [
          {
            name: 'certificate',
            module: `certificate`,
            id: totalModules + 1,
            title: "Certificate",
            shortTitle: "Certificate",
            icon: Award,
            completed: allModulesCompleted,
            unlocked: allModulesCompleted,
            current: false,
            isCertificate: true,
            order: totalModules + 1
          },
        ]
      : []),
  ]

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount)

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollButtons)
      window.addEventListener("resize", checkScrollButtons)

      return () => {
        container.removeEventListener("scroll", checkScrollButtons)
        window.removeEventListener("resize", checkScrollButtons)
      }
    }
  }, [])

  // Auto-scroll to current module
  useEffect(() => {
    if (currentModule && scrollContainerRef.current) {
      const currentIndex = modules.findIndex((m) => m.id === String(currentModule))
      if (currentIndex !== -1) {
        const itemWidth = 160 // Approximate width of each progress item
        const scrollPosition = currentIndex * itemWidth - scrollContainerRef.current.clientWidth / 2 + itemWidth / 2

        scrollContainerRef.current.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: "smooth",
        })
      }
    }
  }, [currentModule, modules])

  return (
    <Card className="hover-shadow-gradient overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            {loading ? <Skeleton width={200}/> : <h3 className="text-lg font-semibold">Learning Progress</h3>}
            {loading ? <Skeleton width={200} /> : <p className="text-sm text-gray-600 dark:text-gray-400">
              {completedModules} of {totalModules} modules completed
            </p>}
          </div>
          <div className="flex items-center space-x-2">
            {loading ? <Skeleton width={100}/> : <Badge variant="outline" className="text-xs">
              {Math.round((completedModules / totalModules) * 100)}% Complete
            </Badge>}
            {loading ? <Skeleton width={200} /> : allModulesCompleted && showCertificate && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                <Award className="w-3 h-3 mr-1" />
                Certificate Ready!
              </Badge>
            )}
          </div>
        </div>

        <div className="relative">
          {/* Scroll Buttons */}
          {/* {canScrollLeft && (
            <Button
              variant="outline"
              size="sm"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 p-0 bg-white dark:bg-gray-800 shadow-lg"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )} */}

          {/* {canScrollRight && (
            <Button
              variant="outline"
              size="sm"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 p-0 bg-white dark:bg-gray-800 shadow-lg"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          )} */}

          {/* Progress Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex items-center space-x-0 min-w-max px-2 relative">
              {/* Background Roadmap Line */}
              <div className="absolute top-8 left-12 right-11 h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0"></div>

              {/* Dynamic Progress Line */}
              <div
                className="absolute top-8 left-12 h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 rounded-full z-0 transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.max(0, (completedModules / totalModules) * 100)}%`,
                  maxWidth: `calc(100% - 4rem)`,
                }}
              ></div>

              {progressItems.map((item, index) => {
                const IconComponent = item.icon
                const isCurrentModule = userProfile?.currentModule === item.module
                const isClickable = item.unlocked && !item.isCertificate && onModuleClick

                return (
                  <div key={item.id} className="flex items-center relative z-10">
                    {/* Progress Item */}
                    <div className="flex flex-col items-center space-y-2 px-4">
                      {/* Circle with Icon */}
                      {loading ? <Skeleton variant="circular" width={70} height={70} /> : <div
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                          moduleCompleted(item.module)
                            ? "bg-green-700 border-green-700 shadow-lg"
                            : isCurrentModule
                              ? "gradient-orange-blue border-transparent shadow-lg scale-110"
                              : moduleUnlocked(item.module)
                                ? "gradient-orange-blue border-transparent"
                                : "bg-gray-300 border-gray-300"
                        } ${isClickable ? "cursor-pointer hover:scale-105" : ""}`}
                        onClick={() => {
                          // console.log(item)
                          isClickable && onModuleClick(item.module) 
                        }}
                      >
                        {moduleCompleted(item.module) ? (
                          <IconComponent className="w-8 h-8 text-white" />
                        ) : moduleUnlocked(item.module) ? (
                          <IconComponent className="w-8 h-8 text-white" />
                        ) : (
                          <Lock className="w-8 h-8 text-gray-500" />
                        )}

                        {/* Current Module Indicator */}
                        {isCurrentModule && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white animate-pulse"></div>
                        )}

                        {/* Completion Badge */}
                        {moduleCompleted(item.module) && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}

                        {/* Progress Pulse Animation for Current Module */}
                        {isCurrentModule && (
                          <div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping opacity-30"></div>
                        )}
                      </div>}

                      {/* Module Info */}
                      <div className="text-center min-w-[120px]">
                        <p
                          className={`text-xs font-medium ${
                            isCurrentModule
                              ? "text-orange-600 dark:text-orange-400"
                              : moduleCompleted(item.module)
                                ? "text-green-600 dark:text-green-400"
                                : moduleUnlocked(item.module)
                                  ? "text-gray-900 dark:text-gray-100"
                                  : "text-gray-500"
                          }`}
                        >
                          {loading ? <Skeleton width={100} /> : item.isCertificate ? "Certificate" : `${item.name}`}
                        </p>
                        <p
                          className={`text-xs ${
                            isCurrentModule
                              ? "text-orange-500 dark:text-orange-300"
                              : moduleCompleted(item.module)
                                ? "text-green-500 dark:text-green-300"
                                : moduleUnlocked(item.module)
                                  ? "text-gray-700 dark:text-gray-300"
                                  : "text-gray-400"
                          }`}
                        >
                          {loading ? <Skeleton width={100} /> : item.shortTitle}
                        </p>

                        {/* Status Badge */}
                        {isCurrentModule && (
                          <Badge className="mt-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 text-xs">
                            {loading ? <Skeleton width={100} /> : "Current"}
                          </Badge>
                        )}
                        {moduleCompleted(item.module) && !isCurrentModule && (
                          <Badge className="mt-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                            {loading ? <Skeleton width={100} /> : "Complete"}
                          </Badge>
                        )}
                        {!moduleUnlocked(item.module) && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {loading ? <Skeleton width={100} /> : "Locked"}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Milestone Markers */}
                    {index < progressItems.length - 1 && (
                      <div className="absolute top-8 left-full w-8 h-1 flex items-center justify-center z-10">
                        {/* Progress Dot */}
                        <div
                          className={`w-2 h-2 rounded-full transition-all duration-500 ${
                            moduleCompleted(item.module)
                              ? "bg-green-400 shadow-lg"
                              : isCurrentModule
                                ? "bg-orange-400 animate-pulse shadow-md"
                                : "bg-gray-300"
                          }`}
                        ></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-wrap space-x-4 mb-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              {loading ? <Skeleton width={100} /> : <span>Completed</span>}
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 gradient-orange-blue rounded-full !ml-0"></div>
              {loading ? <Skeleton width={100} /> : <span>Current/Available</span>}
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              {loading ? <Skeleton width={100} /> : <span>Locked</span>}
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-green-500 rounded-full"></div>
              {loading ? <Skeleton width={100} /> : <span>Learning Path</span>}
            </div>
          </div>

          {showCertificate && (
            <div className="text-right">
              <p className="text-xs">
                {allModulesCompleted
                  ? "🎉 Ready to claim certificate!"
                  : `${totalModules - completedModules} modules remaining`}
              </p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-green-500 transition-all duration-1000"
                    style={{ width: `${(completedModules / totalModules) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs">{Math.round((completedModules / totalModules) * 100)}%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
