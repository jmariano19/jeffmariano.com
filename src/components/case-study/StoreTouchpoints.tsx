"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

/**
 * One system, every screen in the store. Pick a touchpoint on the floor map
 * and walk through the real screens for it, step by step. Touchpoints whose
 * screens haven't been added yet show a simple placeholder.
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

/* ---------- Placeholder pieces ---------- */

function Card({ title, line, selected = false }: { title: string; line?: string; selected?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-[10px] bg-white p-2" style={{ boxShadow: selected ? "0 0 0 2px #111" : "0 1px 3px rgba(0,0,0,0.12)" }}>
      <span className="block text-[9px] font-bold leading-[1.15] tracking-[-0.02em] text-[#111]">{title}</span>
      {line && <span className="block text-[6.5px] leading-[1.3] text-[#666]">{line}</span>}
    </div>
  );
}

function Button({ label, dark = true }: { label: string; dark?: boolean }) {
  return (
    <span
      className={`inline-flex h-[18px] items-center justify-center rounded-full px-2.5 text-[7px] font-semibold ${dark ? "bg-[#111] text-white" : "border border-[#111] text-[#111]"}`}
    >
      {label}
    </span>
  );
}

/* ---------- The touchpoints ---------- */

const T = "/images/case-studies/design-systems/table";
const S39 = "/images/case-studies/design-systems/screen39";

const TOUCHPOINTS: Touchpoint[] = [
  {
    id: "screen39",
    name: "39-inch screen",
    who: "Customer and rep, side by side",
    screen: "Ultra-wide display at the wall",
    pin: { x: 5.2, y: 62.1 },
    rules: ["The whole account fits in one row", "Cards sized to read from a step back", "Same cards as the table tablet"],
    steps: [
      { src: `${S39}/3.webp`, width: 1920, height: 700, caption: "Every line on the account at a glance, with priority upgrades called out." },
      { src: `${S39}/0.webp`, width: 1920, height: 700, caption: "The account on one screen: overview, mobile, billing, home, perks and support as cards." },
      { src: `${S39}/2.webp`, width: 1920, height: 700, caption: "Bundles for Amy: her current plan next to three bundles, built from the same device, plan and perk cards." },
    ],
  },
  {
    id: "table",
    name: "Table tablet",
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
    name: "Counter tablet",
    who: "Rep and customer, together",
    screen: "Tablet the rep turns to share",
    pin: { x: 68.9, y: 64 },
    rules: ["Readable from both sides of the counter", "Rep picks the card that fits the conversation", "Selected state clear at a glance"],
    mock: (
      <div className="w-full max-w-[330px] rounded-[16px] bg-[#1b1b1b] p-[7px] md:scale-[1.2]">
        <div className="rounded-[10px] bg-[#f6f6f6] p-3.5">
          <p className="text-[12px] font-bold tracking-[-0.02em]">Plans for Maria</p>
          <p className="text-[8px] text-[#666]">2 lines · upgrading</p>
          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            <Card title="Starter" line="The basics" />
            <Card title="Plus" line="More data, perks" selected />
            <Card title="Ultimate" line="Everything" />
          </div>
          <div className="mt-2.5 flex gap-1.5">
            <Button label="Review together" />
            <Button label="Compare" dark={false} />
          </div>
        </div>
      </div>
    ),
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

/* ---------- Step-through of real screens ---------- */

function Arrow({ dir, onClick, disabled }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous screen" : "Next screen"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d9d9d9] bg-white text-[#111] transition-colors hover:border-[#111] disabled:opacity-30 disabled:hover:border-[#d9d9d9]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function Steps({ tp }: { tp: Touchpoint }) {
  const reduce = useReducedMotion();
  const steps = tp.steps!;
  const [i, setI] = useState(0);
  const s = steps[i];
  const ratio = `${steps[0].width} / ${steps[0].height}`;

  return (
    <div>
      <div className="relative overflow-hidden rounded-[16px] border border-[#ebe6da] md:rounded-[22px]" style={{ aspectRatio: ratio, background: BEIGE }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={s.src}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Image src={s.src} alt={s.caption} fill sizes="(max-width: 1440px) 100vw, 1220px" className="object-contain" priority={i === 0} />
          </motion.div>
        </AnimatePresence>
        {/* Tap either half of the screen to move through the flow */}
        <button type="button" aria-label="Previous screen" className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize" onClick={() => setI((n) => Math.max(0, n - 1))} />
        <button type="button" aria-label="Next screen" className="absolute inset-y-0 right-0 w-2/3 cursor-e-resize" onClick={() => setI((n) => Math.min(steps.length - 1, n + 1))} />
      </div>

      <div className="mt-4 flex items-center gap-3 md:mt-5 md:gap-4">
        <Arrow dir="prev" onClick={() => setI((n) => Math.max(0, n - 1))} disabled={i === 0} />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11.5px] text-[#999]">
            {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={i}
              className="text-[15px] leading-[1.45] text-[#222] md:text-[17px]"
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {s.caption}
            </motion.p>
          </AnimatePresence>
        </div>
        <Arrow dir="next" onClick={() => setI((n) => Math.min(steps.length - 1, n + 1))} disabled={i === steps.length - 1} />
      </div>

      {/* The whole flow as thumbnails */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 md:mt-5">
        {steps.map((x, n) => (
          <button
            key={x.src}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Screen ${n + 1}`}
            aria-current={n === i}
            className={`relative shrink-0 overflow-hidden rounded-[8px] transition-all ${n === i ? "opacity-100 ring-2 ring-[#111] ring-offset-2" : "opacity-55 hover:opacity-90"}`}
            style={{ width: steps[0].width / steps[0].height > 2 ? 132 : 96, aspectRatio: ratio, background: BEIGE }}
          >
            <Image src={x.src} alt="" fill sizes="140px" className="object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- The chapter piece ---------- */

export function StoreTouchpoints() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState("table");
  const t = TOUCHPOINTS.find((x) => x.id === active)!;

  return (
    <div className="overflow-hidden rounded-[22px] bg-white md:rounded-[36px]">
      {/* The store, with each screen as a pin */}
      <div className="relative" style={{ aspectRatio: "3200 / 1003" }}>
        <Image
          src="/images/case-studies/design-systems/store-map-hd.webp"
          alt="A Verizon store floor with the screens the system runs on marked in red"
          fill
          sizes="(max-width: 1440px) 100vw, 1304px"
          className="object-cover"
        />
        {TOUCHPOINTS.map((x, n) => {
          const on = x.id === active;
          return (
            <button
              key={x.id}
              type="button"
              onClick={() => setActive(x.id)}
              aria-label={`Show the ${x.name.toLowerCase()}`}
              aria-pressed={on}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x.pin.x}%`, top: `${x.pin.y}%` }}
            >
              {!reduce && (
                <span
                  className="absolute inset-0 m-auto h-full w-full rounded-full"
                  style={{ background: on ? "#111" : RED, animation: `eli-ripple ${on ? 1.6 : 2.4}s ease-out ${on ? 0 : n * 0.5}s infinite` }}
                />
              )}
              <span
                className="relative block rounded-full border-2 border-white transition-transform group-hover:scale-110"
                style={{ background: on ? "#111" : RED, width: "clamp(14px, 2.2vw, 30px)", height: "clamp(14px, 2.2vw, 30px)" }}
              />
              <span
                className={`absolute left-1/2 top-full mt-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold transition-opacity md:block ${
                  on ? "bg-[#111] text-white" : "bg-white/90 text-[#111] opacity-0 group-hover:opacity-100"
                }`}
              >
                {x.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabs, so phones don't depend on the small pins */}
      <div className="flex gap-1.5 overflow-x-auto border-t border-[#eee] px-4 pt-4 md:hidden">
        {TOUCHPOINTS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setActive(x.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium ${x.id === active ? "bg-[#111] text-white" : "bg-[#f1f1f1] text-[#111]"}`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-10">
        {/* What this screen is, and what the system does there */}
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-end md:gap-10"
          >
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: RED }}>
                {t.screen}
              </p>
              <h3 className="mt-2 text-[26px] font-bold leading-[1.1] tracking-[-0.03em] text-[#111] md:text-[32px]">{t.name}</h3>
              <p className="mt-1 text-[16px] text-[#666]">{t.who}</p>
            </div>
            <ul className="flex flex-wrap gap-2 md:justify-end">
              {t.rules.map((r) => (
                <li key={r} className="rounded-full bg-[#f3f3f3] px-3.5 py-2 text-[13.5px] text-[#333]">
                  {r}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 md:mt-8">
          {t.steps ? (
            <Steps key={t.id} tp={t} />
          ) : t.shot ? (
            <div className="flex items-center justify-center rounded-[18px] bg-[#f1efe9] px-4 py-8 md:px-10 md:py-12">
              {/* Shown at no more than half its pixel width so it stays sharp */}
              <Image
                src={t.shot.src}
                alt={t.shot.alt}
                width={t.shot.width}
                height={t.shot.height}
                sizes="(max-width: 768px) 92vw, 641px"
                className="h-auto w-full max-w-[641px] drop-shadow-[0_24px_40px_rgba(0,0,0,0.18)]"
              />
            </div>
          ) : (
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[18px] bg-[#f1efe9] p-6 md:min-h-[420px]">
              {t.mock}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
