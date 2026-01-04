import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"



export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const emailParam = searchParams.get("email");
  const email = emailParam === null ? undefined : emailParam;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}