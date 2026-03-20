"use client";

import { motion } from "framer-motion";

export default function GrowLine({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={{ transformOrigin: "top" }}
    />
  );
}
