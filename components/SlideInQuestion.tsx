"use client"
import { motion } from "framer-motion"

export default function SlideInQuestion({ children, keyId }: { children: React.ReactNode; keyId: string }) {
  return (
    <motion.div
      key={keyId}
      initial={{ x: 100, opacity: 0 }}   // Slide in from the right
      animate={{ x: 0, opacity: 1 }}     // Animate to center
      exit={{ x: -100, opacity: 0 }}     // Slide out to the left
      transition={{ duration: 0.1, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}
