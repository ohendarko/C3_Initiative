// animations.tsx
import { motion } from "framer-motion"

export const SlideInFromTop = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ y: -100, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.div>
)

export const SlideInFromBottom = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.div>
)
