'use client'

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function SlideInFromTop({ children }: { children: React.ReactNode }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

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
        hidden: {
          opacity: 0,
          y: -60, // 👈 starts 60px above
        },
        visible: {
          opacity: 1,
          y: 0,    // 👈 slides to its natural position
          transition: {
            duration: 0.8,
            ease: "easeOut",
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
