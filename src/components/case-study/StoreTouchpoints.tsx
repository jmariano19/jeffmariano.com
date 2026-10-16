"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * One system, every screen in the store. Roll over (or tap) a red dot on the
 * floor map and a card opens over the store with the real screens for that
 * touchpoint. On phones the card sits below the map instead.
 */

const RED = "#ee0000";
const BEIGE = "#f2ede1";

type Step = { src: string; width: number; height: number; caption: string };

type Touchpoint = {
  id: string;
  name: string;
  who: string;
  screen: string;
  pin: { x: number; y: number };
  rules: string[];
  /** Real screens, shown as a step-through. */
  steps?: Step[];
  /** A single real screen, already in its device frame. */
  shot?: { src: string; width: number; height: number; alt: string };
  /** Placeholder until real screens are supplied. */
  mock?: ReactNode;
};

/* ---------- The touchpoints ---------- */

const T = "/images/case-studies/design-systems/table";
const S39 = "/images/case-studies/design-systems/screen39";
const C = "/images/case-studies/design-systems/checkin";

const TOUCHPOINTS: Touchpoint[] = [
  {
    id: "screen39",
    name: "39-inch screen",
    who: "Customer and rep, side by side",
    screen: "Ultra-wide display at the wall",
    pin: { x: 5.2, y: 62.1 },
    rules: ["The whole account fits in one row", "Cards sized to read from a step back", "Same cards as the Collaboration tablet"],
    steps: [
      { src: `${S39}/3.webp`, width: 1920, height: 700, caption: "Every line on the account at a glance, with priority upgrades called out." },
      { src: `${S39}/0.webp`, width: 1920, height: 700, caption: "The account on one screen: overview, mobile, billing, home, perks and support as cards." },
      { src: `${S39}/2.webp`, width: 1920, height: 700, caption: "Bundles for Amy: her current plan next to three bundles, built from the same device, plan and perk cards." },
    ],
  },
  {
    id: "table",
    name: "Collaboration tablet",
    who: "Customers exploring, a rep nearby",
    screen: "Tablet on the device tables",
    pin: { x: 53.4, y: 60.4 },
    rules: ["Invites a tap, then gets personal", "Offers, devices and perks as one set of cards", "Every step works with or without a rep"],
    steps: [
      { src: `${T}/1.webp`, width: 2000, height: 1117, caption: "A customer at the device table, with a rep close by." },
      { src: `${T}/2.webp`, width: 2000, height: 1123, caption: "Tap to explore. The tablet invites them in." },
      { src: `${T}/5.webp`, width: 2000, height: 1074, caption: "A personal welcome starts the session." },
      { src: `${T}/6.webp`, width: 2000, height: 1071, caption: "Two of four devices on the account are ready to upgrade." },
      { src: `${T}/7.webp`, width: 2000, height: 1074, caption: "Just for Jamie: the best offer, device, plan and perks, all as cards. Pricing can be shown or hidden." },
      { src: `${T}/8.webp`, width: 2000, height: 1074, caption: "Choosing a phone: color, storage and how to pay." },
      { src: `${T}/10.webp`, width: 2000, height: 1072, caption: "Perks are cards too, added with one tap." },
      { src: `${T}/11.webp`, width: 2000, height: 1071, caption: "Trade-in starts from the devices already on the account." },
    ],
  },
  {
    id: "counter",
    name: "Welcome table",
    who: "Customers, as they arrive",
    screen: "Tablet on the welcome table",
    pin: { x: 68.9, y: 64 },
    rules: ["Customers check themselves in", "One choice per screen, big touch targets", "The same cards as every other screen"],
    steps: [
      { src: `${C}/1.webp`, width: 540, height: 960, caption: "Check-in: use your phone, walk in, appointment or pick-up, each one a card." },
      { src: `${C}/1a.webp`, width: 540, height: 960, caption: "Pick one or more reasons for the visit." },
      { src: `${C}/2.webp`, width: 540, height: 960, caption: "Save time while you wait: confirm the account with a text." },
      { src: `${C}/3.webp`, width: 540, height: 960, caption: "The waitlist, so customers see where they stand." },
    ],
  },
  {
    id: "phone",
    name: "Rep's tablet",
    who: "Reps, on the floor",
    screen: "Tablet the rep carries",
    pin: { x: 81.1, y: 65.6 },
    rules: ["The whole account in one view", "Mobile, home, billing and perks as the same cards", "Goes wherever the customer is"],
    shot: { src: "/images/case-studies/design-systems/rep-account.webp", width: 1282, height: 850, alt: "The rep's tablet showing a customer's account: overview, mobile, home, billing and perks as cards" },
  },
];

/* ---------- The screens for one touchpoint ---------- */

function Arrow({ dir, onClick, disabled }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous screen" : "Next screen"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d9d9d9] bg-white text-[#111] transition-colors hover:border-[#111] disabled:opacity-30 disabled:hover:border-[#d9d9d9]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function Screens({ tp }: { tp: Touchpoint }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  if (tp.shot) {
    return (
      <div className="flex justify-center">
        <Image
          src={tp.shot.src}
          alt={tp.shot.alt}
          width={tp.shot.width}
          height={tp.shot.height}
          sizes="(max-width: 768px) 92vw, 641px"
          className="h-auto w-full max-w-[641px] drop-shadow-[0_18px_30px_rgba(0,0,0,0.16)]"
        />
      </div>
    );
  }
  if (!tp.steps) return <div className="flex justify-center">{tp.mock}</div>;

  const steps = tp.steps;
  const s = steps[i];
  const ratio = `${steps[0].width} / ${steps[0].height}`;
  const portrait = steps[0].height > steps[0].width;
  const go = (d: number) => setI((n) => Math.min(steps.length - 1, Math.max(0, n + d)));

  return (
    <div>
      <div className={portrait ? "flex justify-center" : ""}>
        <div
          className={`relative overflow-hidden ${
            portrait ? "w-full max-w-[200px] rounded-[22px] border-[6px] border-[#1b1b1b] md:max-w-[240px]" : "mx-auto rounded-[14px] border border-[#ebe6da] md:rounded-[18px]"
          }`}
          style={{ aspectRatio: ratio, background: BEIGE, maxWidth: portrait ? undefined : `min(100%, ${Math.round((440 * steps[0].width) / steps[0].height)}px)` }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={s.src}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image src={s.src} alt={s.caption} fill sizes={portrait ? "240px" : "(max-width: 768px) 92vw, 760px"} className="object-contain" />
            </motion.div>
          </AnimatePresence>
          {/* Tap the left or right of the screen to move through the flow */}
          <button type="button" aria-label="Previous screen" className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize" onClick={() => go(-1)} />
          <button type="button" aria-label="Next screen" className="absolute inset-y-0 right-0 w-2/3 cursor-e-resize" onClick={() => go(1)} />
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-[760px] items-center gap-3">
        <Arrow dir="prev" onClick={() => go(-1)} disabled={i === 0} />
        <p className="min-w-0 flex-1 text-[14px] leading-[1.4] text-[#333] md:text-[15px]">
          <span className="mr-2 font-mono text-[11.5px] text-[#999]">
            {i + 1}/{steps.length}
          </span>
          {s.caption}
        </p>
        <Arrow dir="next" onClick={() => go(1)} disabled={i === steps.length - 1} />
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {steps.map((x, n) => (
          <button
            key={x.src}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Screen ${n + 1}`}
            aria-current={n === i}
            className="h-1.5 rounded-full transition-all"
            style={{ width: n === i ? 22 : 6, background: n === i ? "#111" : "#d4d4d4" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- The card that opens over the store ---------- */

function TouchpointCard({ tp, onClose }: { tp: Touchpoint; onClose?: () => void }) {
  return (
    <div className="relative grid gap-6 rounded-[22px] bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] md:items-center md:gap-10 md:rounded-[32px] md:p-10 md:pr-16">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 hidden h-9 w-9 items-center justify-center rounded-full bg-[#777] text-white transition-colors hover:bg-[#111] md:flex"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </button>
      )}
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: RED }}>
          {tp.screen}
        </p>
        <h3 className="mt-2 text-[26px] font-bold leading-[1.1] tracking-[-0.03em] text-[#111] md:text-[30px]">{tp.name}</h3>
        <p className="mt-1 text-[16px] text-[#666]">{tp.who}</p>
        <ul className="mt-5 flex flex-col border-t border-[#e8e8e8]">
          {tp.rules.map((r) => (
            <li key={r} className="border-b border-[#e8e8e8] py-2.5 text-[15px] text-[#222]">
              {r}
            </li>
          ))}
        </ul>
      </div>
      <Screens key={tp.id} tp={tp} />
    </div>
  );
}

/* ---------- The chapter piece ---------- */

export function StoreTouchpoints() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null); // desktop overlay
  const [pinned, setPinned] = useState(false); // opened by a click, stays until closed
  const [mobile, setMobile] = useState("table"); // phones: card below the map
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const close = useCallback(() => {
    setOpen(null);
    setPinned(false);
  }, []);
  const scheduleClose = () => {
    cancelClose();
    if (!pinned) closeTimer.current = setTimeout(close, 280);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const tp = TOUCHPOINTS.find((x) => x.id === open);
  const mobileTp = TOUCHPOINTS.find((x) => x.id === mobile)!;

  return (
    <div>
      {/* Extra room above and below the store so the cards open in their own space */}
      <div className="relative md:pb-4 md:pt-32">
        {/* The store, with each screen as a pin */}
        <div className="relative" style={{ aspectRatio: "3200 / 1004" }}>
          <Image
            src="/images/case-studies/design-systems/store-map-hd.webp"
            alt="A Verizon store floor with the screens the system runs on marked in red"
            fill
            sizes="(max-width: 1440px) 100vw, 1304px"
            className="object-cover"
          />
          {TOUCHPOINTS.map((x, n) => {
            const on = x.id === open;
            const onMobile = x.id === mobile;
            return (
              <button
                key={x.id}
                type="button"
                onMouseEnter={() => {
                  cancelClose();
                  if (!pinned) setOpen(x.id);
                }}
                onMouseLeave={scheduleClose}
                onClick={() => {
                  setMobile(x.id);
                  setOpen(x.id);
                  setPinned(true);
                }}
                aria-label={`Show the ${x.name.toLowerCase()}`}
                aria-expanded={x.id === open}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x.pin.x}%`, top: `${x.pin.y}%` }}
              >
                {/* A black "+" button with a soft ring, so it reads as clickable and
                    never blends into the red markers in the illustration */}
                {!reduce && (
                  <span
                    className="absolute inset-0 m-auto h-full w-full rounded-full"
                    style={{ background: "#111", animation: `eli-ripple 2.2s ease-out ${n * 0.45}s infinite` }}
                  />
                )}
                <span
                  className={`relative flex items-center justify-center rounded-full border-[3px] border-white text-white shadow-[0_6px_16px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-110 ${
                    on ? "scale-110" : ""
                  } ${onMobile ? "max-md:!bg-[#ee0000]" : ""}`}
                  style={{ background: on ? RED : "#111", width: "clamp(22px, 2.6vw, 38px)", height: "clamp(22px, 2.6vw, 38px)" }}
                >
                  <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 transition-transform duration-200" style={{ transform: on ? "rotate(45deg)" : undefined }} aria-hidden="true">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
                {/* Name tag, always visible on desktop */}
                <span
                  className={`absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-colors md:block ${
                    on ? "bg-[#ee0000] text-white" : "bg-white text-[#111] group-hover:bg-[#111] group-hover:text-white"
                  }`}
                >
                  {x.name}
                </span>
              </button>
            );
          })}
          <span className="pointer-events-none absolute bottom-3 right-4 hidden rounded-full bg-white/90 px-3 py-1.5 text-[12.5px] font-medium text-[#333] md:block">
            Roll over a + to see its screens
          </span>
        </div>

        {/* Desktop: the card opens over the store */}
        <AnimatePresence>
          {tp && (
            <motion.div
              key="card"
              className="absolute left-1/2 top-1/2 z-30 hidden w-[min(1240px,96%)] md:block"
              initial={reduce ? false : { opacity: 0, x: "-50%", y: "-46%", scale: 0.98 }}
              animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: "-50%", y: "-47%", scale: 0.985 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              onClick={() => setPinned(true)}
            >
              <TouchpointCard key={tp.id} tp={tp} onClose={close} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Phones: tabs and the card below the map */}
      <div className="md:hidden">
        <div className="mt-4 flex gap-1.5 overflow-x-auto">
          {TOUCHPOINTS.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setMobile(x.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium ${x.id === mobile ? "bg-[#111] text-white" : "bg-white text-[#111]"}`}
            >
              {x.name}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <TouchpointCard key={mobileTp.id} tp={mobileTp} />
        </div>
      </div>
    </div>
  );
}
