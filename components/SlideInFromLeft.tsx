'use client'

import { motion } from "framer-motion"
import { ReactNode } from "react"

export default function SlideInFromLeft({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
