"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ScrollBlurProps {
  children: ReactNode;
  className?: string;
  /** Maximum blur in px once the element has scrolled out of view. */
  maxBlur?: number;
}

/**
 * Blurs and fades its children as they scroll up and out of the viewport.
 * The effect starts when the top of the element passes 30% of the viewport height
 * and finishes when its bottom does. Reduced-motion users get a plain fade.
 */
export default function ScrollBlur({ children, className, maxBlur = 12 }: ScrollBlurProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end start"] });

  const blurPx = useTransform(scrollYProgress, [0, 0.25, 1], [0, reduce ? 0 : maxBlur * 0.15, reduce ? 0 : maxBlur]);
  const filter = useTransform(blurPx, (v) => `blur(${v.toFixed(2)}px)`);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);

  return (
    <motion.div ref={ref} className={className} style={{ filter, opacity, y, willChange: "filter, opacity, transform" }}>
      {children}
    </motion.div>
  );
}
