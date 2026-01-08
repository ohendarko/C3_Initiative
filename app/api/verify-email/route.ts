// app/api/verify-email/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail } from "@/lib/email"
// import { sendWelcomeEmail } from "@/lib/email-test"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    console.log('[Verify Email] Token received:', token)

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      )
    }

    // Find user with this token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    })

    console.log('[Verify Email] User found:', user?.email)

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      console.log('[Verify Email] Already verified')
      return NextResponse.json(
        { message: "Email already verified", alreadyVerified: true },
        { status: 200 }
      )
    }

    // Check if token expired
    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      console.log('[Verify Email] Token expired')
      return NextResponse.json(
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 }
      )
    }

    // ✅ FIX: Use $unset to remove the fields instead of setting to null
    console.log('[Verify Email] Updating user...')
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: undefined,  // ✅ Changed from null to undefined
        verificationTokenExpiry: undefined,  // ✅ Changed from null to undefined
      },
    })

    console.log('[Verify Email] User updated successfully')

    // Send welcome email
    console.log('[Verify Email] Sending welcome email...')
    const emailResult = await sendWelcomeEmail(user.email, user.name)
    
    if (emailResult.success) {
      console.log('✅ Welcome email sent successfully')
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
    })
  } catch (error: any) {
    console.error("[Verify Email] Error:", error)
    console.error("Error code:", error?.code)
    console.error("Error message:", error?.message)
    
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    )
  }
}