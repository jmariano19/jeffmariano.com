"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Channel = {
  name: string;
  mode: string;
  setting: string;
  visual: ReactNode;
  points: string[];
};

/**
 * The same canvas, adapted to how each channel works: two cards on the
 * gradient that rise in one after the other, their details following.
 */
export function ChannelAdapt({ channels }: { channels: Channel[] }) {

  return (
    <div className="relative overflow-hidden rounded-[22px] md:rounded-[36px] bg-[#e6d7bf] px-4 py-10 sm:px-8 md:px-[8%] md:py-[8%]">
      <Image src="/images/case-studies/canvas/channels-bg.webp" alt="" fill unoptimized className="object-cover" />

      <div className="relative grid gap-4 md:grid-cols-2 md:gap-[3%]">
        {channels.map((c, i) => {
          const start = 0.15 + i * 0.18;
          return (
            <motion.div
              key={c.name}
              className="flex flex-col rounded-[22px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(60,70,60,0.12)] md:p-8"
              initial={false}
              whileInView="shown"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: { opacity: 0, y: 16 },
                shown: { opacity: 1, y: 0, transition: { duration: 1, delay: start, ease: EASE } },
              }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[22px] font-bold tracking-[-0.03em] md:text-[24px]">{c.name}</p>
                <span className="rounded-full bg-[#111] px-3 py-1 text-[13px] font-semibold text-white">{c.mode}</span>
              </div>
              <p className="mt-1 text-[15px] text-[#666] md:text-[16px]">{c.setting}</p>
              <motion.div
                className="mt-5 rounded-[16px] bg-[#f3f2ef] p-5"
                variants={{
                  hidden: { opacity: 0, filter: "blur(4px)" },
                  shown: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.9, delay: start + 0.35, ease: EASE } },
                }}
              >
                {c.visual}
              </motion.div>
              <ul className="mt-5 flex flex-col gap-2.5">
                {c.points.map((p, n) => (
                  <motion.li
                    key={p}
                    className="flex gap-2.5 text-[15.5px] leading-[1.55] text-[#444] md:text-[16px]"
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      shown: { opacity: 1, y: 0, transition: { duration: 0.8, delay: start + 0.6 + n * 0.1, ease: EASE } },
                    }}
                  >
                    <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#111]" />
                    {p}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
