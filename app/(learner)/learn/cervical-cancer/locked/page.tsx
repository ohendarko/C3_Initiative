'use client'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
  const router = useRouter()
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='mt-10 flex flex-col justify-center items-center'>
        <span className='text-red-600 flex flex-col items-center'> <Lock />Locked</span>
        <p className='text-center mt-4 text-sm text-gray-700'>
          You do not have access to this module. Please complete the previous modules to unlock this content.
        </p>
        <Button
          variant='outline'
          onClick={() => router.push("/learn/cervical-cancer")}
          className='mt-2'
        >
          Home
        </Button>
      </div>
    </div>
  )
}

export default page