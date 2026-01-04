"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Lock,
  CheckCircle,
  ArrowRight,
  Award,
  Microscope,
  Search,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react"
import Link from "next/link"
import InteractiveProgressBar from "@/components/interactive-progress-bar"
import Skeleton from "@mui/material/Skeleton"
import { toast } from "@/hooks/use-toast"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Spinner from "@/components/Spinner"
import { useLearner } from "@/context/LearnerContext"
import { clearUserCache } from "@/lib/clearCache"
import QuestionnaireAlert from "@/components/QuestionnaireAlert"


const iconMap = {
  BookOpen,
  Microscope,
  Search,
  Shield,
  Stethoscope,
  Users
}


export default function CervicalCancerLearnPage() {
  const router = useRouter()
  const {data: session, status} = useSession()
  const { userProfile, setUserProfile, loading, moduleSummary, moduleProgress } = useLearner()
  const [localloading, setLoading] = useState(false)
  const userEmail = session?.user?.email

  const moduleUnlocked = (moduleName: string) => {
    // if (!moduleName) return
    if (!userProfile) return false;

    const getModuleNumber = (name: string) => parseInt(name?.split("-")[1]);
    const targetNumber = getModuleNumber(moduleName);

    // Always unlock current module
    if (userProfile.currentModule === moduleName) return true;

    // module-1 is always unlocked
    if (targetNumber === 1) return true;

    const previousModule = `module-${targetNumber - 1}`;
    return userProfile.completedModules.includes(previousModule);
  };


  const moduleCompleted = (moduleName: string) => userProfile?.completedModules?.includes(moduleName) ?? false
 

  const completedModules = moduleProgress ? Object.values(moduleProgress).filter((p) => p.completed).length : 0
  const allModulesCompleted = userProfile?.completedModules.length === moduleSummary.length

  // Prepare modules for progress bar
  // const progressModules = moduleSummary.map((module) => ({
  //   ...module,
  //   completed: moduleProgress?.[module.order]?.completed || false,
  //   unlocked: moduleProgress?.[module.order]?.unlocked || false,
  // }));



  const handleModuleClick = (moduleId: string) => {
    router.push(`/learn/cervical-cancer/${moduleId}`)
    // console.log('module clicked: ',moduleId)
  }

  const gotToModuleClick = (name: string, order: number) => {
    if (moduleProgress && moduleProgress[order]?.unlocked) {
      window.location.href = `/learn/cervical-cancer/${name}`
    }
  }

  const handleLogout = async () => {
    if (!session?.user?.email) return
    clearUserCache(session.user.email)
    localStorage.setItem("isLoggingOut", "true");

    try {
      setLoading(true)
      await signOut({
        redirect: false, // prevent automatic redirect so you can control it
      }); 
      toast({
        title: "Logged out",
        description: "You have been signed out.",
      });

      window.location.reload()
  
      // setIsLoggedIn(false); // update your local state if you track login status
  
      router.push("/learn"); // redirect after sign out
    } catch (error) {
      console.error(error)
    }

    // localStorage.removeItem(`c3modules_${userId}`);

  };
  
  // console.log("moduleSummary", moduleSummary)

  useEffect(() => {
    if (!userProfile) return
    if (!allModulesCompleted) return
    if (userProfile.currentModule === "certificate") return // prevent infinite loop

    const update = async () => {
      try {
        const res = await fetch("/api/user/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userProfile.email,
            currentModule: "certificate",
          }),
        })

        if (!res.ok) throw new Error("Failed to update currentModule")

        setUserProfile((prev) =>
          prev ? { ...prev, currentModule: "certificate" } : prev
        )
      } catch (err) {
        console.error("Error updating currentModule to certificate:", err)
      }
    }

    update()
  }, [userProfile, allModulesCompleted])



  if (!Array.isArray(moduleSummary)) {
  console.error("Invalid moduleSummary:", moduleSummary)
  return <div className="text-red-500 text-center mt-10">Failed to load modules. Please try again later.</div>
}


  return (
    <div className="min-h-screen pt-24 pb-16 px-0 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <QuestionnaireAlert shouldShow={userProfile?.hasCompletedQuestionnaire === false} />
      
      <Button variant="outline" onClick={handleLogout} className="" disabled={localloading} > {localloading && <Spinner />} Log Out</Button>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div>
            {loading ? <Skeleton width={400} height={50} /> : <h1 className="text-3xl font-bold mb-2">
              Cervical Cancer{" "}
              <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                Learning Modules
              </span>
            </h1>}
            {loading ? <Skeleton width={600} /> : <p className="text-gray-600 dark:text-gray-300">
              Master cervical cancer prevention, detection, and treatment through our comprehensive learning modules.
            </p>}
          </div> 
        </div>

        {/* Interactive Progress Bar */}
        <div className="mb-8">
          
          <InteractiveProgressBar
            modules={moduleSummary && moduleSummary}
            currentModule={parseInt(userProfile?.currentModule.slice(-1) || "1")}
            onModuleClick={handleModuleClick}
            showCertificate={true}
          />
        </div>

        {/* Certificate Section */}
        {(allModulesCompleted && !loading) ? (
          <Card className="mb-8 hover-shadow-gradient border-2 border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {loading ? <Skeleton variant="circular" width={70} height={70} className="bg-gray-400" />: <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center">
                    <Award className="w-10 h-10 text-white" />
                  </div>}
                  <div>
                    {loading ? <Skeleton width={150} /> : <h3 className="text-xl font-bold text-green-600">🎉 Congratulations!</h3>}
                  {loading ? <Skeleton width={600} /> : <p className="text-gray-600 dark:text-gray-300">
                      You've completed all modules. Your certificate is ready.
                    </p>}
                  </div>
                </div>
                {loading ? <Skeleton width={200} height={30}/> : 
                <Link href="/learn/cervical-cancer/certificate">
                  <Button className="gradient-orange-blue text-white hover-shadow-gradient">
                    <Award className="w-4 h-4 mr-2" />
                    Go to Certificate
                  </Button>
                </Link>
                }
              </div>
            </CardContent>
          </Card>
        ) : (<div></div>) }

        {/* Learning Path */}
        <div className="relative">
          {/* Pathline */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-blue-500 to-pink-500 opacity-30 hidden md:block"></div>

          <div className="space-y-8">
            {moduleSummary.map((module, index) => {
              const IconComponent = iconMap[module.icon as keyof typeof iconMap] || BookOpen

              return (
                <div key={module.order}>
                  {loading ? <Skeleton height={600} /> : <div key={module.order} className="relative flex items-start">
                    {/* Path Node */}
                    <div
                      className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 mr-6 md:flex ${
                        moduleCompleted(module.module)
                          ? "bg-green-700 border-green-700"
                          : moduleUnlocked(module.module)
                            ? "gradient-orange-blue border-transparent"
                            : "bg-gray-300 border-gray-300"
                      }`}
                    >
                      {loading ? <Skeleton variant="circular" width={100} height={100} /> : moduleProgress && moduleProgress[module.order]?.completed ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : moduleUnlocked(module.module) ? (
                        <IconComponent className="w-8 h-8 text-white" />
                      ) : (
                        <Lock className="w-8 h-8 text-gray-500" />
                      )}
                    </div>

                    {/* Module Card */}
                    <div className="flex-1">
                      <Card
                        className={`transition-all duration-300 ${
                          moduleUnlocked(module.module)
                            ? "hover-shadow-gradient cursor-pointer hover:scale-[1.02]"
                            : "opacity-50"
                        }`}
                      >
                        <CardHeader>
                          <div className="flex flex-col items-center justify-between">
                            <div className="flex  items-center space-x-4">
                              {/* Mobile Path Node */}
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 md:hidden ${
                                  moduleCompleted(module.module)
                                    ? "bg-green-700 border-green-700"
                                  : moduleUnlocked(module.module)
                                      ? "gradient-orange-blue border-transparent"
                                      : "bg-gray-300 border-gray-300"
                                }`}
                              >
                                {loading ? <Skeleton variant="circular" height={100} width={100} /> : moduleProgress && moduleProgress[module.order]?.completed ? (
                                  <CheckCircle className="w-6 h-6 text-white" />
                                ) : moduleUnlocked(module.module) ? (
                                  <IconComponent className="w-6 h-6 text-white" />
                                ) : (
                                  <Lock className="w-6 h-6 text-gray-500" />
                                )}
                              </div>
                              <div>
                                {loading ? <Skeleton width={300} /> : <CardTitle className="text-xl">
                                  {module.name}:{" "} {module.title}
                                </CardTitle>}
                              </div>
                            </div>

                            <div className="mt-4">
                              {loading ? <Skeleton width={700} /> : <p className="text-gray-600 dark:text-gray-400 mt-1">{module.description}</p>}
                            </div>

                            <div className="text-right space-y-2">
                              {loading ? <Skeleton width={100} /> : moduleCompleted(module.module) && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                  Completed
                                </Badge>
                              )}
                              
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="flex items-center justify-between">
                            {/* <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">                          
                              <span>🎯 Interactive Learning</span>
                            </div> */}

                            {loading ? <Skeleton width={100} /> : moduleUnlocked(module.module) ? (
                              <Link href={`/learn/cervical-cancer/${module.module}`}>
                                <Button className="gradient-orange-blue text-white hover-shadow-gradient group">
                                  {moduleCompleted(module.module) ? "Review Module" : "Start Learning"}
                                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                              </Link>
                            ) : (
                              <Button disabled className="opacity-50">
                                <Lock className="w-4 h-4 mr-2" />
                                Locked
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>}
                </div>
                
              )
            })}
          </div>
        </div>

        {/* Learning Tips */}
        <Card className="mt-12 hover-shadow-gradient">
          <CardHeader>
            {loading ? <Skeleton width={150} /> : <CardTitle>Learning Tips</CardTitle>}
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center flex flex-col items-center">
                {loading ? <Skeleton variant="circular" width={70} height={70} /> : <div className="w-12 h-12 gradient-orange-blue rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>}
                {loading ? <Skeleton width={150} /> : <h4 className="font-semibold mb-2">Take Your Time</h4>}
                {loading ? <Skeleton width={700} /> : <p className="text-sm text-gray-600 dark:text-gray-400">
                  Each module is designed to be comprehensive. Don't rush through the content.
                </p>}
              </div>
              <div className="text-center flex flex-col items-center">
                {loading ? <Skeleton variant="circular" width={70} height={70} /> : <div className="w-12 h-12 gradient-blue-pink rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>}
                {loading ? <Skeleton width={200} /> : <h4 className="font-semibold mb-2">Complete All Sections</h4>}
                {loading ? <Skeleton width={700} /> : <p className="text-sm text-gray-600 dark:text-gray-400">
                  Make sure to complete all sections within a module to unlock the next one.
                </p>}
              </div>
              <div className="text-center flex flex-col items-center">
                {loading ? <Skeleton variant="circular" width={70} height={70} /> : <div className="w-12 h-12 gradient-orange-pink rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>}
                {loading ? <Skeleton width={200} /> : <h4 className="font-semibold mb-2">Earn Your Certificate</h4>}
                {loading ? <Skeleton width={700} /> : <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete all 6 modules to earn your cervical cancer education certificate.
                </p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
