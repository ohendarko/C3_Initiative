'use client'

import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { useLearner } from '@/context/LearnerContext'
import { Button } from '@/components/ui/button'
import CertificateQRCode from '@/components/CertificateQRCode'
import { useRouter } from 'next/navigation'

export default function CertificatePage() {
  const { userProfile, modules } = useLearner()
  const certRef = useRef(null)
  const router = useRouter()

  if (!userProfile) return null

  const certificateUnlocked = userProfile.completedModules.length === modules.length

  const handleDownload = async () => {
    if (!certRef.current) return

    const canvas = await html2canvas(certRef.current, {
      scale: 2, // Higher quality
      useCORS: true,
    })
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
        <p className="text-lg font-semibold text-gray-700">
          Complete all modules to obtain your certificate.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pt-24">
      {/* Certificate Container - Responsive */}
      <div className="w-full max-w-5xl">
        <div 
          ref={certRef} 
          className="relative w-full aspect-[1414/1000] bg-white shadow-2xl"
        >
          <img
            src="/images/sample-cert.png"
            alt="Certificate"
            className="w-full h-full object-contain"
            draggable={false}
          />
          
          {/* Name - Positioned as percentage */}
          <div className="absolute top-[47%] left-[10.5%]">
            <p className="font-poppins text-2xl sm:text-3xl md:text-4xl font-semibold text-blue-800">
              {userProfile.name}
            </p>
          </div>

          {/* Date - Positioned as percentage */}
          <div className="absolute bottom-[29%] left-[10%]">
            <p className="font-poppins text-sm sm:text-base text-gray-800">
              Awarded {today}
            </p>
          </div>

          {/* QR Code - Fixed to container size, scales with certificate */}
          <div className="absolute bottom-[1.5%] right-[4%] w-[8%] aspect-square">
            <CertificateQRCode />
          </div>
        </div>
      </div>

      <Button className="mt-6 gradient-orange-blue text-white" onClick={handleDownload}>
        Download Certificate
      </Button>
      <Button className="mt-6 text-blue-900" onClick={() => router.back()}>
        Back
      </Button>
    </div>
  )
}