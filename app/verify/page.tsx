'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function VerifyPage() {
  const [name, setName] = useState('')
  const [result, setResult] = useState<null | { verified: boolean; message: string }>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const res = await fetch('/api/verify', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <div className="grid grid-cols-3 items-center place-items-center bg-white mb-5">
          <Image src="/images/knust-logo.png" alt="knust" width={40} height={40} />
          <Image src="/images/lignan.png" alt="lignan-university" width={70} height={70} />
          <Image src="/images/re2.png" alt="re2" width={120} height={120} />
        </div>
        <h1 className="text-xl font-semibold text-center">C3 Certificate Verification</h1>
        <div className='flex flex-col justify-center items-center'>
          <span className='text-red-700 font-semibold'>Disclaimer</span>
          <p className='text-sm text-center'>C3 initiative will not take responsibility for failed or false verification as a result of wrong entry from user.</p>
        </div>
        <Input
          placeholder="Enter name on certificate"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Certificate'}
        </Button>

        {result && (
          <p className={`text-center mt-4 ${result.verified ? 'text-green-600' : 'text-red-600'}`}>
            {result.message}
          </p>
        )}
      </form>
    </div>
  )
}
