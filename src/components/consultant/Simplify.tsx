"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Hero visual for /consultant: scattered tools that settle into one connected flow.
 * Cycles on its own until someone picks a state; reduced motion shows the calm state, no loop.
 */

const TOOLS = [
  { name: "Inbox", before: { left: 6, top: 10, rotate: -6 } },
  { name: "Spreadsheet", before: { left: 52, top: 6, rotate: 5 } },
  { name: "Booking tool", before: { left: 26, top: 36, rotate: -3 } },
  { name: "Customer list", before: { left: 60, top: 42, rotate: 6 } },
  { name: "Notes", before: { left: 8, top: 66, rotate: 4 } },
  { name: "Phone log", before: { left: 42, top: 74, rotate: -5 } },
];

// Calm state: a neat column on the left feeding one workspace on the right.
const afterTop = (i: number) => 8 + i * 14.5;
const ease = [0.65, 0, 0.35, 1] as const;

export default function Simplify() {
  const reduce = useReducedMotion();
  const [calm, setCalm] = useState(Boolean(reduce));
  const [auto, setAuto] = useState(!reduce);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setCalm((c) => !c), 4200);
    return () => clearInterval(t);
  }, [auto]);

  const pick = (v: boolean) => {
    setAuto(false);
    setCalm(v);
  };
  const dur = reduce ? 0 : 1.1;

  return (
    <div className="rounded-[22px] bg-white p-4 md:rounded-[32px] md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Show workflow" className="inline-flex rounded-full bg-[#f2f2f2] p-1 text-[13px] md:text-[14px]">
          {[
            { v: false, label: "Today" },
            { v: true, label: "Connected" },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={calm === o.v}
              onClick={() => pick(o.v)}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111] ${
                calm === o.v ? "bg-[#111] text-white" : "text-[#555] hover:text-[#111]"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-[#8a8a8a] md:text-[14px]" aria-live="polite">
          {calm ? "One place to work. Your team stays in charge." : "Six tools, one customer request."}
        </p>
      </div>

      <div className="relative mt-4 aspect-[4/3.4] w-full overflow-hidden rounded-[16px] bg-[#f7f7f7] sm:aspect-[16/9] md:mt-5">
        {/* Tangled paths (today) and clean connectors (connected) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <motion.path
            d="M14 16 C 40 4, 70 30, 62 12 S 30 50, 38 42 S 80 30, 72 50 S 20 60, 18 72 S 70 70, 54 80 S 30 20, 14 16"
            fill="none"
            stroke="#b8b8b8"
            strokeWidth="1.2"
            strokeDasharray="5 5"
            vectorEffect="non-scaling-stroke"
            animate={{ opacity: calm ? 0 : 1 }}
            transition={{ duration: dur * 0.6 }}
          />
          {TOOLS.map((_, i) => (
            <motion.path
              key={i}
              d={`M30 ${afterTop(i) + 4.5} C 45 ${afterTop(i) + 4.5}, 45 50, 57 50`}
              fill="none"
              stroke="#111"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
              initial={false}
              animate={{ opacity: calm ? 0.45 : 0 }}
              transition={{ duration: dur * 0.7, delay: calm ? dur * 0.6 + i * 0.05 : 0, ease }}
            />
          ))}
        </svg>

        {TOOLS.map((t, i) => (
          <motion.div
            key={t.name}
            className="absolute flex w-[36%] items-center sm:w-[27%] gap-2 rounded-[10px] border border-[#e6e6e6] bg-white px-2.5 py-2 text-[11px] font-medium text-[#222] shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:text-[13px] md:px-3 md:py-2.5 md:text-[14px]"
            initial={false}
            animate={
              calm
                ? { left: "6%", top: `${afterTop(i)}%`, rotate: 0 }
                : { left: `${t.before.left}%`, top: `${t.before.top}%`, rotate: t.before.rotate }
            }
            transition={{ duration: dur, ease, delay: reduce ? 0 : i * 0.04 }}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#b0b0b0]" aria-hidden="true" />
            <span className="truncate">{t.name}</span>
          </motion.div>
        ))}

        {/* The one workspace */}
        <motion.div
          className="absolute left-[55%] top-1/2 w-[41%] sm:left-[57%] sm:w-[38%] -translate-y-1/2 rounded-[14px] bg-[#111] p-3 text-white sm:p-4 md:rounded-[18px] md:p-5"
          initial={false}
          animate={{ opacity: calm ? 1 : 0, scale: calm ? 1 : 0.92 }}
          transition={{ duration: dur * 0.6, delay: calm ? dur * 0.7 : 0, ease }}
          aria-hidden={!calm}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:text-[11px]">One workspace</p>
          <ul className="mt-2 space-y-1.5 text-[11px] leading-[1.3] sm:text-[13px] md:mt-3 md:space-y-2 md:text-[15px]">
            <li>Customer details, gathered</li>
            <li className="text-white/70">Reply drafted</li>
            <li className="text-white/70">Records updated</li>
          </ul>
          <span className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#111] sm:text-[12px] md:mt-4 md:px-3 md:py-1.5">
            You approve
          </span>
        </motion.div>
      </div>
    </div>
  );
}
