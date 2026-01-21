// app/api/admin/analytics/route.ts

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"

// ✅ Type for question answers
type QuestionAnswer = {
  questionIndex: number
  question: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('[Analytics] Fetching data...')

    // ✅ 1. Get module summaries
    const moduleSummaries = await prisma.moduleSummary.findMany({
      orderBy: { order: 'asc' }
    })

    const moduleNameMap = moduleSummaries
      .filter(mod => mod.module !== null)
      .reduce((acc, mod) => {
        acc[mod.module!] = {
          title: mod.title || '',
          name: mod.name || '',
          shortTitle: mod.shortTitle || ''
        }
        return acc
      }, {} as Record<string, { title: string; name: string; shortTitle: string }>)

    // ✅ 2. Get all user progress
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

    // ✅ 3. Process question-level data
    const questionAnalytics = new Map<string, {
      moduleId: string
      question: string
      correctAnswer: string
      totalAttempts: number
      correctCount: number
      wrongAnswers: Map<string, number> // Track each wrong answer and its frequency
    }>()

    // Aggregate all question attempts
    allProgress.forEach(progress => {
      // Process pretest answers
      if (progress.pretestAnswers) {
        const answers = progress.pretestAnswers as QuestionAnswer[]
        answers.forEach(answer => {
          const key = `${progress.moduleId}-pretest-${answer.questionIndex}`
          
          if (!questionAnalytics.has(key)) {
            questionAnalytics.set(key, {
              moduleId: progress.moduleId,
              question: answer.question,
              correctAnswer: answer.correctAnswer,
              totalAttempts: 0,
              correctCount: 0,
              wrongAnswers: new Map()
            })
          }
          
          const qa = questionAnalytics.get(key)!
          qa.totalAttempts++
          
          if (answer.isCorrect) {
            qa.correctCount++
          } else {
            // Track this specific wrong answer
            const wrongCount = qa.wrongAnswers.get(answer.selectedAnswer) || 0
            qa.wrongAnswers.set(answer.selectedAnswer, wrongCount + 1)
          }
        })
      }

      // Process posttest answers
      if (progress.posttestAnswers) {
        const answers = progress.posttestAnswers as QuestionAnswer[]
        answers.forEach(answer => {
          const key = `${progress.moduleId}-posttest-${answer.questionIndex}`
          
          if (!questionAnalytics.has(key)) {
            questionAnalytics.set(key, {
              moduleId: progress.moduleId,
              question: answer.question,
              correctAnswer: answer.correctAnswer,
              totalAttempts: 0,
              correctCount: 0,
              wrongAnswers: new Map()
            })
          }
          
          const qa = questionAnalytics.get(key)!
          qa.totalAttempts++
          
          if (answer.isCorrect) {
            qa.correctCount++
          } else {
            const wrongCount = qa.wrongAnswers.get(answer.selectedAnswer) || 0
            qa.wrongAnswers.set(answer.selectedAnswer, wrongCount + 1)
          }
        })
      }
    })

    // Convert to array format
    const questionStats = Array.from(questionAnalytics.entries()).map(([key, data]) => ({
      key,
      moduleId: data.moduleId,
      moduleName: moduleNameMap[data.moduleId]?.name || data.moduleId,
      testType: key.includes('pretest') ? 'pretest' : 'posttest',
      questionIndex: parseInt(key.split('-').pop() || '0'),
      question: data.question,
      correctAnswer: data.correctAnswer,
      totalAttempts: data.totalAttempts,
      correctCount: data.correctCount,
      successRate: data.totalAttempts > 0 
        ? Math.round((data.correctCount / data.totalAttempts) * 100 * 10) / 10
        : 0,
      wrongAnswers: Array.from(data.wrongAnswers.entries()).map(([answer, count]) => ({
        answer,
        count,
        percentage: Math.round((count / data.totalAttempts) * 100 * 10) / 10
      })).sort((a, b) => b.count - a.count) // Sort by frequency
    }))

    // ✅ 4. Calculate module statistics with PERCENTAGES
    const moduleStats = moduleSummaries
      .filter(mod => mod.module !== null)
      .map(mod => {
        const moduleProgress = allProgress.filter(p => p.moduleId === mod.module)
        
        const pretestPercentages = moduleProgress
          .filter(p => p.pretestScore !== null && p.totalQuestions && p.totalQuestions > 0)
          .map(p => (p.pretestScore! / p.totalQuestions!) * 100)
        
        const posttestPercentages = moduleProgress
          .filter(p => p.posttestScore !== null && p.totalQuestions && p.totalQuestions > 0)
          .map(p => (p.posttestScore! / p.totalQuestions!) * 100)
        
        return {
          moduleId: mod.module!,
          moduleName: mod.name || 'Unknown Module',
          moduleTitle: mod.title || 'Unknown Title',
          moduleShortTitle: mod.shortTitle || 'Unknown',
          totalAttempts: moduleProgress.length,
          completedCount: moduleProgress.filter(p => p.completed).length,
          avgPretestScore: pretestPercentages.length > 0
            ? Math.round((pretestPercentages.reduce((a, b) => a + b, 0) / pretestPercentages.length) * 10) / 10
            : 0,
          avgPosttestScore: posttestPercentages.length > 0
            ? Math.round((posttestPercentages.reduce((a, b) => a + b, 0) / posttestPercentages.length) * 10) / 10
            : 0,
        }
      })

    // ✅ 5. User performance WITH PERCENTAGES and question details
    const userPerformance = allProgress.map(p => {
      const pretestPercentage = p.pretestScore !== null && p.totalQuestions && p.totalQuestions > 0
        ? Math.round((p.pretestScore / p.totalQuestions) * 100 * 10) / 10
        : null
      
      const posttestPercentage = p.posttestScore !== null && p.totalQuestions && p.totalQuestions > 0
        ? Math.round((p.posttestScore / p.totalQuestions) * 100 * 10) / 10
        : null
      
      const improvement = pretestPercentage !== null && posttestPercentage !== null
        ? Math.round((posttestPercentage - pretestPercentage) * 10) / 10
        : null

      return {
        id: p.id,
        userId: p.user.id,
        userEmail: p.user.email,
        userName: p.user.name,
        moduleId: p.moduleId,
        moduleName: moduleNameMap[p.moduleId]?.name || p.moduleId,
        moduleTitle: moduleNameMap[p.moduleId]?.title || p.moduleId,
        pretestScore: p.pretestScore,
        posttestScore: p.posttestScore,
        totalQuestions: p.totalQuestions,
        pretestPercentage,
        posttestPercentage,
        improvement,
        completed: p.completed,
        createdAt: p.createdAt.toISOString(),
        lastUpdated: p.updatedAt.toISOString(),
        // ✅ Include full question details
        pretestAnswers: p.pretestAnswers as QuestionAnswer[] | null,
        posttestAnswers: p.posttestAnswers as QuestionAnswer[] | null,
      }
    })

    // ✅ 6. Get questionnaires
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

    // ✅ 7. Calculate overall statistics
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
      questionStats, // ✅ NEW: Detailed question analytics
    }

    console.log('[Analytics] ✅ Data fetched successfully')

    return NextResponse.json({
      success: true,
      stats,
      questionnaires: formattedQuestionnaires,
      modules: moduleSummaries
        .filter(m => m.module !== null)
        .map(m => ({
          moduleId: m.module!,
          name: m.name || 'Unknown',
          title: m.title || 'Unknown',
          shortTitle: m.shortTitle || 'Unknown',
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