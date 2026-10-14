"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A silent, looping recreation of the AI Conversational Canvas on a tablet.
 *
 * The rep types a request, the canvas shows what it's doing (reading the
 * account, checking offers), then the interface assembles itself: a quote
 * flow with the steps it could complete already checked. The rep picks the
 * offer, the device and the trade-in, and the cart totals up the savings.
 *
 * Everything is drawn at a fixed 1180 × 775 "screen" and scaled to fit, and
 * the whole sequence is driven by one clock, so every position and time
 * below is in that design space.
 */

const W = 1180;
const H = 775;
const GRADIENT = "linear-gradient(90deg, #f7c948, #f08a24 45%, #e5262e)";
const EASE = [0.22, 1, 0.36, 1] as const;

const PROMPT = "Build Emily a quote for the new Pro phone, with her trade-in";

// Timeline, in ms.
const T = {
  focus: 1500, // tap the ask bar
  type: 1900, // typing starts
  typeEnd: 1900 + PROMPT.length * 42,
  send: 4700, // tap send
  think: 5000, // the canvas works
  build: 7600, // the quote interface assembles
  pickOffer: 10300,
  toDevice: 11200,
  devices: 11700,
  pickDevice: 13500,
  toTradeIn: 14400,
  tradeIn: 14900,
  applyTradeIn: 16600,
  allDone: 17300,
  cart: 18000,
  fadeOut: 22200,
  end: 23500,
};

// Fixed geometry for the quote card, so taps land where the controls are.
const CARD = { x: 270, y: 196, w: 740 };
const BODY_TOP = CARD.y + 62 + 80; // header + stepper

const TAPS: { t: number; x: number; y: number }[] = [
  { t: T.focus, x: 640, y: 440 },
  { t: T.send, x: 1118, y: 440 },
  { t: T.pickOffer, x: 958, y: BODY_TOP + 82 },
  { t: T.toDevice, x: 372, y: BODY_TOP + 262 + 35 },
  { t: T.pickDevice, x: 472, y: BODY_TOP + 230 },
  { t: T.toTradeIn, x: 382, y: BODY_TOP + 262 + 35 },
  { t: T.applyTradeIn, x: 905, y: BODY_TOP + 150 },
];

type Phase = "home" | "think" | "offers" | "devices" | "tradein" | "cart";

function phaseAt(t: number): Phase {
  if (t < T.think) return "home";
  if (t < T.build) return "think";
  if (t < T.devices) return "offers";
  if (t < T.tradeIn) return "devices";
  if (t < T.cart) return "tradein";
  return "cart";
}

// Every moment something on screen changes. The clock only re-renders the
// screen when it crosses one of these (or types a character), and the
// motion in between is left to the animation library, which keeps it smooth.
const CHANGES = [
  ...Object.values(T),
  T.think + 650, T.think + 700, T.think + 1350, T.think + 1400, T.think + 2050,
  T.build + 500, T.build + 750, T.build + 1600,
  T.pickOffer + 120, T.toDevice + 300, T.pickDevice + 120, T.pickDevice + 200,
  T.toTradeIn + 300, T.applyTradeIn + 120, T.applyTradeIn + 300, T.cart + 2200,
  ...TAPS.flatMap((tap) => [tap.t - 700, tap.t, tap.t + 180, tap.t + 420]),
].sort((a, b) => a - b);

function signature(t: number) {
  let passed = 0;
  while (passed < CHANGES.length && CHANGES[passed] <= t) passed++;
  const typedLen = t >= T.type && t < T.think ? Math.floor((t - T.type) / 42) : -1;
  return passed * 1000 + typedLen;
}

export default function CanvasLoop() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [visible, setVisible] = useState(true);
  const [t, setT] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // One clock drives the sequence; it only runs while on screen.
  const clock = useRef(0);
  useEffect(() => {
    if (reduce || !visible) return;
    let raf = 0;
    let last = performance.now();
    let sig = signature(clock.current);
    const tick = (now: number) => {
      clock.current = (clock.current + Math.min(now - last, 100)) % T.end;
      last = now;
      const next = signature(clock.current);
      if (next !== sig) {
        sig = next;
        setT(clock.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, visible]);

  // People who prefer reduced motion see one representative frame.
  const now = reduce ? T.pickOffer + 300 : t;
  // After the cart, everything settles back to the starting screen, so the loop restarts seamlessly.
  const resetting = now >= T.fadeOut;
  const phase: Phase = resetting ? "home" : phaseAt(now);
  const homeT = resetting ? 0 : now;
  const typed = PROMPT.slice(0, Math.max(0, Math.floor((homeT - T.type) / 42)));
  // The phone goes in first; the plan and perk carried over from the account join it once the quote is complete.
  const cartCount = resetting ? 0 : now >= T.allDone ? 3 : now >= T.pickDevice + 200 ? 1 : 0;

  // A touch point that glides to each control just before it's tapped.
  const tapIdx = TAPS.findIndex((tap) => now >= tap.t - 700 && now < tap.t + 420);
  const target = tapIdx >= 0 ? TAPS[tapIdx] : null;
  const pressed = target ? now >= target.t && now < target.t + 180 : false;
  const [lastTarget, setLastTarget] = useState(TAPS[0]);
  if (target && target !== lastTarget) setLastTarget(target);

  return (
    <div
      ref={wrap}
      className="relative w-full overflow-hidden rounded-[18px] md:rounded-[26px] bg-white"
      style={{ aspectRatio: `${W} / ${H}` }}
      role="img"
      aria-label="Animated walkthrough: a rep types a request, the AI canvas reads the account and builds a quote flow, and the rep picks the recommended offer, device and trade-in before reviewing the savings in the cart."
    >
      <div
        className="absolute left-0 top-0 origin-top-left font-[family-name:var(--font-inter)] text-[#111] will-change-transform"
        style={{ width: W, height: H, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
      >
        <StatusBar />
        <TopBar />
        <Rail />

        {/* Customer context steps aside once the canvas starts working. */}
        <motion.div
          className="absolute left-[98px] top-[112px] h-[663px] w-[288px] overflow-hidden"
          initial={false}
          animate={{ opacity: phase === "home" ? 1 : 0, x: phase === "home" ? 0 : -40 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <CustomerPanel />
        </motion.div>

        <AnimatePresence>
          {phase === "home" && (
            <motion.div
              key="home"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Home
                typed={typed}
                focused={homeT >= T.focus}
                caret={homeT >= T.focus && homeT < T.send}
                canSend={homeT >= T.typeEnd}
                sending={homeT >= T.send}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>{phase !== "home" && phase !== "cart" && <RepMessage key="msg" />}</AnimatePresence>

        {/* A soft glow behind the card while the canvas is generating. */}
        <motion.div
          className="pointer-events-none absolute rounded-[40px]"
          style={{ left: CARD.x + 40, top: CARD.y + 40, width: CARD.w - 80, height: 380, background: GRADIENT, filter: "blur(60px)" }}
          initial={false}
          animate={{ opacity: phase === "think" ? 0.28 : phase === "offers" && now < T.build + 1600 ? 0.12 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        <AnimatePresence>
          {phase === "think" && (
            <motion.div
              key="think"
              className="absolute"
              style={{ left: CARD.x, top: CARD.y, width: CARD.w }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Thinking t={now - T.think} />
            </motion.div>
          )}
          {(phase === "offers" || phase === "devices" || phase === "tradein") && (
            <motion.div
              key="quote"
              className="absolute"
              style={{ left: CARD.x, top: CARD.y, width: CARD.w }}
              initial={{ opacity: 0, y: 28, scale: 0.98, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <QuoteCard t={now} phase={phase} />
            </motion.div>
          )}
        </AnimatePresence>

        <CartButton count={cartCount} />

        <AnimatePresence>
          {phase === "cart" && (
            <motion.div
              key="cart"
              className="absolute inset-0 top-[36px] bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute left-[230px] top-[44px] w-[720px]"
                initial={{ y: 48, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <Cart t={now - T.cart} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!reduce && (
          <motion.div
            className="pointer-events-none absolute left-0 top-0"
            initial={false}
            animate={{ x: lastTarget.x, y: lastTarget.y, opacity: target ? 1 : 0 }}
            transition={{ x: { duration: 0.65, ease: EASE }, y: { duration: 0.65, ease: EASE }, opacity: { duration: 0.3 } }}
          >
            <motion.span
              className="absolute -left-[22px] -top-[22px] block h-[44px] w-[44px] rounded-full bg-[#111]/15 ring-[1.5px] ring-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] backdrop-blur-[1px]"
              animate={{ scale: pressed ? 0.78 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 26 }}
            />
            <AnimatePresence>
              {pressed && (
                <motion.span
                  key={lastTarget.t}
                  className="absolute -left-[22px] -top-[22px] block h-[44px] w-[44px] rounded-full border-2 border-[#111]/30"
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---------- Building blocks ---------- */

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

const Check = ({ size = 16 }: { size?: number }) => <Icon size={size} d={<path d="M5 12.5l4.5 4.5L19 7.5" />} />;

function Spinner() {
  return (
    <motion.span
      className="block h-[16px] w-[16px] rounded-full border-2 border-[#e5262e]/25 border-t-[#e5262e]"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="absolute -top-2.5 right-3 z-10 flex items-center gap-1 rounded-full bg-[#111] px-2 py-0.5 text-[11px] font-bold text-white">
      <Sparkle size={10} color="#fff" /> {children}
    </span>
  );
}

/* ---------- Chrome ---------- */

function StatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[36px] items-center justify-between bg-[#f6f5f3] px-[18px] text-[13px] font-medium">
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
      <span className="absolute left-[30px] top-[20px]">
        <Icon d={<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>} />
      </span>
      <div className="absolute left-[98px] top-[10px] h-[54px] w-[170px] rounded-t-[12px] bg-white px-4 pt-[9px]">
        <p className="text-[12.5px] font-semibold leading-tight">Emily Jean Stone</p>
        <p className="text-[12px] leading-tight text-[#444]">XXX-XXX-0324</p>
      </div>
      <div className="absolute right-[20px] top-[10px] flex items-center gap-[30px]">
        <Icon d={<path d="M4 7h16M4 12h16M4 17h16" />} />
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
    <div className="absolute bottom-0 left-0 top-[100px] flex w-[86px] flex-col items-center gap-[30px] border-r border-[#eee] bg-white pt-[28px]">
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
      <p className="mt-2 text-[#333]">3 lines · Pro model, 2022</p>
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

/* ---------- Home: the rep asks ---------- */

function Home({ typed, focused, caret, canSend, sending }: { typed: string; focused: boolean; caret: boolean; canSend: boolean; sending: boolean }) {
  return (
    <div className="absolute left-[398px] right-0 top-[100px] bottom-0">
      <motion.p
        className="absolute inset-x-0 top-[192px] flex items-center justify-center gap-2 text-[19px] font-bold tracking-[-0.02em]"
        animate={{ opacity: typed ? 0.35 : 1 }}
      >
        <Sparkle /> How can I help you today?
      </motion.p>
      <motion.div className="absolute inset-x-0 top-[240px] flex justify-center gap-3" animate={{ opacity: typed ? 0.35 : 1 }}>
        {["Credit check", "Plan upgrade", "Build quote"].map((c) => (
          <span key={c} className="rounded-[10px] border-[1.5px] border-[#111] bg-white px-4 py-2.5 text-[15px]">
            {c}
          </span>
        ))}
      </motion.div>
      <div className="absolute left-[31px] top-[312px] w-[720px]">
        <motion.div
          className="pointer-events-none absolute -inset-2 rounded-full"
          style={{ background: GRADIENT, filter: "blur(16px)" }}
          animate={{ opacity: focused ? 0.35 : 0 }}
          transition={{ duration: 0.4 }}
        />
        <div className="relative rounded-full p-[2px]" style={{ background: GRADIENT }}>
          <div className="flex h-[54px] items-center justify-between rounded-full bg-white pl-5 pr-2 text-[15px]">
            <span className={typed ? "text-[#111]" : "text-[#777]"}>
              {typed || (focused ? "" : "Search or ask")}
              {caret && <span className="ml-[1px] inline-block h-[18px] w-[1.5px] translate-y-[3px] animate-pulse bg-[#111]" />}
            </span>
            <motion.span
              className="flex h-[40px] w-[40px] items-center justify-center rounded-full"
              animate={{ backgroundColor: canSend ? "#111111" : "#ffffff", color: canSend ? "#ffffff" : "#111111", scale: sending ? 0.9 : 1 }}
              transition={{ duration: 0.25 }}
            >
              {canSend ? (
                <Icon size={18} d={<path d="M12 19V5M5 12l7-7 7 7" />} />
              ) : (
                <Icon size={20} d={<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>} />
              )}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The rep's request stays visible above whatever the canvas builds. */
function RepMessage() {
  return (
    <motion.div
      className="absolute flex justify-end"
      style={{ left: CARD.x, top: 124, width: CARD.w }}
      initial={{ opacity: 0, y: 190, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.75, ease: EASE }}
    >
      <span className="rounded-[18px] rounded-br-[6px] bg-[#111] px-4 py-2.5 text-[14.5px] text-white">{PROMPT}</span>
    </motion.div>
  );
}

/* ---------- The canvas at work ---------- */

const THINK_STEPS = ["Reading Emily's account and lines", "Checking offers and trade-in eligibility", "Assembling the quote"];

function Thinking({ t }: { t: number }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#ece9e4] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <p className="flex items-center gap-2 text-[16px] font-bold">
        <span className="canvas-pulse inline-flex">
          <Sparkle />
        </span>
        Working on it
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {THINK_STEPS.map((s, n) => {
          const start = n * 700;
          if (t < start) return null;
          const done = t > start + 650;
          return (
            <motion.div key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 text-[14.5px]">
              <span className="flex h-[20px] w-[20px] items-center justify-center text-[#1a9e4b]">{done ? <Check /> : <Spinner />}</span>
              <span className={done ? "text-[#555]" : "text-[#111]"}>{s}</span>
            </motion.div>
          );
        })}
      </div>
      {/* The shape of what's coming */}
      <div className="mt-6 flex flex-col gap-2.5">
        {[1, 0.86, 0.72].map((w, n) => (
          <div key={n} className="canvas-shimmer h-[46px] rounded-[10px]" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Generated interface: the quote ---------- */

const STEPPER = ["Offers", "Device", "Trade-in", "Plan", "Protection", "Perks"];

function QuoteCard({ t, phase }: { t: number; phase: "offers" | "devices" | "tradein" }) {
  const active = phase === "offers" ? 0 : phase === "devices" ? 1 : t >= T.applyTradeIn + 300 ? -1 : 2;
  // Steps the AI completes from the account tick off one by one as the card builds.
  const done = new Set<number>();
  if (t > T.build + 500) done.add(3);
  if (t > T.build + 750) done.add(5);
  if (t > T.toDevice) done.add(0);
  if (t > T.toTradeIn) done.add(1);
  if (t > T.applyTradeIn + 300) done.add(2);
  if (t > T.allDone) done.add(4);

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#e6e3de] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <div className="flex h-[62px] items-center justify-between bg-[#f6f5f3] px-5">
        <p className="flex items-center gap-2 text-[18px] font-bold tracking-[-0.02em]">Quote configuration</p>
        <div className="flex items-center gap-2">
          <span className="rounded-[8px] border border-[#111] bg-white px-3 py-1.5 text-[14px]">808-272-3555 ▾</span>
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-[18px] leading-none">⋮</span>
        </div>
      </div>
      <div className="flex h-[80px] items-center justify-between border-b border-[#eee] px-6">
        {STEPPER.map((s, n) => {
          const isDone = done.has(n) && n !== active;
          return (
            <div key={s} className="flex w-[90px] flex-col items-center gap-1.5">
              <motion.span
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1.5px]"
                animate={{
                  backgroundColor: n === active ? "#222222" : isDone ? "#effaf3" : "#ffffff",
                  borderColor: isDone ? "#1a9e4b" : n === active ? "#222222" : "#d0d0d0",
                  color: n === active ? "#ffffff" : isDone ? "#1a9e4b" : "#555555",
                }}
                transition={{ duration: 0.35 }}
              >
                {isDone ? (
                  <motion.span key="done" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }}>
                    <Check size={18} />
                  </motion.span>
                ) : (
                  <span className="h-[12px] w-[9px] rounded-[2px] border-[1.5px] border-current" />
                )}
              </motion.span>
              <span className={`text-[12px] ${n === active ? "font-bold" : "text-[#444]"}`}>{s}</span>
            </div>
          );
        })}
      </div>

      <div className="relative h-[262px] overflow-hidden">
        <AnimatePresence initial={false}>
          {phase === "offers" && (
            <motion.div key="offers" className="absolute inset-0" exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.55, ease: EASE }}>
              <Offers picked={t >= T.pickOffer + 120} />
            </motion.div>
          )}
          {phase === "devices" && (
            <motion.div key="devices" className="absolute inset-0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.55, ease: EASE }}>
              <Devices picked={t >= T.pickDevice + 120} />
            </motion.div>
          )}
          {phase === "tradein" && (
            <motion.div key="tradein" className="absolute inset-0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, ease: EASE }}>
              <TradeIn applied={t >= T.applyTradeIn + 120} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer
        primary={phase === "offers" ? "Continue to device" : phase === "devices" ? "Continue to trade-in" : "Review cart"}
        secondary={phase === "offers" ? "View all offers" : phase === "devices" ? "All devices" : "Skip trade-in"}
        pressed={(t >= T.toDevice && t < T.toDevice + 300) || (t >= T.toTradeIn && t < T.toTradeIn + 300)}
      />
    </div>
  );
}

function Footer({ primary, secondary, pressed }: { primary: string; secondary: string; pressed?: boolean }) {
  return (
    <div className="flex h-[70px] items-center justify-between bg-[#f6f5f3] px-5">
      <div className="flex gap-2.5">
        <motion.span animate={{ scale: pressed ? 0.94 : 1 }} className="rounded-full bg-[#111] px-5 py-2.5 text-[14.5px] font-bold text-white">
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

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="flex h-[54px] items-center gap-2 text-[17px] font-bold tracking-[-0.02em]">
      <Sparkle size={17} color="#111" /> {children}
    </p>
  );
}

function Offers({ picked }: { picked: boolean }) {
  const offers = [
    { t: "Choose any plan, get the new phone on us", d: "With an eligible trade-in. Any condition guaranteed.", best: true },
    { t: "New phone on us with a new line", d: "Even on the lowest-priced plans. No trade-in required." },
    { t: "Pro model for $100", d: "Via 36 monthly bill credits with a trade-in and new line." },
  ];
  return (
    <div className="px-6">
      <SectionTitle>Recommended offers</SectionTitle>
      <div className="flex flex-col gap-2.5">
        {offers.map((o, n) => (
          <motion.div
            key={o.t}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + n * 0.16, duration: 0.45, ease: EASE }}
            className="relative rounded-[12px] p-[2px]"
            style={{ background: o.best ? GRADIENT : "#d9d6d1" }}
          >
            {o.best && (
              <motion.span
                className="pointer-events-none absolute -inset-1 rounded-[15px]"
                style={{ background: GRADIENT, filter: "blur(10px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.22 }}
                transition={{ delay: 1, duration: 1.2 }}
              />
            )}
            <div className="relative flex h-[56px] items-center justify-between rounded-[10px] bg-white px-4">
              <div className="flex items-center gap-3">
                <Icon size={20} d={<><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8" r="1.4" /></>} />
                <div>
                  <p className="text-[14px] font-bold">{o.t}</p>
                  <p className="text-[12.5px] text-[#555]">{o.d}</p>
                </div>
              </div>
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#111]">
                {o.best && picked && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-[12px] w-[12px] rounded-full bg-[#111]" />}
              </span>
            </div>
            {o.best && <Badge>Best for Emily</Badge>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Phone({ color }: { color: string }) {
  return (
    <span className="relative block h-[74px] w-[40px] rounded-[9px] border-[2.5px] border-[#222]" style={{ background: color }}>
      <span className="absolute left-[4px] top-[4px] grid grid-cols-2 gap-[2px] rounded-[5px] bg-black/25 p-[3px]">
        <span className="h-[5px] w-[5px] rounded-full bg-[#111]" />
        <span className="h-[5px] w-[5px] rounded-full bg-[#111]" />
        <span className="h-[5px] w-[5px] rounded-full bg-[#111]" />
      </span>
    </span>
  );
}

function Devices({ picked }: { picked: boolean }) {
  const devices = [
    { n: "Pro model, 2025", p: "$30.50/mo", c: "#f08a3c", best: true },
    { n: "Standard model", p: "$20.50/mo", c: "#7f8cf5" },
    { n: "Pro model, 2024", p: "$20.15/mo", c: "#3d3d3f" },
  ];
  return (
    <div className="px-6">
      <SectionTitle>Recommended devices</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {devices.map((d, n) => (
          <motion.div
            key={d.n}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + n * 0.12, duration: 0.4, ease: EASE }}
            className="relative rounded-[12px] p-[2px]"
            style={{ background: d.best ? GRADIENT : "#d9d6d1" }}
          >
            <div className="flex h-[186px] flex-col rounded-[10px] bg-white p-3.5">
              <p className="text-[14px] font-bold">{d.n}</p>
              <p className="text-[15px]">
                {d.p} <span className="text-[12px] text-[#666]">for 36 mos</span>
              </p>
              <div className="flex flex-1 items-center justify-center">
                <Phone color={d.c} />
              </div>
              <motion.span
                animate={{ backgroundColor: d.best && picked ? "#111111" : "#ffffff", color: d.best && picked ? "#ffffff" : "#111111" }}
                className="flex items-center gap-1 self-end rounded-full border-[1.5px] border-[#111] px-3.5 py-1 text-[12.5px] font-bold"
              >
                {d.best && picked ? <><Check size={13} /> Added</> : "Select"}
              </motion.span>
            </div>
            {d.best && <Badge>Best</Badge>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TradeIn({ applied }: { applied: boolean }) {
  return (
    <div className="px-6">
      <SectionTitle>Trade-in found on Emily&apos;s account</SectionTitle>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
        className="relative rounded-[12px] p-[2px]"
        style={{ background: GRADIENT }}
      >
        <div className="flex items-center gap-5 rounded-[10px] bg-white p-4">
          <Phone color="#5b6b7a" />
          <div className="flex-1">
            <p className="text-[15px] font-bold">Pro model, 2022 · 256 GB</p>
            <p className="text-[13px] text-[#555]">On line 808-272-3555 · any condition guaranteed</p>
            <div className="mt-3 flex gap-6 text-[13px]">
              <div>
                <p className="text-[#666]">Trade-in credit</p>
                <p className="text-[18px] font-bold">$400</p>
              </div>
              <div>
                <p className="text-[#666]">Applied over</p>
                <p className="text-[18px] font-bold">36 mos</p>
              </div>
            </div>
          </div>
          <motion.span
            animate={{ backgroundColor: applied ? "#1a9e4b" : "#111111" }}
            className="flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[14px] font-bold text-white"
          >
            {applied ? <><Check size={15} /> Applied</> : "Apply trade-in"}
          </motion.span>
        </div>
        <Badge>Detected</Badge>
      </motion.div>
      <p className="mt-3 text-[13px] text-[#666]">Plan and perks carried over from the account. Protection can be added at checkout.</p>
    </div>
  );
}

function CartButton({ count }: { count: number }) {
  return (
    <span className="absolute right-[34px] top-[124px] flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
      <Icon size={20} d={<><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M3 4h2.5l2.2 11h11.5l2-8H6.3" /></>} />
      <AnimatePresence mode="popLayout">
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 600, damping: 14 }}
            className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#1d6fd8] text-[11px] font-bold text-white"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ---------- Cart ---------- */

function Cart({ t }: { t: number }) {
  const items = [
    { n: "Pro model, 2025", s: "Upgrade with $400 trade-in", p: "$4.99/mo", c: "#f08a3c" },
    { n: "Unlimited plan", s: "Kept from the account", p: "$55/mo", c: "#e5262e" },
    { n: "Streaming bundle", s: "Perk", p: "$10/mo", c: "#1b3a57" },
  ];
  const savings = useMotionValue(0);
  const savingsText = useTransform(savings, (v) => `$${v.toFixed(2)}/mo`);
  useEffect(() => {
    const run = animate(savings, 50, { delay: 1.2, duration: 1.1, ease: EASE });
    return () => run.stop();
  }, [savings]);
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
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + n * 0.14, ease: EASE }}
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
          {[
            ["Due today", "$0.00"],
            ["Current monthly", "$165.00"],
            ["New monthly", "$115.00"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[#444]">{k}</p>
              <p className="text-[15px]">{v}</p>
            </div>
          ))}
          <div className="relative">
            {t > 2200 && (
              <motion.span
                className="pointer-events-none absolute -inset-2 rounded-[10px] bg-[#1a9e4b]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.08 }}
                transition={{ duration: 0.6 }}
              />
            )}
            <p className="relative text-[#1a9e4b]">Savings</p>
            <motion.p className="relative text-[17px] font-bold tabular-nums text-[#1a9e4b]">{savingsText}</motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
