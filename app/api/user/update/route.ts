// app/api/user/update/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()

    // ✅ Extract totalModules (for certificate date logic)
    const { addOn = false, totalModules, ...fieldsToUpdate } = body

    let data: Record<string, any> = {}

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (addOn) {
      // Merge array fields with existing user data
      for (const key in fieldsToUpdate) {
        const incoming = fieldsToUpdate[key]
        const existing = user[key as keyof typeof user]

        if (Array.isArray(incoming) && Array.isArray(existing)) {
          data[key] = Array.from(new Set([...existing, ...incoming]))
        } else {
          data[key] = incoming
        }
      }
    } else {
      // Direct overwrite for all fields
      data = fieldsToUpdate
    }

    // ✅ Check if all modules are now completed
    let finalCompletedModules = data.completedModules || user.completedModules || []
    
    if (addOn && fieldsToUpdate.completedModules) {
      // If we're adding modules, recalculate the final count
      const existing = user.completedModules || []
      const incoming = fieldsToUpdate.completedModules
      finalCompletedModules = Array.from(new Set([...existing, ...incoming]))
    }

    // ✅ Set certificate date if all modules completed and date not already set
    if (
      totalModules && 
      finalCompletedModules.length === totalModules && 
      !user.certificateIssueDate
    ) {
      data.certificateIssueDate = new Date()
      console.log('[User Update] ✅ All modules completed! Setting certificate date.')
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data,
    })

    console.log('[User Update] ✅ User updated:', {
      email: session.user.email,
      completedModules: updatedUser.completedModules.length,
      certificateIssued: !!updatedUser.certificateIssueDate,
    })

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (err) {
    console.error("[USER_UPDATE_ERROR]", err)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}