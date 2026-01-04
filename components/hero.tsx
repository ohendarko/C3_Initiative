"use client"
import SlideInFromTop from "./SlideInFromTop"
import { SlideInFromBottom } from "./animations"
import SlideInFromLeft from "./SlideInFromLeft"
import { useEffect, useState } from "react"

export default function Hero() {

  const images = [
    "/images/hero.jpg",
    "/images/shaggi.jpg",
    "/images/auditorium2.jpg",
    "/images/picture7.jpg",
    "/images/picture3.jpg",
  ]

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 5000)
      return () => clearInterval(interval)
    }, [])

  return (
    <section className="relative pt-24 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-700/30 overflow-hidden h-screen">
      {/* Slide Show Container */}
      <div className="absolute inset-0 z-0 flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt=""
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="container !px-1 mx-auto max-w-4xl">
        <div className="flex gap-12 items-center">
          <div className="space-y-8">
            <div className="relative space-y-4">
              {/* Content above background */}
              <SlideInFromBottom>

              <div className="relative z-10 p-4">
                <SlideInFromTop>
                    <div className=" flex flex-col text-4xl text-white sm:text-5xl lg:text-7xl font-bold leading-tight mt-2">
                      <div>
                        <span className="bg-white bg-clip-text text-transparent text-9xl">
                          C
                        </span>ONQUERING
                      </div>
                      <div>
                        <span className="bg-white bg-clip-text text-transparent text-9xl">
                          C
                        </span>ERVICAL
                      </div>
                      <div>
                      <span className="bg-white bg-clip-text text-transparent text-9xl">
                        C
                      </span>ANCER
                      </div>
                  </div>
                </SlideInFromTop>

                <SlideInFromLeft>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 font-medium text-orange-700 dark:text-orange-300 text-xl">
                    {/* <Shield className="w-4 h-4 mr-2" /> */}
                    In Ghana Through Education
                  </div>
                </SlideInFromLeft>
              </div>
              </SlideInFromBottom>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
