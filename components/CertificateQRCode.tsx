// components/CertificateQRCode.tsx
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
      <p className="text-[8px] sm:text-xs mt-1 sm:mt-2 text-white bg-blue-800 px-1 py-0.5 rounded">
        Scan to verify
      </p>
    </div>
  )
}