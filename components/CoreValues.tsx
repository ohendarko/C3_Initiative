"use client"
import React from 'react'
import SlideInFromRight from "./SlideInFromRight"
import { SlideInFromBottom } from "./animations"
import Image from 'next/image'

const CoreValues = () => {
  return (
    <div className="container !px-1 mx-auto max-w-4xl">
      
      {/* Core Values */}
      <SlideInFromBottom>
        <div className="flex justify-center text-3xl sm:text-4xl font-bold text-center !mt-20"><span>Our Core Values</span></div>
      </SlideInFromBottom>
      <div className='grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2'>
        <div className='flex justify-center items-center'>
          <SlideInFromBottom>
            <div className='mt-5 flex justify-center items-center w-full'>
              <p className='text-gray-700 text-lg p-3 dark:text-gray-300 text-right'>
                The C3 initiative seeks to empower Ghanaians with knowledge and resources needed to take decisive action to prevent and control cervical cancer. Together, we are changing attitude and building a future where every woman in Ghana is empowered with life-saving information.
              </p>
            </div>
          </SlideInFromBottom>

        </div>
        <SlideInFromRight>
          <div className='relative w-full h-96 mt-5 !p-3'>
            <Image
              src="/images/core-value.jpg"
              alt="core value"
              className="object-cover rounded-sm"
              fill
            />
          </div>
        </SlideInFromRight>
      </div>
    </div>
  )
}

export default CoreValues