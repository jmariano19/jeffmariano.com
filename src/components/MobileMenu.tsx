"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experiments", href: "/#side-projects" },
  { label: "Articles", href: "/articles" },
];

const ease = [0.76, 0, 0.24, 1] as const;

/** Full-screen menu for small screens, opened from a two-line button in the header. */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  // Render the overlay into <body> so transformed ancestors can't clip it.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Open menu"
        className="relative flex h-10 w-10 flex-col items-center justify-center gap-[7px] sm:hidden"
      >
        <span className="block h-[1.5px] w-7 bg-[#111]" />
        <span className="block h-[1.5px] w-7 bg-[#111]" />
      </button>

      {mounted && createPortal(
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col justify-between bg-[#121212] px-5 pb-10 pt-28 text-white sm:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              autoFocus
              className="absolute right-4 top-7 flex h-10 w-10 items-center justify-center"
            >
              <span className="absolute block h-[1.5px] w-7 rotate-45 bg-white" />
              <span className="absolute block h-[1.5px] w-7 -rotate-45 bg-white" />
            </button>
            <ul className="flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block text-[56px] font-semibold leading-[1.1] tracking-[-0.06em] ${
                      pathname === l.href ? "text-white" : "text-white/55 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="flex flex-col gap-1 text-[16px] text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <a href="mailto:jmariano19@gmail.com" className="text-white">jmariano19@gmail.com</a>
              <a href="https://www.linkedin.com/in/jeffrey-mariano-0b28722a/" target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </>
  );
}
