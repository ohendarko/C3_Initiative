import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email, name } = await req.json()

  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 })
  
  const nameParts = name?.split(" ") || []
  const firstName = nameParts[0] || ""
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""


  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { 
      email, 
      name,
      firstName,
      lastName
     },
  })

  return NextResponse.json(user)
}
