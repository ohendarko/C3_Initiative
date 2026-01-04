"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, CheckCircle, Clock, Award, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

const modules = [
  {
    id: 1,
    title: "Introduction to Cervical Cancer",
    description: "Understanding the basics of cervical cancer, anatomy, and risk factors",
    duration: "45 min",
    progress: 100,
    status: "completed",
    lessons: 8,
  },
  {
    id: 2,
    title: "HPV and Cervical Cancer Connection",
    description: "Learn about Human Papillomavirus and its role in cervical cancer development",
    duration: "60 min",
    progress: 75,
    status: "in-progress",
    lessons: 10,
  },
  {
    id: 3,
    title: "Screening Methods and Guidelines",
    description: "Pap smears, HPV testing, and screening recommendations",
    duration: "50 min",
    progress: 0,
    status: "not-started",
    lessons: 9,
  },
  {
    id: 4,
    title: "Prevention Strategies",
    description: "Vaccination, lifestyle factors, and preventive measures",
    duration: "40 min",
    progress: 0,
    status: "not-started",
    lessons: 7,
  },
  {
    id: 5,
    title: "Treatment Options",
    description: "Surgical and non-surgical treatment approaches",
    duration: "55 min",
    progress: 0,
    status: "not-started",
    lessons: 11,
  },
  {
    id: 6,
    title: "Patient Communication",
    description: "Effective communication strategies for healthcare providers",
    duration: "35 min",
    progress: 0,
    status: "not-started",
    lessons: 6,
  },
]

const stats = [
  { label: "Modules Completed", value: "1/6", icon: BookOpen, color: "text-orange-500" },
  { label: "Total Study Time", value: "45 min", icon: Clock, color: "text-blue-500" },
  { label: "Current Streak", value: "3 days", icon: TrendingUp, color: "text-pink-500" },
  { label: "Certificates Earned", value: "0", icon: Award, color: "text-purple-500" },
]

export default function DashboardPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">In Progress</Badge>
      default:
        return <Badge variant="secondary">Not Started</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "in-progress":
        return <Play className="w-5 h-5 text-blue-500" />
      default:
        return <BookOpen className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back to the{" "}
            <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              C3 Initiative
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Continue your cervical cancer education journey. You're making a difference!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-shadow-gradient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Progress */}
        <Card className="mb-8 hover-shadow-gradient">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>Your Learning Progress</span>
            </CardTitle>
            <CardDescription>You've completed 1 out of 6 modules. Keep up the great work!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>17% Complete</span>
              </div>
              <Progress value={17} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>1 module completed</span>
                <span>5 modules remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Learning Modules</h2>
            <Button variant="outline" className="hover-shadow-gradient bg-transparent">
              <Users className="w-4 h-4 mr-2" />
              Study Group
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Card key={module.id} className="hover-shadow-gradient group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(module.status)}
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription className="mt-1">{module.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(module.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {module.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        {module.lessons} lessons • {module.duration}
                      </span>
                      <div className="flex space-x-2">
                        {module.status === "completed" && (
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        )}
                        <Link href={`/modules/${module.id}`}>
                          <Button
                            size="sm"
                            className={
                              module.status === "in-progress"
                                ? "gradient-blue-pink text-white"
                                : module.status === "completed"
                                  ? "gradient-orange-pink text-white"
                                  : "gradient-orange-blue text-white"
                            }
                          >
                            {module.status === "completed"
                              ? "Review"
                              : module.status === "in-progress"
                                ? "Continue"
                                : "Start"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 hover-shadow-gradient">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Shortcuts to help you continue your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="gradient-orange-blue text-white hover-shadow-gradient h-auto p-4 flex flex-col items-center space-y-2">
                <Play className="w-6 h-6" />
                <span>Resume Current Module</span>
              </Button>
              <Button
                variant="outline"
                className="hover-shadow-gradient h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <BookOpen className="w-6 h-6" />
                <span>Browse All Modules</span>
              </Button>
              <Button
                variant="outline"
                className="hover-shadow-gradient h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Award className="w-6 h-6" />
                <span>View Certificates</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
