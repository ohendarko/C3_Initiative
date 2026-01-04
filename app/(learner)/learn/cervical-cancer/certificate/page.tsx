'use client'

import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { useLearner } from '@/context/LearnerContext'
import { Button } from '@/components/ui/button'
import CertificateQRCode from '@/components/CertificateQRCode'

export default function CertificatePage() {
  const { userProfile, modules } = useLearner()
  const certRef = useRef(null)

  if (!userProfile) return null

  const certificateUnlocked = userProfile.completedModules.length === modules.length

  const handleDownload = async () => {
    if (!certRef.current) return

    const canvas = await html2canvas(certRef.current)
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = `${userProfile.name}_certificate.png`
    link.click()
  }

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  if (!certificateUnlocked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Complete all modules to obtain your certificate.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 mt-20">
      <div ref={certRef} className="relative m-5 w-[2000] h-[1414]">
        <img
          src="/images/sample-cert.png"
          alt="Certificate"
          className="w-full h-full object-contain"
          draggable={false}
        />
        <div className="absolute top-[300px] left-[110px]">
          <p className="font-poppins text-4xl font-semibold text-blue-800">
            {userProfile.name}
          </p>
        </div>

        {/* Date */}
        <div className="absolute bottom-[210px] left-[180px]">
          <p className="font-poppins text-gray-800">Awarded {today}</p>
        </div>

        {/* QR Code */}
        <div className="absolute bottom-[20px] right-[20px]">
          <CertificateQRCode />
        </div>
      </div>


      <Button className="mt-6" onClick={handleDownload}>
        Download Certificate
      </Button>
    </div>
  )
}
