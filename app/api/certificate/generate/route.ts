// app/api/certificate/generate/route.ts

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"
import { createCanvas, loadImage } from "canvas"
import path from "path"
import QRCode from "qrcode"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('[Certificate] Generate request for:', session.user.email)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if all modules completed
    const totalModules = 7
    if (!user.completedModules || user.completedModules.length < totalModules) {
      return NextResponse.json(
        { 
          error: `Complete all ${totalModules} modules first. You have completed ${user.completedModules?.length || 0}.` 
        },
        { status: 400 }
      )
    }

    console.log('[Certificate] Generating certificate image...')

    // ✅ Generate certificate image
    const certificateBuffer = await generateCertificateImage(
      user.name,
      user.certificateIssueDate || new Date(),
      user.id
    )

    console.log('[Certificate] ✅ Certificate generated')

    // ✅ Return image directly as download
// app/api/certificate/generate/route.ts

    // Convert Buffer to Uint8Array
    return new NextResponse(new Uint8Array(certificateBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${user.name.replace(/\s+/g, '_')}_Certificate.png"`,
      },
    })
  } catch (error: any) {
    console.error('[Certificate] Error:', error)
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    )
  }
}

// ✅ Generate certificate image using canvas
async function generateCertificateImage(
  name: string,
  issueDate: Date,
  userId: string
): Promise<Buffer> {
  // Certificate dimensions
  const width = 1414
  const height = 1000

  // Create canvas
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // ✅ Load background template
  const templatePath = path.join(process.cwd(), 'public', 'images', 'sample-cert.png')
  const background = await loadImage(templatePath)
  ctx.drawImage(background, 0, 0, width, height)

  // ✅ Draw name (position: top 47%, left 10.5%)
  ctx.font = 'bold 48px Arial, sans-serif'
  ctx.fillStyle = '#1e40af'  // Blue-800
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  const nameX = width * 0.105  // 10.5%
  const nameY = height * 0.47  // 47%
  ctx.fillText(name, nameX, nameY)

  // ✅ Draw date (position: bottom 29%, left 10%)
  const formattedDate = issueDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  ctx.font = '20px Arial, sans-serif'
  ctx.fillStyle = '#1f2937'  // Gray-800
  const dateX = width * 0.10  // 10%
  const dateY = height * 0.71  // 71% (100% - 29%)
  ctx.fillText(`Awarded ${formattedDate}`, dateX, dateY)

  // ✅ Generate QR code (position: bottom 1.5%, right 4%, size 8%)
  try {
    const certificateUrl = `${process.env.NEXTAUTH_URL}/verify/${userId}`
    const qrSize = Math.floor(width * 0.08)  // 8% of width
    
    const qrBuffer = await QRCode.toBuffer(certificateUrl, {
      width: qrSize,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    const qrImage = await loadImage(qrBuffer)
    const qrX = width * 0.96 - qrSize  // Right 4%
    const qrY = height * 0.985 - qrSize  // Bottom 1.5%
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)
  } catch (qrError) {
    console.error('[Certificate] QR code generation failed:', qrError)
    // Continue without QR code
  }

  // Convert to buffer
  return canvas.toBuffer('image/png')
}