"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, CheckCircle, Award } from "lucide-react"

const modules = [
  {
    "order": 1,
    "name": "Module 1",
    "module": "module-1",
    "title": "Why Focus On Cervical Cancer",
    "shortTitle": "Introduction",
    "description": "Learn the global, regional, and local impact of cervical cancer and why it matters.",
    "completed": false,
    "unlocked": true,
    "icon": "BookOpen",
    "introVideo": "https://cdn.example.com/module-6-intro.mp4",
    "lessons": 7
  },
  {
    "order": 2,
    "name": "Module 2: Part 1",
    "module": "module-2",
    "title": "Cervical Cancer: An Overview",
    "shortTitle": "Cervical Cancer 1",
    "description": "Understand what cervical cancer is, how HPV causes it, and the disease's progression.",
    "completed": false,
    "unlocked": true,
    "icon": "Microscope",
    "introVideo": "https://cdn.example.com/module-6-intro.mp4",
    "lessons": 7
  },
  {
    "order": 3,
    "name": "Module 2: Part 2",
    "module": "module-3",
    "title": "Cervical Cancer: An Overview 2",
    "shortTitle": "Cervical Cancer 2",
    "description": "Understand how HPV causes cervical cancer, and the disease's progression.",
    "completed": false,
    "unlocked": true,
    "icon": "Microscope",
    "introVideo": "https://cdn.example.com/module-6-intro.mp4",
    "lessons": 7
  },
  {
    "order": 4,
    "name": "Module 3",
    "module": "module-4",
    "title": "Risk Factors, Signs, Symptoms and Screening Tests For Cervical Cancer",
    "shortTitle": "Etiology",
    "description": "Explore risk factors, symptoms, and screening options for early detection of cervical cancer.",
    "completed": false,
    "unlocked": true,
    "icon": "Search",
    "introVideo": "https://cdn.example.com/module-6-intro.mp4",
    "lessons": 7
  },
  {
    "order": 5,
    "name": "Module 4",
    "module": "module-5",
    "title": "HPV Vaccination",
    "shortTitle": "Vaccination",
    "description": "Learn how HPV vaccination prevents cervical cancer and understand vaccination schedules.",
    "completed": false,
    "unlocked": true,
    "icon": "Shield",
    "introVideo": "https://cdn.example.com/module-6-intro.mp4",
    "lessons": 7
  },
  {
    "order": 6,
    "name": "Module 5",
    "module": "module-6",
    "title": "Diagnosis and Staging of Cervical Cancer",
    "shortTitle": "Diagnosis",
    "description": "Discover how cervical cancer is diagnosed and staged to guide effective treatment planning.",
    "completed": false,
    "unlocked": true,
    "icon": "Stethoscope",
    "introVideo": "https://cdn.example.com/module-6-intro.mp4",
    "lessons": 7
  },
  {
    "order": 7,
    "name": "Module 6",
    "module": "module-7",
    "title": "Treatment and Palliative Care",
    "shortTitle": "Treatment",
    "description": "Understand the main treatment options and supportive palliative care for advanced cervical cancer.",
    "completed": false,
    "unlocked": true,
    "icon": "Users",
    "introVideo": "https://cdn.example.com/module-6-intro.mp4",
    "lessons": 7
  }
]


const stats = [
  { label: "Modules", value: "7", icon: BookOpen, color: "text-orange-500" },
  { label: "Certificates Attainable", value: "1", icon: Award, color: "text-purple-500" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Modules Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your cervical cancer education journey overview. You're making a difference!
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


        {/* Modules Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Learning Modules</h2>

          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Card key={module.order} className="hover-shadow-gradient group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {/* {getStatusIcon(module.status)} */}
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription className="mt-1">{module.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
