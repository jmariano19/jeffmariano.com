"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

// Soft spring used for every entrance on the homepage.
const spring = { type: "spring" as const, stiffness: 121, damping: 27, mass: 0.3 };

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance in px the element rises from. */
  y?: number;
  /** Animate on page load instead of when scrolled into view. */
  onLoad?: boolean;
  /** Start blurred and sharpen into focus. */
  blur?: boolean;
}

export default function Reveal({ children, className, delay = 0, y = 90, onLoad = false, blur = false }: RevealProps) {
  const reduce = useReducedMotion();
  const hidden = reduce
    ? { opacity: 0 }
    : { opacity: 0, y, ...(blur ? { filter: "blur(10px)" } : {}) };
  const shown = { opacity: 1, y: 0, ...(blur ? { filter: "blur(0px)" } : {}) };
  const transition = reduce ? { duration: 0.3, delay } : { ...spring, delay };

  return onLoad ? (
    <motion.div className={className} initial={hidden} animate={shown} transition={transition}>
      {children}
    </motion.div>
  ) : (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "-60px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
