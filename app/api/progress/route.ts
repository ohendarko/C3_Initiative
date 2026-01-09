// app/api/progress/route.ts

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ✅ Get data from request
    const { moduleId, mode, score, totalQuestions, questionResults } = await req.json()

    console.log('[Progress] Saving:', { 
      email: session.user.email, 
      moduleId, 
      mode, 
      score,
      totalQuestions 
    })

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find or create progress record
    let progress = await prisma.userProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        },
      },
    })

    if (mode === "pretest") {
      // ✅ Save pretest data
      if (progress) {
        progress = await prisma.userProgress.update({
          where: { id: progress.id },
          data: {
            pretestScore: score,
            pretestAnswers: questionResults,  // ✅ Save question details
            totalQuestions
          },
        })
      } else {
        progress = await prisma.userProgress.create({
          data: {
            userId: user.id,
            moduleId: moduleId,
            pretestScore: score,
            pretestAnswers: questionResults,  // ✅ Save question details
            totalQuestions
          },
        })
      }

      console.log('[Progress] ✅ Pretest saved')
      return NextResponse.json({ success: true, progress })
    }

    if (mode === "posttest") {
      // ✅ Save posttest data
      if (!progress) {
        return NextResponse.json(
          { error: "Must complete pretest first" },
          { status: 400 }
        )
      }

      progress = await prisma.userProgress.update({
        where: { id: progress.id },
        data: {
          posttestScore: score,
          posttestAnswers: questionResults,  // ✅ Save question details
          completed: true,
        },
      })

      console.log('[Progress] ✅ Posttest saved, module completed')
      return NextResponse.json({ success: true, progress })
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 })
  } catch (error: any) {
    console.error("[Progress] Error:", error)
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    )
  }
}