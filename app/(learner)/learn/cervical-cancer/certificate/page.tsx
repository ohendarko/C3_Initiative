// app/certificate/page.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { useLearner } from '@/context/LearnerContext'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Download, Loader2 } from 'lucide-react'

export default function CertificatePage() {
  const { userProfile, modules } = useLearner()
  const certRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [certificateData, setCertificateData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const certificateUnlocked = userProfile?.completedModules?.length === modules.length

  // ✅ Fetch/generate certificate (with localStorage cache)
  useEffect(() => {
    if (!certificateUnlocked || !userProfile) {
      setLoading(false)
      return
    }

    const fetchCertificate = async () => {
      try {
        setLoading(true)
        
        // ✅ Check localStorage cache first
        const cacheKey = `certificate_${userProfile.id}`
        const cachedCert = localStorage.getItem(cacheKey)
        
        if (cachedCert) {
          console.log('[Certificate] Using cached certificate')
          setCertificateData(cachedCert)
          setLoading(false)
          return
        }

        // ✅ Generate new certificate
        console.log('[Certificate] Requesting server-generated certificate...')

        const res = await fetch('/api/certificate/generate', {
          method: 'POST',
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to generate certificate')
        }

        const data = await res.json()
        
        // ✅ Save to localStorage
        localStorage.setItem(cacheKey, data.certificateData)
        setCertificateData(data.certificateData)
        
        console.log('[Certificate] ✅ Certificate generated and cached')
      } catch (err: any) {
        console.error('[Certificate] Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCertificate()
  }, [certificateUnlocked, userProfile])

  // ✅ Download with html2canvas
  const handleDownload = async () => {
    if (!certRef.current || !userProfile) return

    try {
      setDownloading(true)
      console.log('[Certificate] Downloading with html2canvas...')

      // Wait for fonts and images to load
      await document.fonts.ready
      await new Promise(resolve => setTimeout(resolve, 500))

      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const image = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = image
      link.download = `${userProfile.name.replace(/\s+/g, '_')}_Certificate.png`
      link.click()

      console.log('[Certificate] ✅ Download complete')
    } catch (error) {
      console.error('[Certificate] Download failed:', error)
      alert('Failed to download certificate. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  // ✅ Clear cache and regenerate
  const handleRegenerate = async () => {
    if (!userProfile) return
    
    const cacheKey = `certificate_${userProfile.id}`
    localStorage.removeItem(cacheKey)
    window.location.reload()
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!certificateUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-lg font-semibold text-gray-700">
          Complete all {modules.length} modules to obtain your certificate.
        </p>
        <p className="text-sm text-gray-500">
          {userProfile.completedModules?.length || 0} / {modules.length} modules completed
        </p>
        <Button onClick={() => router.push('/learn/cervical-cancer')}>
          Continue Learning
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <p className="text-gray-600">Generating your certificate...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-lg font-semibold text-red-600">Error</p>
        <p className="text-gray-600">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!certificateData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No certificate available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pt-24 gap-6">
      {/* Certificate Display */}
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-lg p-4">
        <div 
          ref={certRef}
          className="relative w-full aspect-[2100/1485]"
        >
          {/* ✅ Display server-generated certificate from localStorage */}
          <img
            src={certificateData}
            alt="Certificate"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Button 
          className="gradient-orange-blue text-white"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Certificate
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={handleRegenerate}>
          Regenerate
        </Button>
        
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>
    </div>
  )
}
