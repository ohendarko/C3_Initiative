"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  CheckCircle,
  ArrowRight,
  Lock,
} from "lucide-react"
import Link from "next/link"
import Skeleton from "@mui/material/Skeleton"
import SectionRenderer from "@/components/SectionRenderer"
import { useProtectedModuleRoute } from "@/hooks/useProtectedModuleRoute"
import { useLearner } from "@/context/LearnerContext"
import { useSession } from "next-auth/react"
import FullScreenQuizDialog from "@/components/FullScreenQuizDialog"
import { UserProfile } from "@/context/LearnerContext"


type LearningCard = {
  id: string
  title: string
  content: string
  infographic?: string
  order: number
}

type Section = {
  id: string
  name: string
  title: string
  description: string
  order: number
  learningCards: LearningCard[]
  quizzes: any[] // define if needed
}


type Questions = {
  order: number
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

type PostTest = {
  name: string
  questions: Questions[]
}

type PreTest = {
  name: string
  questions: Questions[]
}

type Module = {
  id: string
  module: string
  name?: string
  title: string
  description: string
  icon: string
  order: number
  introVideo: string
  completed: boolean
  unlocked: boolean
  sections: Section[]
  preTest: PreTest
  postTest: PostTest
}



type SectionProgress = {
  [key: number]: { completed: boolean; unlocked: boolean }
}

export default function ModulePage() {
  const { userProfile, setUserProfile, loading } = useLearner()
  useProtectedModuleRoute()

  const router = useRouter()
  const { data: session } = useSession()
  const userEmail = session?.user?.email

  const [activeSection, setActiveSection] = useState(1)
  const [sectionProgress, setSectionProgress] = useState<SectionProgress>({})
  const [showPostTest, setShowPostTest] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lesson, setLesson] = useState<Module | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [hasShownCompletionModal, setHasShownCompletionModal] = useState(false)
  const [totalModules, setTotalModules] = useState(0)
  const pretestQuestions = lesson?.preTest.questions || []
  const postTestQuestions = lesson?.postTest.questions || []
  const pretestKey = `pretest-${lesson?.order}`
  const posttestKey = `posttest-${lesson?.order}`
  const pretestCompleted = userProfile?.preTestCompleted?.includes(pretestKey) ?? false
  const postTestCompleted = userProfile?.postTestCompleted?.includes(posttestKey) ?? false
  const [showQuiz, setShowQuiz] = useState(!pretestCompleted)
  const [showPostQuiz, setShowPostQuiz] = useState(!postTestCompleted)





  const  params = useParams()
  const { module } = params as  {module: string}


  useEffect(() => {
    const fetchModule = async () => {
      if (!module || !userEmail) return

      setIsLoading(true)

      try {
        const lessonKey = `c3-lesson-${userEmail}-${module}`
        const summaryKey = `c3-summaryCount-${userEmail}`

        // ✅ Load total module count if available
        const cachedSummaryCount = localStorage.getItem(summaryKey)
        if (cachedSummaryCount) {
          setTotalModules(parseInt(cachedSummaryCount, 10))
        } else {
          const summaryRes = await fetch("/api/module-summary")
          const summaryData = await summaryRes.json()
          setTotalModules(summaryData.summaryCount)
          localStorage.setItem(summaryKey, summaryData.summaryCount.toString())
        }

        // ✅ Load lesson from localStorage if available
        const cachedLesson = localStorage.getItem(lessonKey)
        if (cachedLesson) {
          const parsedLesson = JSON.parse(cachedLesson)
          setLesson(parsedLesson)

          const newProgress: SectionProgress = {}
          parsedLesson.sections.forEach((section: Section) => {
            newProgress[section.order] = {
              completed: false,
              unlocked: section.order === 1,
            }
          })
          setSectionProgress(newProgress)

          setIsLoading(false)
          return
        }

        // ✅ Fetch lesson if not cached
        const res = await fetch(`/api/modules/${module}`)
        if (!res.ok) throw new Error("Failed to fetch module")

        const lessonData = await res.json()
        setLesson(lessonData)
        localStorage.setItem(lessonKey, JSON.stringify(lessonData))

        const newProgress: SectionProgress = {}
        lessonData.sections.forEach((section: Section) => {
          newProgress[section.order] = {
            completed: false,
            unlocked: section.order === 1,
          }
        })
        setSectionProgress(newProgress)
      } catch (err) {
        console.error(err)
        setLesson(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModule()
  }, [module, userEmail])




  // console.log('totalmodules',totalModules)
  // console.log(lesson)
  // console.log('sectionprogress', sectionProgress)

  const handleQuizComplete = async (mode: "pretest" | "posttest") => {
    if (!lesson) return
    try {
      const isPretest = mode === "pretest"
      const fieldToUpdate = isPretest ? "preTestCompleted" : "postTestCompleted"

      const updateValue = [`${mode}-${lesson?.order}`]
      const completedModule = `module-${lesson?.order}`

      const body: any = {
        email: userProfile?.email,
        [fieldToUpdate]: updateValue,
        addOn: true,
      }

      // Always set next module
      body.currentModule = `module-${lesson?.order + 1}`

      // If it's a posttest, also add to completedModules
      if (!isPretest) {
        body.completedModules = [completedModule]
      }

      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Failed to update quiz status")

      if (isPretest) {
        setShowQuiz(false)
        setUserProfile((prev) =>
          prev
            ? {
                ...prev,
                preTestCompleted: [...prev.preTestCompleted, ...updateValue],
              }
            : prev
        )
      } else {
        setShowPostQuiz(false)
        setUserProfile((prev) =>
          prev
            ? {
                ...prev,
                postTestCompleted: [...prev.postTestCompleted, ...updateValue],
                completedModules: [...prev.completedModules, completedModule],
              }
            : prev
        )
      }
    } catch (err) {
      console.error("Error updating user profile:", err)
    }
  }




  const saveProgressLocally = (sectionName: string, email: string) => {
    const key = `c3-progress-${email}`

    // Try to load existing progress
    let progress: string[] = []

    const existing = localStorage.getItem(key)
    if (existing) {
      try {
        progress = JSON.parse(existing)
      } catch (err) {
        console.warn("Failed to parse local progress, resetting:", err)
        progress = []
      }
    }

    // Add section only if not already there
    if (!progress.includes(sectionName)) {
      progress.push(sectionName)
      localStorage.setItem(key, JSON.stringify(progress))
    }

    // console.log(progress)
  }


  
  const handleSectionComplete = (sectionId: number, nextSection?: number) => {
    if (!lesson || !userEmail) return

    const currentSection = lesson.sections.find((s) => s.order === sectionId)
    if (!currentSection) return

    // Save progress locally
    saveProgressLocally(currentSection.name, userEmail)

    // Update local UI state
    setSectionProgress((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], completed: true },
      [sectionId + 1]: { ...prev[sectionId + 1], unlocked: true },
    }))

    // Move to next section
    if (nextSection && nextSection <= lesson.sections.length) {
      setActiveSection(nextSection)
    }

    // Check if all sections are completed
    const allCompleted = lesson.sections.every(
      (section) => section.order === sectionId || sectionCompleted(section.name)
    )

    if (allCompleted) {
      setShowPostTest(true)
    }
  }



  // const sectionCompleted = lesson
  //   ? lesson.sections.some(section => userProfile?.completedSections?.includes(section.name))
  //   : false

  const getLocalCompletedSections = (email: string): string[] => {
    if (!email) return []
    try {
      const raw = localStorage.getItem(`c3-progress-${email}`)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }


  const sectionCompleted = (sectionName: string): boolean => {
    const email = session?.user?.email
    if (!email) return false
    const localCompleted = getLocalCompletedSections(email)
    const remoteCompleted = userProfile?.completedSections || []

    return [...remoteCompleted, ...localCompleted].includes(sectionName)
  }


  const sectionUnlocked = (sectionName: string): boolean => {
    const email = session?.user?.email
    if(!email) return false
    const completedSections = [
      ...(userProfile?.completedSections || []),
      ...getLocalCompletedSections(email),
    ]

    if (completedSections.includes(sectionName)) return true

    const match = sectionName.match(/^section-(\d+)-(\d+)$/)
    if (!match) return false

    const module = parseInt(match[1], 10)
    const section = parseInt(match[2], 10)

    // First section of any module is always unlocked
    if (section === 1) return true

    const previousSection = `section-${module}-${section - 1}`
    return completedSections.includes(previousSection)
  }



  // const handlePostTestPass = () => {
  //   setShowPostTest(false)
  //   // Navigate to next module
  //   router.push("/learn/cervical-cancer/module-2")
  // }

  // const handleModuleClick = (moduleId: number) => {
  //   if (moduleId !== 1) {
  //     // Navigate to other modules when they're unlocked
  //     router.push(`/learn/cervical-cancer/module-${moduleId}`)
  //   }
  // }

  const activeSectionData = lesson && lesson.sections.find(s => s.order === activeSection)
  
  

  const completedInModule = (moduleNumber: number): number => {
    const email = session?.user?.email
    if(!email) return 0
    const local = getLocalCompletedSections(email)
    const remote = userProfile?.completedSections || []

    const allCompleted = [...new Set([...remote, ...local])]

    return allCompleted.filter((sectionName) => {
      const match = sectionName.match(/^section-(\d+)-\d+$/)
      return match && parseInt(match[1], 10) === moduleNumber
    }).length
  }

  const completedSections = lesson ? completedInModule(lesson.order) : 0
  const allSectionsCompleted = completedSections === lesson?.sections.length

  useEffect(() => {
    const allCompleted = completedSections === lesson?.sections.length

    if (allCompleted && !hasShownCompletionModal) {
      setShowCompletionModal(true)
      setHasShownCompletionModal(true)
    }
  }, [completedSections, lesson, hasShownCompletionModal])

    useEffect(() => {
      const allCompleted = completedSections === lesson?.sections.length
      if (allCompleted && showPostTest === false) {
        setShowPostQuiz(true)
      }  
    }, [allSectionsCompleted, completedSections])


  return (
    <div className="min-h-screen pt-24 pb-4 mb-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">

      <div className="container mx-auto max-w-7xl px-3">
        {/* Back Navigation */}
        <div className="mb-6">
          {(loading || isLoading) ? <Skeleton width={200} height={50} /> : <Link href="/learn/cervical-cancer">
            <Button variant="outline" className="hover-shadow-gradient bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Modules
            </Button>
          </Link>}
        </div>

        {!pretestCompleted ? (
          <FullScreenQuizDialog
            isOpen={showQuiz}
            onClose={() => setShowQuiz(false)}
            questions={pretestQuestions}
            mode = {"pretest"}
            onComplete={() => handleQuizComplete("pretest")}
          />
        ) : pretestCompleted && (allSectionsCompleted && !postTestCompleted) && (
          <FullScreenQuizDialog
            isOpen={showPostQuiz}
            onClose={() => setShowPostQuiz(false)}
            questions={postTestQuestions}
            mode={"posttest"}
            onComplete={() => handleQuizComplete("posttest")}
          />
        ) }

        


        {/* Module Progress Bar */}
        {/* <div className="mb-8">
          <InteractiveProgressBar
            modules={modules}
            currentModule={1}
            onModuleClick={handleModuleClick}
            showCertificate={true}
          />
        </div> */}

        {/* Module Header */}
        <Card className="mb-8 hover-shadow-gradient">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                {(loading || isLoading) ? <Skeleton width={500} height={100} /> : <CardTitle className="text-3xl">{lesson?.name}: {lesson?.title} </CardTitle>}
                {(loading || isLoading) ? <Skeleton width={700} /> : <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {lesson?.description}
                </p>}
              </div>
              <div className="text-right space-y-2">
                {allSectionsCompleted && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Module Complete
                  </Badge>
                )}
               
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Introductory Video */}
            <div className="mb-6">
              {(loading || isLoading) ? <Skeleton width={200} /> : <h4 className="font-semibold mb-3">Module Introduction</h4>}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                {(loading || isLoading || !lesson?.introVideo) ? (
                  <Skeleton width={700} height={500} />
                ) : (
                    <iframe
                      src={lesson.introVideo}
                      width="100%"
                      height="100%"
                      allow="autoplay"
                      allowFullScreen
                      className="rounded-lg w-full aspect-video"
                    />
                )}

                {/* <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  {(loading || isLoading) ? <Skeleton width={200} height={60} /> : <Button size="lg" className="gradient-orange-blue text-white">
                    <Play className="w-6 h-6 mr-2" />
                    Watch Introduction
                  </Button>}
                </div> */}
              </div>
            </div>

            {/* Section Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {(loading || isLoading) ? <Skeleton width={200} /> : <h4 className="font-semibold">Section Progress</h4>}
                {(loading || isLoading) ? <Skeleton width={150} /> : <span className="text-sm text-gray-600 dark:text-gray-400">
                  {completedSections} / {lesson?.sections.length} Complete
                </span>}
              </div>
              {(loading || isLoading) ? <Skeleton width={800} height={5} /> : <Progress value={lesson && (completedSections / lesson.sections.length) * 100} className="h-2 [&>div]:bg-orange-400 text-black" />}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-3">
              {(loading || isLoading) ? <Skeleton width={100} /> : <h4 className="font-semibold">Sections</h4>}

              {/* Section Pathline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-blue-500 opacity-30"></div>

                {lesson && lesson.sections.map((section, index) => (
                  <div key={section.order} className="relative flex items-start mb-4">
                    {/* Path Node */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        sectionCompleted(section.name)
                          ? "bg-green-500 text-white"
                          : sectionUnlocked(section.name)
                            ? "gradient-orange-blue text-white"
                            : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {(loading || isLoading) ? <Skeleton variant="circular" width={70} height={70} /> : sectionCompleted(section.name) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : sectionUnlocked(section.name) ? (
                        section.order
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}
                    </div>

                    {/* Section Tab */}
                    <div
                      className={`ml-3 flex-1 cursor-pointer transition-all duration-300 ${
                        sectionUnlocked(section.name) ? "hover:scale-105" : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => {sectionUnlocked(section.name) && setActiveSection(section.order);
                        //  console.log(completedSections)
                        
                      }}
                    >
                      <Card
                        className={`${
                          activeSection === section.order
                            ? "ring-2 ring-orange-500 shadow-lg"
                            : sectionUnlocked(section.name)
                              ? "hover-shadow-gradient"
                              : ""
                        }`}
                      >
                        <CardContent className="p-3">
                          {(loading || isLoading) ? <Skeleton width={400} height={90} /> : <h5 className="font-medium text-sm mb-1">{section.title}</h5>}
                          {(loading || isLoading) ? <Skeleton width={600} /> : <p className="text-xs text-gray-600 dark:text-gray-400">{section.description}</p>}
                          {sectionCompleted(section.name) && (
                            <Badge className="bg-green-100 text-green-800 text-xs mt-2">Complete</Badge>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Content */}
          <div className="lg:col-span-3 mb-10">
            {(loading || isLoading) ? <Skeleton width={800} height={600} /> : activeSectionData && (
              <SectionRenderer
                totalSections={lesson.sections.length}
                key={activeSection}
                section={activeSectionData}
                onComplete={(nextSection) => handleSectionComplete(activeSection, nextSection)}
                isUnlocked={sectionUnlocked(activeSectionData.name) || false}
              />
            )}
          </div>
        </div>

        {/* Module Completion */}
        {(allSectionsCompleted && postTestCompleted) && (
          
          <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <DialogTitle className="text-center text-2xl font-bold text-green-600">{lesson.name} Complete!</DialogTitle>
                <DialogDescription className="text-center text-gray-600 dark:text-gray-400 text wrap">
                  Congratulations! You've successfully completed the {lesson.title} module.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-center">
                <div className="flex justify-center space-x-4 gap-3 flex-wrap">
                  {lesson.order < totalModules  && 
                  <Button
                    onClick={() => router.push(`/learn/cervical-cancer/module-${lesson.order + 1}`)}
                    className="gradient-orange-blue text-white hover-shadow-gradient"
                  >
                    Continue to Next Module
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>}
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Review Module
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {allSectionsCompleted  && 
        // lesson.order < totalModules  &&
          <Card>
            <CardHeader className="text-sm text-gray-500">You've successfully completed the {lesson.title} module.</CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-4 gap-3 flex-wrap">
                {lesson.order < totalModules && <Button
                  onClick={() => router.push(`/learn/cervical-cancer/module-${lesson.order + 1}`)}
                  className="gradient-orange-blue text-white hover-shadow-gradient"
                >
                  Continue to Next Module
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>}
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Review Module
                </Button>
              </div>
            </CardContent>
          </Card>  
        }

        {/* Post Test Modal */}
        {/* <PostTestModal
          isOpen={showPostTest}
          onClose={() => setShowPostTest(false)}
          onPass={handlePostTestPass}
          moduleTitle="Introduction to Cervical Cancer"
          moduleId={1}
        /> */}
      </div>
    </div>
  )
}
