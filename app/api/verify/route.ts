import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { name } = await req.json()

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ verified: false, message: 'Invalid name format.' }, { status: 400 })
  }

  const cert = await prisma.certificate.findFirst({
    where: {
      ownerName: {
        equals: name,
        mode: 'insensitive',
      },
    },
  })

  if (cert) {
    return NextResponse.json({ verified: true, message: 'Certificate is valid.' })
  } else {
    return NextResponse.json({ verified: false, message: 'Certificate not found.' })
  }
}
