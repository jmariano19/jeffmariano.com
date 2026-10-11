"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Full-screen typographic intro shown on every full page load (first visit and refresh).
// Client-side navigations keep the root layout mounted, so it doesn't replay between pages.

export const LOADER_DONE_EVENT = "intro-loader:done";

const ease = [0.76, 0, 0.24, 1] as const;

function Letters({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="inline-flex overflow-hidden pb-[0.12em]" aria-hidden="true">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.7, delay: delay + i * 0.035, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const hold = reduce ? 500 : 2300;
    const t = setTimeout(() => setVisible(false), hold);
    return () => clearTimeout(t);
  }, [reduce]);

  function finish() {
    document.documentElement.style.overflow = "";
    (window as unknown as { __introDone?: boolean }).__introDone = true;
    window.dispatchEvent(new Event(LOADER_DONE_EVENT));
  }

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible && (
        <motion.div
          key="intro"
          role="status"
          aria-label="Jeff Mariano, Agent Experience Designer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111] text-[#d9d9d9] font-[family-name:var(--font-inter)]"
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduce ? 0.3 : 0.9, ease }}
        >
          <motion.div
            className="flex items-center gap-3 md:gap-5 text-[22px] md:text-[38px] font-medium tracking-[-0.03em]"
            exit={reduce ? undefined : { opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease }}
          >
            <Letters text="Jeff Mariano" delay={0.15} />
            <motion.span
              className="relative block w-[40px] h-[40px] md:w-[64px] md:h-[64px] shrink-0"
              initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 121, damping: 14, mass: 0.6, delay: 0.55 }}
            >
              <Image src="/images/Logo/logo-center.svg" alt="" fill sizes="64px" priority className="invert opacity-85" />
            </motion.span>
            <Letters text="Agent Experience Designer" delay={0.75} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
