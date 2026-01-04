import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import {prisma} from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Default addOn to false (overwrite by default)
    const { addOn = false, ...fieldsToUpdate } = body

    let data: Record<string, any> = {}

    if (addOn) {
      // Merge array fields (e.g., completedSections) with existing user data
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })

      for (const key in fieldsToUpdate) {
        const incoming = fieldsToUpdate[key]
        const existing = user?.[key as keyof typeof user]

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

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data,
    })

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (err) {
    console.error("[USER_UPDATE_ERROR]", err)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
