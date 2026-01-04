'use client'

import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"

export default function ScrollRotateIn({ children }: { children: React.ReactNode }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { rotate: 0, opacity: 0 },
        visible: {
          rotate: 360,
          opacity: 1,
          transition: { duration: 1, ease: "easeInOut" },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
