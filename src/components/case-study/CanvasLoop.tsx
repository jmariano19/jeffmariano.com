"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A silent, looping recreation of the AI Conversational Canvas on a tablet:
 * the rep asks for a quote, the canvas assembles the quote flow, the rep
 * picks the recommended offer and device, and the cart shows the savings.
 *
 * Everything is drawn at a fixed 1180 × 775 "screen" and scaled to fit, so
 * positions below are in that design space.
 */

const W = 1180;
const H = 775;

// Each step: what the screen shows, where the tap lands, and how long it holds.
type Scene = "home" | "offers" | "devices" | "cart";
type Step = { scene: Scene; ms: number; tap?: { x: number; y: number }; pressed?: string };

const STEPS: Step[] = [
  { scene: "home", ms: 2200 },
  { scene: "home", ms: 900, tap: { x: 913, y: 374 }, pressed: "build" },
  { scene: "offers", ms: 2600 },
  { scene: "offers", ms: 1000, tap: { x: 945, y: 361 }, pressed: "best" },
  { scene: "offers", ms: 900, tap: { x: 373, y: 605 }, pressed: "best+continue" },
  { scene: "devices", ms: 1900 },
  { scene: "devices", ms: 1000, tap: { x: 462, y: 478 }, pressed: "device" },
  { scene: "cart", ms: 3200 },
];

const GRADIENT = "linear-gradient(90deg, #f7c948, #f08a24 45%, #e5262e)";

export default function CanvasLoop() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  // Scale the fixed-size screen to the available width.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Only run while on screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !visible) return;
    const t = setTimeout(() => setI((n) => (n + 1) % STEPS.length), STEPS[i].ms);
    return () => clearTimeout(t);
  }, [i, reduce, visible]);

  // People who prefer reduced motion get one representative still frame.
  const step = reduce ? STEPS[3] : STEPS[i];
  const pressed = step.pressed ?? "";
  const cartCount = step.scene === "cart" || (step.scene === "devices" && pressed === "device") ? 1 : 0;

  return (
    <div
      ref={wrap}
      className="relative w-full overflow-hidden rounded-[18px] md:rounded-[26px] bg-white"
      style={{ aspectRatio: `${W} / ${H}` }}
      role="img"
      aria-label="Animated walkthrough: a rep asks the AI canvas to build a quote, picks the recommended offer and device, and sees the savings in the cart."
    >
      <div
        className="absolute left-0 top-0 origin-top-left font-[family-name:var(--font-inter)] text-[#111]"
        style={{ width: W, height: H, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
      >
        <StatusBar />
        <TopBar />
        <Rail />

        {/* Customer context panel steps aside once a flow starts. */}
        <motion.div
          className="absolute left-[98px] top-[112px] w-[288px] h-[663px] overflow-hidden"
          animate={{ opacity: step.scene === "home" ? 1 : 0, x: step.scene === "home" ? 0 : -24 }}
          transition={{ duration: 0.45 }}
        >
          <CustomerPanel />
        </motion.div>

        <AnimatePresence mode="wait">
          {step.scene === "home" && (
            <motion.div
              key="home"
              className="absolute left-[398px] right-0 top-[100px] bottom-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <Home pressed={pressed === "build"} />
            </motion.div>
          )}
          {(step.scene === "offers" || step.scene === "devices") && (
            <motion.div
              key="quote"
              className="absolute left-[270px] top-[124px] w-[740px]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <QuoteCard scene={step.scene} pressed={pressed} />
            </motion.div>
          )}
        </AnimatePresence>

        <CartButton count={cartCount} />

        <AnimatePresence>
          {step.scene === "cart" && (
            <motion.div
              key="cart"
              className="absolute inset-0 top-[36px] bg-black/35 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="absolute left-[230px] top-[40px] w-[720px]"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Cart />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step.tap && !reduce && (
            <motion.span
              key={`${i}-tap`}
              className="pointer-events-none absolute h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/25 ring-2 ring-white/80"
              style={{ left: step.tap.x, top: step.tap.y }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1, 0.85], opacity: [0, 1, 0.9] }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.45 }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Pieces of the screen ---------- */

function Sparkle({ size = 18, color = "#e5262e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" fill={color} />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill={color} />
    </svg>
  );
}

function Icon({ d, size = 22 }: { d: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d}
    </svg>
  );
}

function StatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 h-[36px] bg-[#f6f5f3] px-[18px] flex items-center justify-between text-[13px] font-medium">
      <span>9:41&nbsp;&nbsp;Mon Sep 15</span>
      <span className="flex items-center gap-1.5">
        <span className="tracking-[-2px]">▂▃▅▇</span> 100%
        <span className="inline-block h-[11px] w-[22px] rounded-[3px] border border-[#111] p-[1px]">
          <span className="block h-full w-full rounded-[1px] bg-[#111]" />
        </span>
      </span>
    </div>
  );
}

function TopBar() {
  return (
    <div className="absolute inset-x-0 top-[36px] h-[64px] bg-[#f6f5f3]">
      {/* Neutral product mark in place of the client logo */}
      <span className="absolute left-[20px] top-[16px] flex h-[32px] w-[32px] items-center justify-center rounded-[9px] bg-[#111]">
        <Sparkle size={18} color="#fff" />
      </span>
      <span className="absolute left-[84px] top-[20px] text-[#111]">
        <Icon d={<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>} />
      </span>
      <div className="absolute left-[150px] top-[10px] h-[54px] w-[170px] rounded-t-[12px] bg-white px-4 pt-[9px]">
        <p className="text-[12.5px] font-semibold leading-tight">Emily Jean Stone</p>
        <p className="text-[12px] leading-tight text-[#444]">XXX-XXX-0324</p>
      </div>
      <div className="absolute right-[20px] top-[10px] flex items-center gap-[30px] text-[#111]">
        <Icon d={<><path d="M4 7h16M4 12h16M4 17h16" /></>} />
        <Icon d={<><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" /><path d="M10 20a2 2 0 0 0 4 0" /></>} />
        <span className="flex h-[44px] items-center gap-2 rounded-[12px] bg-white px-3 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <span className="relative flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#fde7a1]">
            <Icon size={18} d={<><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>} />
            <span className="absolute -bottom-0.5 -right-0.5 h-[10px] w-[10px] rounded-full border-2 border-white bg-[#1a9e4b]" />
          </span>
          <span className="text-[13px] font-bold">SR</span>
        </span>
      </div>
    </div>
  );
}

function Rail() {
  const items = [
    { label: "Bio", d: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6.5 18.5c1.4-2.2 3.3-3.3 5.5-3.3s4.1 1.1 5.5 3.3" /></> },
    { label: "Lines", d: <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M10 7h4M10 11h4M10 15h4" /></> },
    { label: "Journeys", d: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5h6v2M3 12h18" /></> },
  ];
  return (
    <div className="absolute left-0 top-[100px] bottom-0 w-[86px] bg-white border-r border-[#eee] pt-[28px] flex flex-col items-center gap-[30px]">
      {items.map((it) => (
        <div key={it.label} className="flex flex-col items-center gap-1 text-[11px]">
          <Icon d={it.d} />
          {it.label}
        </div>
      ))}
    </div>
  );
}

function CustomerPanel() {
  const rows = [
    ["Finance limit", "$7,000"],
    ["Device limit", "$1,000"],
    ["Next bill", "$750"],
  ];
  return (
    <div className="h-full rounded-[14px] bg-[#f6f5f3] p-[14px] text-[13px]">
      <p className="text-[16px] font-bold tracking-[-0.02em]">Emily Jean Stone</p>
      <span className="mt-1.5 inline-block rounded-[4px] bg-[#e4e2de] px-1.5 py-0.5 text-[11.5px] font-semibold">Account owner</span>
      <p className="mt-4 border-t border-[#ddd] pt-3 text-[14px] font-bold">Bill info</p>
      {rows.map(([k, v]) => (
        <div key={k} className="mt-2.5 flex justify-between text-[#333]">
          <span>{k}</span>
          <span>{v}</span>
        </div>
      ))}
      <p className="mt-4 border-t border-[#ddd] pt-3 text-[14px] font-bold">Bio</p>
      <p className="mt-2.5 text-[#333]">Customer for 7 years</p>
      <p className="mt-2 text-[#333]">3 lines · 2 mobile devices</p>
      <div className="mt-3 flex gap-1.5">
        <span className="rounded-[4px] bg-[#e4e2de] px-1.5 py-0.5 text-[11.5px] font-semibold">High tenure</span>
        <span className="rounded-[4px] bg-[#e4e2de] px-1.5 py-0.5 text-[11.5px] font-semibold">Upgrade eligible</span>
      </div>
      <div className="mt-4 rounded-[10px] bg-white px-3 py-2.5 text-[12.5px] text-[#555]">
        Churn: <span className="font-bold text-[#111]">Elevated 4/5</span>{" "}
        <span className="ml-1 rounded-[4px] bg-[#c4501a] px-1.5 py-0.5 text-[11px] font-bold text-white">High risk</span>
      </div>
    </div>
  );
}

function Home({ pressed }: { pressed: boolean }) {
  const chips = ["Credit check", "Plan upgrade", "Build quote"];
  return (
    <div className="flex h-full flex-col items-center justify-center pb-[90px]">
      <p className="flex items-center gap-2 text-[19px] font-bold tracking-[-0.02em]">
        <Sparkle /> How can I help you today?
      </p>
      <div className="mt-5 flex gap-3">
        {chips.map((c) => {
          const on = pressed && c === "Build quote";
          return (
            <motion.span
              key={c}
              animate={{ scale: on ? 0.95 : 1, backgroundColor: on ? "#111111" : "#ffffff", color: on ? "#ffffff" : "#111111" }}
              transition={{ duration: 0.2 }}
              className="rounded-[10px] border-[1.5px] border-[#111] px-4 py-2.5 text-[15px]"
            >
              {c}
            </motion.span>
          );
        })}
      </div>
      <div className="mt-6 w-[720px] rounded-full p-[2px]" style={{ background: GRADIENT }}>
        <div className="flex h-[54px] items-center justify-between rounded-full bg-white px-5 text-[15px] text-[#777]">
          Search or ask
          <Icon size={20} d={<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>} />
        </div>
      </div>
    </div>
  );
}

const STEPPER = ["Offers", "Device", "Trade-in", "Plan", "Protection", "Perks"];

function QuoteCard({ scene, pressed }: { scene: "offers" | "devices"; pressed: string }) {
  const active = scene === "offers" ? 0 : 1;
  // Steps the AI could fill from the account arrive already checked.
  const done = new Set(scene === "offers" ? [3, 5] : [0, 3, 5]);
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#e6e3de] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between bg-[#f6f5f3] px-5 py-4">
        <p className="text-[18px] font-bold tracking-[-0.02em]">Quote configuration</p>
        <div className="flex items-center gap-2">
          <span className="rounded-[8px] border border-[#111] bg-white px-3 py-1.5 text-[14px]">808-272-3555 ▾</span>
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-[18px] leading-none">⋮</span>
        </div>
      </div>
      <div className="flex justify-between border-b border-[#eee] px-6 py-3">
        {STEPPER.map((s, n) => (
          <div key={s} className="flex w-[90px] flex-col items-center gap-1.5">
            <motion.span
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1.5px]"
              animate={{
                backgroundColor: n === active ? "#222222" : "#ffffff",
                borderColor: done.has(n) ? "#1a9e4b" : n === active ? "#222222" : "#d0d0d0",
                color: n === active ? "#ffffff" : done.has(n) ? "#1a9e4b" : "#555555",
              }}
              transition={{ duration: 0.35 }}
            >
              {done.has(n) && n !== active ? (
                <Icon size={18} d={<path d="M5 12.5l4.5 4.5L19 7.5" />} />
              ) : (
                <span className="h-[12px] w-[9px] rounded-[2px] border-[1.5px] border-current" />
              )}
            </motion.span>
            <span className={`text-[12px] ${n === active ? "font-bold" : "text-[#444]"}`}>{s}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {scene === "offers" ? (
          <motion.div key="offers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <Offers pressed={pressed} />
          </motion.div>
        ) : (
          <motion.div key="devices" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
            <Devices pressed={pressed} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Footer({ primary, secondary, pressed }: { primary: string; secondary: string; pressed?: boolean }) {
  return (
    <div className="flex items-center justify-between bg-[#f6f5f3] px-5 py-4">
      <div className="flex gap-2.5">
        <motion.span
          animate={{ scale: pressed ? 0.95 : 1 }}
          className="rounded-full bg-[#111] px-5 py-2.5 text-[14.5px] font-bold text-white"
        >
          {primary}
        </motion.span>
        <span className="rounded-full border-[1.5px] border-[#111] bg-white px-5 py-2.5 text-[14.5px] font-bold">{secondary}</span>
      </div>
      <span className="flex gap-4 text-[#333]">
        <Icon size={20} d={<path d="M7 11v9H4v-9zM7 11l4-8c1.5 0 2.5 1 2.5 2.5V9H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7" />} />
        <Icon size={20} d={<path d="M17 13V4h3v9zM17 13l-4 8c-1.5 0-2.5-1-2.5-2.5V15H5a2 2 0 0 1-2-2.3l1.2-7A2 2 0 0 1 6.2 4H17" />} />
      </span>
    </div>
  );
}

function Offers({ pressed }: { pressed: string }) {
  const picked = pressed.includes("best");
  const offers = [
    { t: "Choose any plan, get the new phone on us", d: "With an eligible trade-in. Any condition guaranteed.", best: true },
    { t: "New phone on us with a new line", d: "Even on the lowest-priced plans. No trade-in required." },
    { t: "Pro model for $100", d: "Via 36 monthly bill credits with an eligible trade-in and new line." },
  ];
  return (
    <>
      <div className="px-6 pb-5 pt-4">
        <p className="mb-3 flex items-center gap-2 text-[17px] font-bold tracking-[-0.02em]">
          <Sparkle size={17} color="#111" /> Recommended offers
        </p>
        <div className="flex flex-col gap-2.5">
          {offers.map((o, n) => (
            <motion.div
              key={o.t}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + n * 0.15, duration: 0.4 }}
              className="relative rounded-[12px] p-[2px]"
              style={{ background: o.best ? GRADIENT : "#111" }}
            >
              {o.best && (
                <motion.span
                  className="pointer-events-none absolute -inset-1 rounded-[15px] opacity-0"
                  style={{ background: GRADIENT, filter: "blur(10px)" }}
                  animate={{ opacity: [0, 0.45, 0.2] }}
                  transition={{ delay: 0.8, duration: 1.4 }}
                />
              )}
              <div className="relative flex items-center justify-between rounded-[10px] bg-white px-4 py-3" style={{ margin: o.best ? 0 : -0.5 }}>
                <div className="flex items-start gap-3">
                  <Icon size={20} d={<><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8" r="1.4" /></>} />
                  <div>
                    <p className="text-[14px] font-bold">{o.t}</p>
                    <p className="text-[13px] text-[#444]">{o.d}</p>
                  </div>
                </div>
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#111]">
                  {o.best && picked && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-[12px] w-[12px] rounded-full bg-[#111]" />}
                </span>
              </div>
              {o.best && (
                <span className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-full bg-[#111] px-2 py-0.5 text-[11px] font-bold text-white">
                  <Sparkle size={10} color="#fff" /> Best
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <Footer primary="Continue to device" secondary="View all offers" pressed={pressed.includes("continue")} />
    </>
  );
}

function Phone({ color }: { color: string }) {
  return (
    <span className="relative block h-[78px] w-[42px] rounded-[9px] border-[2.5px] border-[#222]" style={{ background: color }}>
      <span className="absolute left-[5px] top-[5px] grid grid-cols-2 gap-[2px] rounded-[5px] bg-black/25 p-[3px]">
        <span className="h-[5px] w-[5px] rounded-full bg-[#111]" />
        <span className="h-[5px] w-[5px] rounded-full bg-[#111]" />
        <span className="h-[5px] w-[5px] rounded-full bg-[#111]" />
      </span>
    </span>
  );
}

function Devices({ pressed }: { pressed: string }) {
  const picked = pressed === "device";
  const devices = [
    { n: "Pro model, 2025", p: "$30.50/mo", c: "#f08a3c", best: true },
    { n: "Standard model", p: "$20.50/mo", c: "#7f8cf5" },
    { n: "Pro model, 2024", p: "$20.15/mo", c: "#3d3d3f" },
  ];
  return (
    <>
      <div className="px-6 pb-5 pt-4">
        <p className="mb-3 flex items-center gap-2 text-[17px] font-bold tracking-[-0.02em]">
          <Sparkle size={17} color="#111" /> Recommended devices
        </p>
        <div className="grid grid-cols-3 gap-3">
          {devices.map((d, n) => (
            <motion.div
              key={d.n}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + n * 0.12, duration: 0.4 }}
              className="relative rounded-[12px] p-[2px]"
              style={{ background: d.best ? GRADIENT : "#d6d6d6" }}
            >
              <div className="flex h-[182px] flex-col rounded-[10px] bg-white p-3.5">
                <p className="text-[14px] font-bold">{d.n}</p>
                <p className="text-[15px]">
                  {d.p} <span className="text-[12px] text-[#666]">for 36 mos</span>
                </p>
                <div className="flex flex-1 items-center justify-center">
                  <Phone color={d.c} />
                </div>
                <motion.span
                  animate={{
                    backgroundColor: d.best && picked ? "#111111" : "#ffffff",
                    color: d.best && picked ? "#ffffff" : "#111111",
                  }}
                  className="self-end rounded-full border-[1.5px] border-[#111] px-3.5 py-1 text-[12.5px] font-bold"
                >
                  {d.best && picked ? "Added" : "Select"}
                </motion.span>
              </div>
              {d.best && (
                <span className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-full bg-[#111] px-2 py-0.5 text-[11px] font-bold text-white">
                  <Sparkle size={10} color="#fff" /> Best
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <Footer primary="Continue to trade-in" secondary="All devices" />
    </>
  );
}

function CartButton({ count }: { count: number }) {
  return (
    <span className="absolute right-[34px] top-[124px] flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
      <Icon size={20} d={<><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M3 4h2.5l2.2 11h11.5l2-8H6.3" /></>} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.35, 1] }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#1d6fd8] text-[11px] font-bold text-white"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function Cart() {
  const items = [
    { n: "Pro model, 2025", s: "Upgrade, trade-in applied", p: "$4.99/mo", c: "#f08a3c" },
    { n: "Unlimited plan", s: "Line 808-272-3555", p: "$55/mo", c: "#e5262e" },
    { n: "Streaming bundle", s: "Perk", p: "$10/mo", c: "#1b3a57" },
  ];
  const totals = [
    ["Due today", "$0.00"],
    ["Current monthly", "$165.00"],
    ["New monthly", "$115.00"],
  ];
  return (
    <div className="overflow-hidden rounded-[18px] bg-[#f6f5f3] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-[19px] font-bold tracking-[-0.02em]">Cart</p>
        <span className="text-[14px] underline underline-offset-4">View together</span>
      </div>
      <div className="mx-4 rounded-[14px] border border-[#e3e0db] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[15px]">Emily&nbsp;|&nbsp;808-272-3555</p>
          <span className="rounded-[5px] bg-[#111] px-2 py-0.5 text-[11.5px] font-bold text-white">3 items</span>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((it, n) => (
            <motion.div
              key={it.n}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + n * 0.12 }}
              className="flex items-center justify-between rounded-[10px] bg-[#f6f5f3] px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <span className="h-[34px] w-[34px] rounded-[7px]" style={{ background: it.c }} />
                <div>
                  <p className="text-[14px] font-bold">{it.n}</p>
                  <p className="text-[12.5px] text-[#555]">{it.s}</p>
                </div>
              </div>
              <p className="text-[14px]">{it.p}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between bg-white px-5 py-4">
        <span className="rounded-full bg-[#111] px-6 py-3 text-[15px] font-bold text-white">Checkout</span>
        <div className="flex gap-6 text-[13px]">
          {totals.map(([k, v]) => (
            <div key={k}>
              <p className="text-[#444]">{k}</p>
              <p className="text-[15px]">{v}</p>
            </div>
          ))}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }}>
            <p className="text-[#1a9e4b]">Savings</p>
            <p className="text-[17px] font-bold text-[#1a9e4b]">$50.00/mo</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
