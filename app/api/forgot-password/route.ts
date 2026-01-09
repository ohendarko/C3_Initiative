// app/api/forgot-password/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import { generateVerificationToken, getTokenExpiry } from "@/lib/verification"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    console.log('[Forgot Password] Request for:', email)

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Always return success even if user not found (security best practice)
    // This prevents email enumeration attacks
    if (!user) {
      console.log('[Forgot Password] User not found, returning failure')
      return NextResponse.json({
        success: false,
        message: "This account is absent in out records. Please create an account with this email",
      })
    }

    // Check if user has a password (might be OAuth only)
    if (!user.password) {
      console.log('[Forgot Password] User has no password (OAuth only)')
      // return NextResponse.json({
      //   success: true,
      //   message: "If an account exists with this email, you will receive a password reset link.",
      // })
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = generateVerificationToken()
    const resetTokenExpiry = new Date()
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1)  // 1 hour expiry

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    console.log('[Forgot Password] Token generated and saved')

    // Send email
    const emailResult = await sendPasswordResetEmail(
      email,
      user.name,
      resetToken
    )

    if (!emailResult.success) {
      console.error('[Forgot Password] Failed to send email')
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again." },
        { status: 500 }
      )
    }

    console.log('[Forgot Password] ✅ Reset email sent')

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    })
  } catch (error: any) {
    console.error("[Forgot Password] Error:", error)
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    )
  }
}