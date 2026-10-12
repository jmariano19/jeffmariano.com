"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Page transitions.
 *
 * - Home ("/"): the full typographic intro (name, logo, title).
 * - Every other page: a short logo-only curtain.
 *
 * It plays on full page loads and on internal link clicks: the curtain rises
 * from the bottom, the route changes underneath it, then it lifts away.
 * "onLoad" reveals (see Reveal) wait for LOADER_DONE_EVENT, which fires as the
 * curtain starts to lift, so the page rises into view behind it.
 */

export const LOADER_DONE_EVENT = "intro-loader:done";

type Mode = "home" | "logo";
type Overlay = { id: number; mode: Mode; covered: boolean };

const curtainEase = [0.76, 0, 0.24, 1] as const;
const softEase = [0.22, 1, 0.36, 1] as const;

// Minimum time the overlay stays up, measured from when it appears.
const MIN_HOLD = { home: 2300, logo: 700 };
// Safety net if a navigation never changes the pathname.
const NAV_TIMEOUT = 5000;

function setIntroDone(done: boolean) {
  (window as unknown as { __introDone?: boolean }).__introDone = done;
  window.dispatchEvent(new Event(LOADER_DONE_EVENT));
}

function Letters({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="inline-flex overflow-hidden pb-[0.12em]" aria-hidden="true">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.7, delay: delay + i * 0.035, ease: softEase }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function HomeIntro({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      className="flex items-center gap-3 md:gap-5 text-[22px] md:text-[38px] font-medium tracking-[-0.03em]"
      exit={reduce ? undefined : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: curtainEase }}
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
      <Letters text="AI Experience Designer" delay={0.75} />
    </motion.div>
  );
}

/** Large logo that sharpens into focus while a hairline ring draws around it. */
function LogoMark({ reduce, delay }: { reduce: boolean; delay: number }) {
  return (
    <motion.div
      className="relative w-[96px] h-[96px] md:w-[132px] md:h-[132px]"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.72, rotate: -40, filter: "blur(12px)" }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -48, scale: 0.94, filter: "blur(6px)" }}
      transition={{ duration: reduce ? 0.2 : 0.7, delay, ease: softEase }}
    >
      <Image src="/images/Logo/logo-center.svg" alt="" fill sizes="132px" priority className="invert opacity-90" />
      {!reduce && (
        <svg
          className="pointer-events-none absolute -inset-[22px] md:-inset-[30px] w-[calc(100%+44px)] h-[calc(100%+44px)] md:w-[calc(100%+60px)] md:h-[calc(100%+60px)] -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(217,217,217,0.12)" strokeWidth="0.6" />
          <motion.circle
            cx="50"
            cy="50"
            r="49"
            fill="none"
            stroke="rgba(217,217,217,0.7)"
            strokeWidth="0.6"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: delay + 0.05, ease: [0.65, 0, 0.35, 1] }}
          />
        </svg>
      )}
    </motion.div>
  );
}

export default function IntroLoader() {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = !!useReducedMotion();

  const [overlay, setOverlay] = useState<Overlay | null>(() => ({
    id: 0,
    mode: pathname === "/" ? "home" : "logo",
    covered: true,
  }));

  const pendingNav = useRef(false);
  const pendingHash = useRef("");
  const minHoldDone = useRef(false);
  const routeReady = useRef(true);
  const busy = useRef(true);

  const tryLeave = useCallback(() => {
    if (!minHoldDone.current || !routeReady.current) return;
    // Let the page start its entrance as the curtain begins to lift.
    setIntroDone(true);
    setOverlay(null);
  }, []);

  // Lock scroll and start the minimum hold whenever a new overlay appears.
  useEffect(() => {
    if (!overlay) return;
    document.documentElement.style.overflow = "hidden";
    minHoldDone.current = false;
    const hold = reduce ? 350 : MIN_HOLD[overlay.mode] + (overlay.covered ? 0 : 300);
    const t = setTimeout(() => {
      minHoldDone.current = true;
      tryLeave();
    }, hold);
    return () => clearTimeout(t);
  }, [overlay?.id, reduce, tryLeave]); // eslint-disable-line react-hooks/exhaustive-deps

  // The new route has rendered under the curtain.
  useEffect(() => {
    if (!pendingNav.current) return;
    pendingNav.current = false;
    const target = pendingHash.current && document.getElementById(decodeURIComponent(pendingHash.current.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
    pendingHash.current = "";
    const t = setTimeout(() => {
      routeReady.current = true;
      tryLeave();
    }, 120);
    return () => clearTimeout(t);
  }, [pathname, tryLeave]);

  // Intercept internal link clicks so the curtain can cover the page first.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const raw = a.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^(mailto|tel):/i.test(raw)) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page: hash or query change
      if (url.pathname.startsWith("/api/")) return;

      e.preventDefault();
      if (busy.current) return;
      busy.current = true;

      const href = url.pathname + url.search + url.hash;
      router.prefetch(href);
      setIntroDone(false);
      routeReady.current = false;
      setOverlay({ id: Date.now(), mode: url.pathname === "/" ? "home" : "logo", covered: false });

      // Navigate once the curtain has closed.
      window.setTimeout(() => {
        pendingNav.current = true;
        pendingHash.current = url.hash;
        router.push(href, { scroll: false });
        window.setTimeout(() => {
          if (!routeReady.current) {
            pendingNav.current = false;
            routeReady.current = true;
            tryLeave();
          }
        }, NAV_TIMEOUT);
      }, reduce ? 150 : 500);
    }
    // Capture phase so this runs before Next's <Link> handler, which then sees
    // the event as handled and stays out of the way.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, reduce, tryLeave]);

  function finish() {
    document.documentElement.style.overflow = "";
    busy.current = false;
  }

  return (
    <AnimatePresence onExitComplete={finish}>
      {overlay && (
        <motion.div
          key={overlay.id}
          role="status"
          aria-label={overlay.mode === "home" ? "Jeff Mariano, AI Experience Designer" : "Loading"}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111] text-[#d9d9d9] font-[family-name:var(--font-inter)]"
          initial={overlay.covered ? false : reduce ? { opacity: 0 } : { y: "100%" }}
          animate={reduce ? { opacity: 1 } : { y: "0%" }}
          exit={reduce ? { opacity: 0, transition: { duration: 0.25 } } : { y: "-100%", transition: { duration: 0.7, ease: curtainEase } }}
          transition={{ duration: reduce ? 0.25 : overlay.covered ? 0.75 : 0.5, ease: curtainEase }}
        >
          {overlay.mode === "home" ? (
            <HomeIntro reduce={reduce} />
          ) : (
            <LogoMark reduce={reduce} delay={overlay.covered ? 0.05 : 0.22} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
