import Hero from "@/components/hero"
import Features from "@/components/features"
import About from "@/components/about"
import CTA from "@/components/cta"
import ScrollSlideUp from "@/components/ScrollSlideUp"
import CoreValues from "@/components/CoreValues"
import IntroVideo from "@/components/introVideo"

export default function HomePage() {
  return (
    <main className="min-h-screen space-y-16">
      <ScrollSlideUp><Hero /></ScrollSlideUp>
      <ScrollSlideUp><IntroVideo /></ScrollSlideUp>
      <ScrollSlideUp><CoreValues /></ScrollSlideUp>
      <ScrollSlideUp><Features /></ScrollSlideUp>
      {/* <ScrollSlideUp><About /></ScrollSlideUp> */}
      <ScrollSlideUp><CTA /></ScrollSlideUp>
    </main>
  )
}
