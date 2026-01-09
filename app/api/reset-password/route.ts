// app/api/reset-password/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    console.log('[Reset Password] Token received:', token?.substring(0, 10) + '...')

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Find user with this reset token
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    })

    if (!user) {
      console.log('[Reset Password] Invalid token')
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      )
    }

    // Check if token expired
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      console.log('[Reset Password] Token expired')
      return NextResponse.json(
        { error: "Reset link has expired. Please request a new one." },
        { status: 400 }
      )
    }

    console.log('[Reset Password] Token valid, updating password...')

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    console.log('[Reset Password] ✅ Password updated successfully')

    return NextResponse.json({
      success: true,
      message: "Password reset successfully!",
    })
  } catch (error: any) {
    console.error("[Reset Password] Error:", error)
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    )
  }
}