
'use client'

import { QRCodeCanvas } from "qrcode.react"
import { useEffect, useState } from "react"

export default function CertificateQRCode() {
  const verificationUrl = `https://c3-learning.com/verify`
  const [qrSize, setQrSize] = useState(64)

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) {
        setQrSize(48) // Mobile
      } else if (window.innerWidth < 768) {
        setQrSize(64) // Tablet
      } else {
        setQrSize(80) // Desktop
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <div className="flex flex-col items-center text-nowrap">
      <QRCodeCanvas value={verificationUrl} size={qrSize} />
    </div>
  )
}