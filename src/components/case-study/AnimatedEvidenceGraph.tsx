"use client";

import { motion } from "framer-motion";

type EvidenceSignal = {
  label: string;
  value: number;
  detail: string;
};

type AnimatedEvidenceGraphProps = {
  signals: EvidenceSignal[];
};

export default function AnimatedEvidenceGraph({ signals }: AnimatedEvidenceGraphProps) {
  return (
    <motion.div
      className="rounded-[22px] bg-[#f1d7d1] px-5 py-7 md:px-10 md:py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
            staggerChildren: 0.18,
          },
        },
      }}
    >
      <div className="flex flex-col gap-7">
        {signals.map((signal) => (
          <motion.div
            key={signal.label}
            className="grid gap-3 md:grid-cols-[230px_1fr_70px] md:items-center"
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
              },
            }}
          >
            <div>
              <p className="font-[family-name:var(--font-roboto)] font-bold text-base md:text-[18px] leading-6 text-[#6b332b]">
                {signal.label}
              </p>
              <p className="font-[family-name:var(--font-roboto)] text-sm md:text-base leading-6 text-[#6b332b]/80">
                {signal.detail}
              </p>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-[#e3bbb3]">
              <motion.div
                className="h-full origin-left rounded-full bg-[#7b1410]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: signal.value / 100 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.9,
                  delay: 0.12,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                aria-hidden="true"
              />
            </div>
            <motion.p
              className="font-[family-name:var(--font-playfair)] font-bold text-[34px] leading-none text-[#6b332b] md:text-right"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              {signal.value}%
            </motion.p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
