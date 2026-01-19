// app/api/admin/analytics/route.ts

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('[Analytics] Fetching data...')

    // ✅ 1. Get module summaries first
    const moduleSummaries = await prisma.moduleSummary.findMany({
      orderBy: { order: 'asc' } // Sort by order field
    })

    // Create a map for easy lookup: module -> title
    const moduleNameMap = moduleSummaries
      .filter(mod => mod.module !== null) // Filter out nulls
      .reduce((acc, mod) => {
        acc[mod.module!] = { // Use non-null assertion since we filtered
          title: mod.title || '',
          name: mod.name || '',
          shortTitle: mod.shortTitle || ''
        }
        return acc
      }, {} as Record<string, { title: string; name: string; shortTitle: string }>)


    // ✅ 2. Get all user progress with user details
    const allProgress = await prisma.userProgress.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    // ✅ 3. Get all questionnaires
    const allQuestionnaires = await prisma.questionnaire.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedQuestionnaires = allQuestionnaires.map(q => ({
      id: q.id,
      userId: q.user.id,
      userEmail: q.user.email,
      userName: q.user.name,
      age: q.age || 'N/A',
      gender: q.gender || 'N/A',
      relationshipStatus: q.relationshipStatus || 'N/A',
      relationshipOther: q.relationshipOther || 'N/A',
      religion: q.religion || 'N/A',
      religionOther: q.religionOther || 'N/A',
      programOfStudy: q.programOfStudy || 'N/A',
      yearOfStudy: q.yearOfStudy || 'N/A',
      sexuallyActive: q.sexuallyActive || 'N/A',
      familyHistoryCancer: q.familyHistoryCancer || 'N/A',
      cancerType: q.cancerType || 'N/A',
      cervicalCancerEducation: q.cervicalCancerEducation || 'N/A',
      papSmearTest: q.papSmearTest || 'N/A',
      hpvVaccine: q.hpvVaccine || 'N/A',
      createdAt: q.createdAt.toISOString(),
    }))

    // ✅ 4. Calculate module statistics with REAL names
    const moduleStats = moduleSummaries.map(mod => {
      const moduleProgress = allProgress.filter(p => p.moduleId === mod.module)
      
      const pretestScores = moduleProgress
        .map(p => p.pretestScore)
        .filter((score): score is number => score !== null)
      
      const posttestScores = moduleProgress
        .map(p => p.posttestScore)
        .filter((score): score is number => score !== null)
      
      return {
        moduleId: mod.module, // e.g., "module-6"
        moduleName: mod.name, // e.g., "Module 5"
        moduleTitle: mod.title, // e.g., "Diagnosis and Staging of Cervical Cancer"
        moduleShortTitle: mod.shortTitle, // e.g., "Diagnosis"
        totalAttempts: moduleProgress.length,
        completedCount: moduleProgress.filter(p => p.completed).length,
        avgPretestScore: pretestScores.length > 0
          ? Math.round((pretestScores.reduce((a, b) => a + b, 0) / pretestScores.length) * 10) / 10
          : 0,
        avgPosttestScore: posttestScores.length > 0
          ? Math.round((posttestScores.reduce((a, b) => a + b, 0) / posttestScores.length) * 10) / 10
          : 0,
      }
    })

    // ✅ 5. User performance details
    const userPerformance = allProgress.map(p => ({
      id: p.id,
      userId: p.user.id,
      userEmail: p.user.email,
      userName: p.user.name,
      moduleId: p.moduleId,
      moduleName: moduleNameMap[p.moduleId]?.name || p.moduleId,
      moduleTitle: moduleNameMap[p.moduleId]?.title || p.moduleId,
      pretestScore: p.pretestScore,
      posttestScore: p.posttestScore,
      improvement: p.posttestScore !== null && p.pretestScore !== null
        ? p.posttestScore - p.pretestScore
        : null,
      completed: p.completed,
      createdAt: p.createdAt.toISOString(),
      lastUpdated: p.updatedAt.toISOString(),
    }))

    // ✅ 6. Calculate overall statistics
    const allImprovements = userPerformance
      .map(p => p.improvement)
      .filter((imp): imp is number => imp !== null)

    const avgImprovement = allImprovements.length > 0
      ? Math.round((allImprovements.reduce((a, b) => a + b, 0) / allImprovements.length) * 10) / 10
      : 0

    const stats = {
      totalUsers: await prisma.user.count(),
      totalProgress: allProgress.length,
      totalQuestionnaires: allQuestionnaires.length,
      avgImprovement,
      moduleStats,
      userPerformance,
    }

    console.log('[Analytics] ✅ Data fetched successfully')

    return NextResponse.json({
      success: true,
      stats,
      questionnaires: formattedQuestionnaires,
      modules: moduleSummaries.map(m => ({
        moduleId: m.module,
        name: m.name,
        title: m.title,
        shortTitle: m.shortTitle,
      })),
    })

  } catch (error: any) {
    console.error('[Analytics] Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch analytics", 
        details: error.message 
      },
      { status: 500 }
    )
  }
}