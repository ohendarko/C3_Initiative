// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from "@/lib/prisma"
import { generateVerificationToken, getTokenExpiry } from '@/lib/verification';
// import { sendVerificationEmail } from '@/lib/email';
import { sendVerificationEmail } from "@/lib/email-test"
// import { PrismaClient } from '@/lib/generated/prisma';
// const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

     // Generate verification token
    const verificationToken = generateVerificationToken()
    const verificationTokenExpiry = getTokenExpiry()

    const user = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        name: firstName + " " + lastName,
        email: email,
        password: hashedPassword,
        emailVerified: false,
        verificationToken,
        verificationTokenExpiry,
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      user.name,
      verificationToken
    )

    if (!emailResult.success) {
      console.error('[Signup] Failed to send verification email')
    }

    return NextResponse.json({ message: 'User created', userId: user.id });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
