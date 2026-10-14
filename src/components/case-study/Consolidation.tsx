"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const GRADIENT = "linear-gradient(90deg, #f7c948, #f08a24 45%, #e5262e)";
const SPRING = { type: "spring", stiffness: 140, damping: 15, mass: 0.9 } as const;

// Fixed "random" values so the server and browser render the same thing.
const TILT = [-1.4, 0.9, 1.2, -0.7, 0.6, -1.1, 1, -0.5];
const SCATTER = [
  { x: -60, y: -150, r: -16 },
  { x: 70, y: -190, r: 14 },
  { x: -90, y: -120, r: 11 },
  { x: 40, y: -170, r: -19 },
  { x: -30, y: -210, r: 18 },
  { x: 90, y: -140, r: -12 },
  { x: -70, y: -180, r: -9 },
  { x: 55, y: -230, r: 15 },
];

function Sparkle({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" fill="#e5262e" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill="#e5262e" />
    </svg>
  );
}

/**
 * Before and after, on the gradient: the separate apps tumble in and settle
 * into a pile, then the single canvas that replaces them appears beside it.
 */
export function Consolidation({ tools }: { tools: string[] }) {
  const reduce = useReducedMotion();
  const view = { once: true, amount: 0.35 } as const;
  const settleEnd = 0.25 + tools.length * 0.09 + 0.6;

  return (
    <div className="relative overflow-hidden rounded-[22px] md:rounded-[36px] bg-[#cfc9ec] px-4 py-10 sm:px-8 md:px-[8%] md:py-[9%]">
      <Image
        src="/images/case-studies/canvas/consolidation-bg.webp"
        alt=""
        fill
        unoptimized
        className="object-cover"
      />

      <div className="relative grid gap-8 md:grid-cols-2 md:gap-[3.5%]">
        {/* Before: separate apps */}
        <div>
          <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.04em] text-[#1d2550]">Before: many separate apps</p>
          {/* The card decides when the pile drops, so tiles that start above the screen still fall in. */}
          <motion.div
            className="rounded-[22px] bg-white p-3.5 shadow-[0_20px_50px_rgba(40,40,110,0.12)] md:p-4"
            initial={reduce ? false : "scattered"}
            whileInView="settled"
            viewport={view}
            variants={{ scattered: { opacity: 0, y: 20 }, settled: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-2 gap-2.5 md:gap-3">
              {tools.map((t, n) => (
                <motion.div
                  key={t}
                  className="rounded-[12px] border border-[#dcdcdc] bg-[#f4f4f4] px-3.5 py-3.5 text-[14px] text-[#333] shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:px-4 md:py-[18px] md:text-[16px]"
                  variants={{
                    scattered: { opacity: 0, x: SCATTER[n % 8].x, y: SCATTER[n % 8].y, rotate: SCATTER[n % 8].r },
                    settled: {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      rotate: TILT[n % 8],
                      transition: { ...SPRING, delay: 0.25 + n * 0.09, opacity: { duration: 0.25, delay: 0.25 + n * 0.09 } },
                    },
                  }}
                >
                  {t}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* After: one canvas */}
        <div>
          <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.04em] text-[#1d2550]">After: one canvas</p>
          <motion.div
            className="flex h-[calc(100%-33px)] flex-col justify-center rounded-[22px] border border-white/70 bg-[#f4f3f1]/95 p-5 shadow-[0_20px_50px_rgba(40,40,110,0.12)] md:p-7"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={view}
            transition={{ duration: 0.8, delay: reduce ? 0 : settleEnd, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.02em] md:text-[22px]">
              <Sparkle /> How can I help you today?
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {["Credit check", "Plan upgrade", "Build quote"].map((c, n) => (
                <motion.span
                  key={c}
                  className="rounded-[10px] border-[1.5px] border-[#111] bg-white px-3.5 py-2 text-[14px] md:px-4 md:text-[16px]"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={view}
                  transition={{ duration: 0.45, delay: reduce ? 0 : settleEnd + 0.35 + n * 0.08 }}
                >
                  {c}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="mt-5 rounded-full p-[2px]"
              style={{ background: GRADIENT }}
              initial={reduce ? false : { opacity: 0, scaleX: 0.85 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={view}
              transition={{ duration: 0.6, delay: reduce ? 0 : settleEnd + 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-full bg-white px-5 py-3 text-[15px] text-[#777] md:text-[16px]">Search or ask</div>
            </motion.div>
            <motion.p
              className="mt-5 text-[15px] leading-[1.65] text-[#444] md:text-[16px]"
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={view}
              transition={{ duration: 0.6, delay: reduce ? 0 : settleEnd + 0.85 }}
            >
              The rep asks once. The canvas pulls in the customer&apos;s context and assembles the right tool for the task.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
