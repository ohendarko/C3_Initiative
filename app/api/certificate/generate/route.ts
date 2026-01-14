// app/api/certificate/generate/route.ts

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"
import sharp from "sharp"
import path from "path"
import QRCode from "qrcode-svg"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log('[Certificate] Generate request for:', session.user.email)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const totalModules = 7
    if (!user.completedModules || user.completedModules.length < totalModules) {
      return NextResponse.json(
        { error: `Complete all modules first` },
        { status: 400 }
      )
    }

    console.log('[Certificate] Generating certificate with Sharp...')

    const certificateBuffer = await generateCertificateImage(
      user.name,
      user.certificateIssueDate || new Date(),
      user.id
    )

    console.log('[Certificate] ✅ Certificate generated')

    return new NextResponse(new Uint8Array(certificateBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${user.name.replace(/\s+/g, '_')}_Certificate.png"`,
      },
    })
  } catch (error: any) {
    console.error('[Certificate] Error:', error)
    return NextResponse.json(
      { error: "Failed to generate certificate", details: error.message },
      { status: 500 }
    )
  }
}

// app/api/certificate/generate/route.ts

async function generateCertificateImage(
  name: string,
  issueDate: Date,
  userId: string
): Promise<Buffer> {
  
  // Format date
  const formattedDate = issueDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Generate QR code as SVG
  const qrCode = new QRCode({
    content: `${process.env.NEXTAUTH_URL}/verify/${userId}`,
    width: 150,
    height: 150,
    color: "#000000",
    background: "#ffffff",
    ecl: "M",
  })
  const qrSvg = qrCode.svg()

  // Create SVG text overlay
  const svgOverlay = `
    <svg width="1414" height="1000">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&amp;display=swap');
          
          .name {
            font-family: 'Poppins', sans-serif;
            font-size: 80px;
            font-weight: 600;
            fill: #1e40af;
          }
          .date {
            font-family: 'Poppins', sans-serif;
            font-size: 30px;
            font-weight: 600;
            fill: #1f2937;
          }
        </style>
      </defs>
      
      <text x="220" y="745" class="name">${escapeXml(name)}</text>
      <text x="220" y="990" class="date">Awarded ${escapeXml(formattedDate)}</text>
    </svg>
  `

  // ✅ Load correct template file
  const templatePath = path.join(process.cwd(), 'public', 'images', 'sample-cert.png')

  // Composite everything together
  const result = await sharp(templatePath)
    .composite([
      {
        input: Buffer.from(svgOverlay),
        top: 0,
        left: 0,
      },
      {
        input: Buffer.from(qrSvg),
        top: 1225,
        left: 1820,
      },
    ])
    .png()
    .toBuffer()

  return result
}

// Helper to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}