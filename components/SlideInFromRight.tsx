'use client'
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function SlideInFromRight({ children }: { children: React.ReactNode }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, x: 80 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1], // cubic-bezier ease
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
