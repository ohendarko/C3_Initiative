// app/certificate/page.tsx

'use client'

import { useRef, useState } from 'react'
import { useLearner } from '@/context/LearnerContext'
import { Button } from '@/components/ui/button'
import CertificateQRCode from '@/components/CertificateQRCode'
import { useRouter } from 'next/navigation'
import { Download, Loader2 } from 'lucide-react'

export default function CertificatePage() {
  const { userProfile, modules } = useLearner()
  const certRef = useRef(null)
  const router = useRouter()
  const [downloading, setDownloading] = useState(false)

  if (!userProfile) return null

  const certificateUnlocked = userProfile.completedModules.length === modules.length

  // ✅ Use existing /api/certificate/generate
  const handleDownload = async () => {
    try {
      setDownloading(true)
      console.log('[Certificate] Requesting download...')

      // ✅ Call existing generate API
      const response = await fetch('/api/certificate/generate', {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to download certificate')
      }

      // Get the image blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${userProfile.name.replace(/\s+/g, '_')}_Certificate.png`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('[Certificate] ✅ Download complete')
    } catch (error) {
      console.error('[Certificate] Download failed:', error)
      alert('Failed to download certificate. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  // ✅ Use saved certificate date
  const certificateDate = userProfile.certificateIssueDate 
    ? new Date(userProfile.certificateIssueDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-GB', {
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
      {/* Certificate Display */}
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
          
          {/* Name */}
          <div className="absolute top-[47%] left-[10.5%]">
            <p className="font-poppins text-2xl sm:text-3xl md:text-4xl font-semibold text-blue-800">
              {userProfile.name}
            </p>
          </div>

          {/* Certificate Date */}
          <div className="absolute bottom-[29%] left-[10%]">
            <p className="font-poppins text-sm sm:text-base text-gray-800">
              Awarded {certificateDate}
            </p>
          </div>

          {/* QR Code */}
          <div className="absolute bottom-[1.5%] right-[4%] w-[8%] aspect-square">
            <CertificateQRCode />
          </div>
        </div>
      </div>

      {/* Download Button */}
      <Button 
        className="mt-6 gradient-orange-blue text-white" 
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </>
        )}
      </Button>
      
      <Button className="mt-6 text-blue-900" onClick={() => router.back()}>
        Back
      </Button>
    </div>
  )
}