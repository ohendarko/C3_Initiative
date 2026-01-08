// app/api/resend-verification/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"
// import { sendVerificationEmail } from "@/lib/email-test"
import { generateVerificationToken, getTokenExpiry } from "@/lib/verification"


export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      )
    }

    // Generate new token
    const verificationToken = generateVerificationToken()
    const verificationTokenExpiry = getTokenExpiry()

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry,
      },
    })

    // Send new verification email
    const emailResult = await sendVerificationEmail(
      email,
      user.name,
      verificationToken
    )

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent! Please check your inbox.",
    })
  } catch (error) {
    console.error("[Resend Verification] Error:", error)
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    )
  }
}