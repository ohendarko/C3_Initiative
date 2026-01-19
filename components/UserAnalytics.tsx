'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Loader2, Users, BookOpen, FileText, TrendingUp, Download, 
  ArrowLeft, Award, Clock, Target, Activity, Filter 
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts'

type AnalyticsData = {
  stats: {
    totalUsers: number
    totalProgress: number
    totalQuestionnaires: number
    avgImprovement: number
    moduleStats: Array<{
      moduleId: string // "module-6"
      moduleName: string // "Module 5"
      moduleTitle: string // "Diagnosis and Staging of Cervical Cancer"
      moduleShortTitle: string // "Diagnosis"
      totalAttempts: number
      completedCount: number
      avgPretestScore: number
      avgPosttestScore: number
    }>
    userPerformance: Array<{
      id: string
      userEmail: string
      userName: string
      moduleId: string
      moduleName: string
      moduleTitle: string
      pretestScore: number | null
      posttestScore: number | null
      improvement: number | null
      completed: boolean
      lastUpdated: string
    }>
  }
  questionnaires: Array<{
    id: string
    userEmail: string
    userName: string
    age: string
    gender: string
    relationshipStatus: string
    religion: string
    programOfStudy: string
    yearOfStudy: string
    sexuallyActive: string
    familyHistoryCancer: string
    cervicalCancerEducation: string
    papSmearTest: string
    hpvVaccine: string
    createdAt: string
  }>
   modules: Array<{
    moduleId: string
    name: string
    title: string
    shortTitle: string
  }>
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']


interface AnalyticsDashboardProps {
  onBack: () => void
}

export default function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/analytics')
      if (!res.ok) throw new Error('Failed to fetch analytics')
      const responseData = await res.json()
      setData(responseData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!data) return

    const csvData = [
      ['=== USER PERFORMANCE ==='],
      ['User Email', 'User Name', 'Module', 'Pretest', 'Posttest', 'Improvement', 'Completed', 'Last Updated'],
      ...data.stats.userPerformance.map(p => [
        p.userEmail, p.userName, p.moduleId,
        p.pretestScore?.toString() || '', 
        p.posttestScore?.toString() || '',
        p.improvement?.toString() || '',
        p.completed.toString(),
        p.lastUpdated
      ]),
      [''],
      ['=== QUESTIONNAIRE DATA ==='],
      ['Email', 'Name', 'Age', 'Gender', 'Relationship', 'Religion', 'Program', 'Year', 
       'Sexually Active', 'Family History Cancer', 'Prior Education', 'Had Pap Smear', 'HPV Vaccine', 'Date'],
      ...data.questionnaires.map(q => [
        q.userEmail, q.userName, q.age, q.gender, q.relationshipStatus, q.religion,
        q.programOfStudy, q.yearOfStudy, q.sexuallyActive, q.familyHistoryCancer,
        q.cervicalCancerEducation, q.papSmearTest, q.hpvVaccine,
        new Date(q.createdAt).toLocaleDateString()
      ])
    ]

    const csv = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `c3_analytics_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Calculate demographic insights
  const getDemographics = () => {
    if (!data?.questionnaires.length) return null

    const total = data.questionnaires.length
    
    return {
      genderDistribution: Object.entries(
        data.questionnaires.reduce((acc, q) => {
          acc[q.gender] = (acc[q.gender] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({ name, value, percentage: ((value / total) * 100).toFixed(1) })),

      ageDistribution: Object.entries(
        data.questionnaires.reduce((acc, q) => {
          acc[q.age] = (acc[q.age] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({ name, value, percentage: ((value / total) * 100).toFixed(1) })),

      yearDistribution: Object.entries(
        data.questionnaires.reduce((acc, q) => {
          acc[q.yearOfStudy] = (acc[q.yearOfStudy] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({ name, value })),

      priorEducation: {
        yes: data.questionnaires.filter(q => q.cervicalCancerEducation === 'Yes').length,
        no: data.questionnaires.filter(q => q.cervicalCancerEducation === 'No').length,
      },

      screening: {
        hadPapSmear: data.questionnaires.filter(q => q.papSmearTest === 'Yes').length,
        noPapSmear: data.questionnaires.filter(q => q.papSmearTest === 'No').length,
      },

      vaccination: {
        vaccinated: data.questionnaires.filter(q => q.hpvVaccine === 'Yes').length,
        notVaccinated: data.questionnaires.filter(q => q.hpvVaccine === 'No').length,
      },

      sexuallyActive: {
        yes: data.questionnaires.filter(q => q.sexuallyActive === 'Yes').length,
        no: data.questionnaires.filter(q => q.sexuallyActive === 'No').length,
      },

      familyHistory: {
        yes: data.questionnaires.filter(q => q.familyHistoryCancer === 'Yes').length,
        no: data.questionnaires.filter(q => q.familyHistoryCancer === 'No').length,
      }
    }
  }

  // Calculate learning outcomes
  const getLearningOutcomes = () => {
    if (!data?.stats.moduleStats.length) return null

    const totalImprovement = data.stats.userPerformance
      .filter(p => p.improvement !== null)
      .reduce((sum, p) => sum + (p.improvement || 0), 0)

    const avgImprovement = totalImprovement / data.stats.userPerformance.filter(p => p.improvement !== null).length || 0

    const completionRate = (
      (data.stats.moduleStats.reduce((sum, m) => sum + m.completedCount, 0) /
      data.stats.moduleStats.reduce((sum, m) => sum + m.totalAttempts, 0)) * 100
    ).toFixed(1)

    const topPerformers = [...data.stats.userPerformance]
      .filter(p => p.improvement !== null)
      .sort((a, b) => (b.improvement || 0) - (a.improvement || 0))
      .slice(0, 5)

    return {
      avgImprovement: avgImprovement.toFixed(1),
      completionRate,
      topPerformers,
      strugglingModules: [...data.stats.moduleStats]
        .sort((a, b) => a.avgPosttestScore - b.avgPosttestScore)
        .slice(0, 3)
    }
  }

  const demographics = getDemographics()
  const outcomes = getLearningOutcomes()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 mb-2">Error Loading Analytics</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchAnalytics} className="gradient-orange-blue text-white">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 pt-24">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-pink-800 bg-clip-text text-transparent">
              C3 Initiative Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive learning outcomes & demographic insights
            </p>
          </div>

          <Button onClick={exportToCSV} className="gradient-orange-blue text-white gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
              <Users className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.stats.totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">
                {data.stats.totalQuestionnaires} completed intake forms
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Module Enrollments</CardTitle>
              <BookOpen className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.stats.totalProgress}</div>
              <p className="text-xs text-gray-500 mt-1">
                Across 7 learning modules
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                +{outcomes?.avgImprovement || 0}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pre-test to post-test gains
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Award className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {outcomes?.completionRate || 0}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Modules finished vs started
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Different Views */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="performance">Learning Outcomes</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="modules">Module Details</TabsTrigger>
            <TabsTrigger value="users">User Data</TabsTrigger>
          </TabsList>

          {/* LEARNING OUTCOMES TAB */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module Performance Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-500" />
                    Pre-Test vs Post-Test Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data.stats.moduleStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="moduleId" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgPretestScore" fill="#f97316" name="Pre-test" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="avgPosttestScore" fill="#3b82f6" name="Post-test" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Learning Gains */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Average Score Improvement by Module
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data.stats.moduleStats.map(m => ({
                      ...m,
                      improvement: m.avgPosttestScore - m.avgPretestScore
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="moduleId" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="improvement" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Module Completion Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Module Engagement & Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.stats.moduleStats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="moduleId" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalAttempts" fill="#8b5cf6" name="Started" />
                    <Bar dataKey="completedCount" fill="#10b981" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Top Performing Learners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {outcomes?.topPerformers.map((performer, index) => (
                    <div key={performer.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950 dark:to-blue-950 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{performer.userName}</p>
                          <p className="text-sm text-gray-600">{performer.userEmail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          +{performer.improvement}%
                        </p>
                        <p className="text-xs text-gray-500">{performer.moduleId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DEMOGRAPHICS TAB */}
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={demographics?.genderDistribution || []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.name} (${entry.percentage}%)`}
                      >
                        {demographics?.genderDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Age Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={demographics?.ageDistribution || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Year of Study */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Year Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={demographics?.yearDistribution || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Health Behaviors Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Behaviors & Knowledge</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={[
                      { subject: 'Prior Education', value: demographics?.priorEducation.yes || 0, fullMark: data.stats.totalQuestionnaires },
                      { subject: 'Had Pap Smear', value: demographics?.screening.hadPapSmear || 0, fullMark: data.stats.totalQuestionnaires },
                      { subject: 'HPV Vaccine', value: demographics?.vaccination.vaccinated || 0, fullMark: data.stats.totalQuestionnaires },
                      { subject: 'Sexually Active', value: demographics?.sexuallyActive.yes || 0, fullMark: data.stats.totalQuestionnaires },
                      { subject: 'Family History', value: demographics?.familyHistory.yes || 0, fullMark: data.stats.totalQuestionnaires },
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis />
                      <Radar name="Participants" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Health Knowledge Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Prior Cervical Cancer Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">Yes</span>
                      <span className="text-2xl font-bold">{demographics?.priorEducation.yes || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">No</span>
                      <span className="text-2xl font-bold">{demographics?.priorEducation.no || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Pap Smear Screening History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">Yes</span>
                      <span className="text-2xl font-bold">{demographics?.screening.hadPapSmear || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">No</span>
                      <span className="text-2xl font-bold">{demographics?.screening.noPapSmear || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">HPV Vaccination Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">Vaccinated</span>
                      <span className="text-2xl font-bold">{demographics?.vaccination.vaccinated || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Not Vaccinated</span>
                      <span className="text-2xl font-bold">{demographics?.vaccination.notVaccinated || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MODULE DETAILS TAB */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.stats.moduleStats.map((module, index) => (
                <Card key={module.moduleId} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex flex-col items-center justify-between">
                      <span className="text-lg">{module.moduleName}</span>
                      <span className="text-lg">{module.moduleTitle}</span>
                      {/* <BookOpen className="h-5 w-5 text-orange-500" /> */}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Attempts</p>
                        <p className="text-2xl font-bold">{module.totalAttempts}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{module.completedCount}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pre-test Avg</span>
                        <span className="font-semibold text-orange-600">{module.avgPretestScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Post-test Avg</span>
                        <span className="font-semibold text-blue-600">{module.avgPosttestScore}%</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-semibold">Improvement</span>
                        <span className="font-bold text-green-600">
                          +{(module.avgPosttestScore - module.avgPretestScore).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span>{((module.completedCount / module.totalAttempts) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(module.completedCount / module.totalAttempts) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Modules Needing Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  Modules Needing Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {outcomes?.strugglingModules.map((module, index) => (
                    <div key={module.moduleId} className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{module.moduleName}</p>
                          <p className="text-sm text-gray-600">Post-test average: {module.avgPosttestScore}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Completion</p>
                          <p className="font-bold">{((module.completedCount / module.totalAttempts) * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* USER DATA TAB */}
          <TabsContent value="users" className="space-y-6">
            {/* User Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Individual Learner Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 font-semibold">Learner</th>
                        <th className="text-left p-3 font-semibold">Module</th>
                        <th className="text-center p-3 font-semibold">Pre-test</th>
                        <th className="text-center p-3 font-semibold">Post-test</th>
                        <th className="text-center p-3 font-semibold">Gain</th>
                        <th className="text-center p-3 font-semibold">Status</th>
                        <th className="text-center p-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.stats.userPerformance.map((p, i) => (
                        <tr key={p.id} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{p.userName}</div>
                              <div className="text-xs text-gray-500">{p.userEmail}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded">
                              {p.moduleId}
                            </span>
                          </td>
                          <td className="text-center p-3">
                            <span className="font-semibold">{p.pretestScore ?? '-'}</span>
                          </td>
                          <td className="text-center p-3">
                            <span className="font-semibold">{p.posttestScore ?? '-'}</span>
                          </td>
                          <td className="text-center p-3">
                            {p.improvement !== null ? (
                              <span className={`font-bold ${p.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {p.improvement > 0 ? '+' : ''}{p.improvement}%
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="text-center p-3">
                            {p.completed ? (
                              <span className="inline-flex items-center gap-1 text-green-600">
                                <Award className="h-4 w-4" />
                                Complete
                              </span>
                            ) : (
                              <span className="text-gray-500">In Progress</span>
                            )}
                          </td>
                          <td className="text-center p-3 text-xs text-gray-500">
                            {new Date(p.lastUpdated).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Questionnaire Responses */}
            <Card>
              <CardHeader>
                <CardTitle>Participant Demographics (Decrypted)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 font-semibold">Participant</th>
                        <th className="text-left p-3 font-semibold">Age</th>
                        <th className="text-left p-3 font-semibold">Gender</th>
                        <th className="text-left p-3 font-semibold">Program</th>
                        <th className="text-left p-3 font-semibold">Year</th>
                        <th className="text-center p-3 font-semibold">Prior Ed</th>
                        <th className="text-center p-3 font-semibold">Pap Test</th>
                        <th className="text-center p-3 font-semibold">HPV Vax</th>
                        <th className="text-center p-3 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.questionnaires.map((q, i) => (
                        <tr key={q.id} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{q.userName}</div>
                              <div className="text-xs text-gray-500">{q.userEmail}</div>
                            </div>
                          </td>
                          <td className="p-3">{q.age}</td>
                          <td className="p-3">{q.gender}</td>
                          <td className="p-3 max-w-xs truncate">{q.programOfStudy}</td>
                          <td className="p-3">{q.yearOfStudy}</td>
                          <td className="text-center p-3">
                            <span className={`inline-block w-2 h-2 rounded-full ${q.cervicalCancerEducation === 'Yes' ? 'bg-green-500' : 'bg-red-500'}`} />
                          </td>
                          <td className="text-center p-3">
                            <span className={`inline-block w-2 h-2 rounded-full ${q.papSmearTest === 'Yes' ? 'bg-green-500' : 'bg-red-500'}`} />
                          </td>
                          <td className="text-center p-3">
                            <span className={`inline-block w-2 h-2 rounded-full ${q.hpvVaccine === 'Yes' ? 'bg-green-500' : 'bg-red-500'}`} />
                          </td>
                          <td className="text-center p-3 text-xs text-gray-500">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}