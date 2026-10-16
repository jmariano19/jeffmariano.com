"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

/**
 * One system, every screen in the store. Pick a touchpoint on the floor map
 * and the same retail components re-render for that screen: who is using it,
 * how far away they stand, and what the theme changes to fit.
 */

const RED = "#ee0000";

type Touchpoint = {
  id: string;
  name: string;
  who: string;
  screen: string;
  size: string;
  pin: { x: number; y: number };
  rules: string[];
  /** Placeholder until a real screen is supplied. */
  mock: ReactNode;
  /** A real screen from the store. When set, it replaces the mock. */
  shot?: { src: string; width: number; height: number; alt: string };
};

/** A real screenshot, framed like the device it runs on. */
function Shot({ shot }: { shot: NonNullable<Touchpoint["shot"]> }) {
  const tall = shot.height > shot.width;
  return (
    <div className={`rounded-[16px] bg-[#1b1b1b] p-[6px] ${tall ? "w-[150px] md:w-[170px]" : "w-full max-w-[460px]"}`}>
      <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 768px) 90vw, 560px" className="h-auto w-full rounded-[11px]" />
    </div>
  );
}

/* ---------- The shared card, the one component every screen reuses ---------- */

function Card({ title, line, scale = 1, selected = false, tone }: { title: string; line?: string; scale?: number; selected?: boolean; tone?: string }) {
  return (
    <div
      className="flex flex-col rounded-[10px] bg-white"
      style={{
        padding: 8 * scale,
        gap: 4 * scale,
        boxShadow: selected ? `0 0 0 ${2 * scale}px #111` : "0 1px 3px rgba(0,0,0,0.12)",
      }}
    >
      {tone && <div className="rounded-[6px]" style={{ height: 34 * scale, background: tone }} />}
      <span className="block font-bold leading-[1.15] tracking-[-0.02em] text-[#111]" style={{ fontSize: 9 * scale }}>
        {title}
      </span>
      {line && (
        <span className="block leading-[1.3] text-[#666]" style={{ fontSize: 6.5 * scale }}>
          {line}
        </span>
      )}
    </div>
  );
}

function Button({ label, scale = 1, dark = true }: { label: string; scale?: number; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold ${dark ? "bg-[#111] text-white" : "border border-[#111] text-[#111]"}`}
      style={{ fontSize: 7 * scale, height: 18 * scale, padding: `0 ${10 * scale}px` }}
    >
      {label}
    </span>
  );
}

/* ---------- One mock per screen ---------- */

const TOUCHPOINTS: Touchpoint[] = [
  {
    id: "kiosk",
    name: "Welcome kiosk",
    who: "Customers, on their own",
    screen: "Large landscape touch screen",
    size: "XL",
    pin: { x: 5.2, y: 62.1 },
    rules: ["Type scaled up to read from a step back", "Big touch targets for a standing reach", "One choice per screen, no rep needed"],
    mock: (
      <div className="w-full max-w-[460px] rounded-[14px] bg-[#1b1b1b] p-[6px]">
        <div className="rounded-[9px] bg-[#f6f6f6] p-4">
          <p className="text-[19px] font-bold tracking-[-0.03em]" style={{ color: RED }}>
            Start your plan here
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            <Card title="Plans" line="Find yours" tone="#f3c5bd" scale={1.15} />
            <Card title="Protect" line="Cover your device" tone="#e8d3b8" scale={1.15} />
            <Card title="Home" line="Internet at home" tone="#d7d4ce" scale={1.15} />
            <Card title="Trade in" line="See what it's worth" tone="#f1b3a8" scale={1.15} />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "table",
    name: "Device table",
    who: "Customers, browsing",
    screen: "Small tablet beside each phone",
    size: "M",
    pin: { x: 53.4, y: 60.4 },
    rules: ["Short, scannable specs", "One clear next step: talk to a rep", "Same card, tighter spacing"],
    mock: (
      <div className="w-[220px] rounded-[14px] bg-[#1b1b1b] p-[6px]">
        <div className="flex flex-col gap-2 rounded-[9px] bg-[#f6f6f6] p-3">
          <div className="flex items-center gap-2">
            <div className="h-[46px] w-[24px] rounded-[5px] bg-[#222]" />
            <div>
              <p className="text-[11px] font-bold tracking-[-0.02em]">This phone</p>
              <p className="text-[8px] text-[#666]">Compare it with yours</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <Card title="Camera" line="Best in its class" />
            <Card title="Battery" line="All-day" />
          </div>
          <Button label="Talk to a rep" />
        </div>
      </div>
    ),
  },
  {
    id: "counter",
    name: "Counter tablet",
    who: "Rep and customer, together",
    screen: "Tablet the rep turns to share",
    size: "L",
    pin: { x: 68.9, y: 64 },
    rules: ["Readable from both sides of the counter", "Rep picks the card that fits the conversation", "Selected state clear at a glance"],
    mock: (
      <div className="w-full max-w-[330px] rounded-[16px] bg-[#1b1b1b] p-[7px]">
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
    name: "Rep's phone",
    who: "Reps, on the floor",
    screen: "Phone in the rep's hand",
    size: "S",
    pin: { x: 81.1, y: 65.6 },
    rules: ["Glanceable in one hand", "Dense, but the same cards", "Hands off to the counter tablet"],
    mock: (
      <div className="w-[130px] rounded-[20px] bg-[#1b1b1b] p-[5px]">
        <div className="flex flex-col gap-1.5 rounded-[16px] bg-[#f6f6f6] px-2 pb-3 pt-4">
          <p className="text-[9px] font-bold tracking-[-0.02em]">Next up</p>
          <Card title="Maria · Upgrade" line="Waiting 4 min" selected />
          <Card title="James · Bill question" line="Waiting 9 min" />
          <Card title="Ana · New line" line="Booked 2:30" />
          <span className="mt-1 flex justify-center">
            <Button label="Start with Maria" />
          </span>
        </div>
      </div>
    ),
  },
];

export function StoreTouchpoints() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState("counter");
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
                className={`absolute left-1/2 top-full mt-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold md:block ${
                  on ? "bg-[#111] text-white" : "bg-white/90 text-[#111] opacity-0 group-hover:opacity-100"
                } transition-opacity`}
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

      {/* The same components, rendered for that screen */}
      <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-10 md:p-10">
        <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[18px] bg-[#f1efe9] p-5 md:min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              className="flex w-full justify-center md:scale-[1.2]"
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {t.shot ? <Shot shot={t.shot} /> : t.mock}
            </motion.div>
          </AnimatePresence>
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 font-mono text-[11px] text-[#555]">size: {t.size}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col justify-center"
          >
            <p className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: RED }}>
              {t.screen}
            </p>
            <h3 className="mt-2 text-[26px] font-bold leading-[1.1] tracking-[-0.03em] text-[#111] md:text-[32px]">{t.name}</h3>
            <p className="mt-1 text-[16px] text-[#666]">{t.who}</p>
            <ul className="mt-5 flex flex-col border-t border-[#e5e5e5]">
              {t.rules.map((r) => (
                <li key={r} className="border-b border-[#e5e5e5] py-2.5 text-[15.5px] text-[#222]">
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13.5px] text-[#888]">Same cards, buttons and tokens. Only the retail theme&apos;s size changes.</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
