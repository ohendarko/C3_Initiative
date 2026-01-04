'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import SlideInFromRight from "./SlideInFromRight"
import SlideInFromTop from "./SlideInFromTop"
import SlideInFromLeft from "./SlideInFromLeft"
import { SlideInFromBottom } from "./animations"
import ScrollRotateIn from "./ScrollRotateIn"

const images = [
  "/images/shaggi.jpg",
  "/images/auditorium2.jpg",
  "/images/picture7.jpg",
  "/images/picture3.jpg",
]

export default function CTA() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 relative overflow-hidden m-0">
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

      {/* ⬛ Backdrop Overlay for Contrast */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <ScrollRotateIn>
          <div className="w-20 h-20 gradient-triple rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
        </ScrollRotateIn>

        <SlideInFromTop>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Join the{" "}
            <span className="bg-gradient-to-r from-orange-200 via-blue-200 to-pink-200 bg-clip-text text-transparent">
              C3 Initiative
            </span>{" "}
            Today
          </h2>
        </SlideInFromTop>

        <SlideInFromRight>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto mt-4">
            Be part of the C3 Initiative and join thousands of healthcare students and professionals making a
            difference in cervical cancer prevention.
          </p>
        </SlideInFromRight>

        <SlideInFromLeft>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/signup">
              <Button size="lg" className="gradient-orange-blue text-white hover-shadow-gradient group">
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/learn/cervical-cancer">
              <Button size="lg" variant="outline" className="hover-shadow-gradient bg-transparent text-white border-white">
                Explore Modules
              </Button>
            </Link>
          </div>
        </SlideInFromLeft>

        <SlideInFromBottom>
          <p className="text-sm text-gray-200 mt-8">
            Free to join • No credit card required • Start learning immediately
          </p>
        </SlideInFromBottom>
      </div>
    </section>
  )
}
