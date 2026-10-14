"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * How the generative UI decides what to show: three signals (the rep's
 * intent, the customer's moment, the channel) select and arrange components
 * from the library. Scenarios cycle on their own; visitors can pick one.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const BLUE = "#1f6fd1";
const GRADIENT = "linear-gradient(90deg, #f7c948, #f08a24 45%, #e5262e)";

type Block = "trend" | "breakdown" | "history" | "deals" | "device" | "savings" | "forecast";

type Scenario = {
  ask: string;
  intent: string;
  moment: string;
  channel: "Customer service" | "Retail store";
  mode: string;
  blocks: Block[];
  why: string;
};

const SCENARIOS: Scenario[] = [
  {
    ask: "Why did my bill go up?",
    intent: "Explain a bill change",
    moment: "Bill up $25 since January",
    channel: "Customer service",
    mode: "Type-first · dense",
    blocks: ["trend", "breakdown", "history"],
    why: "Lead with the change, then the line-by-line answer and what caused it.",
  },
  {
    ask: "Upgrade a line",
    intent: "Upgrade a device",
    moment: "Upgrade eligible · customer in store",
    channel: "Retail store",
    mode: "Tap-first · roomy",
    blocks: ["deals", "device"],
    why: "Lead with offers the customer qualifies for, in large cards to review together.",
  },
  {
    ask: "Help me lower my bill",
    intent: "Reduce monthly cost",
    moment: "High churn risk",
    channel: "Customer service",
    mode: "Type-first · dense",
    blocks: ["savings", "forecast", "breakdown"],
    why: "Lead with savings the rep can apply now, and show what the next bills look like.",
  },
];

const LIBRARY: { id: Block; label: string }[] = [
  { id: "trend", label: "Bill trend" },
  { id: "breakdown", label: "Bill by line" },
  { id: "history", label: "Account history" },
  { id: "deals", label: "Deals" },
  { id: "device", label: "Device card" },
  { id: "savings", label: "Savings offers" },
  { id: "forecast", label: "Bill forecast" },
];

const RULES: Record<"Intent" | "Moment" | "Channel", { v: string; e: string }> = {
  Intent: { v: "decides what to show", e: "A bill question pulls bill components. An upgrade pulls deals and devices." },
  Moment: { v: "decides what leads", e: "A $25 jump leads with the trend. A churn risk leads with savings." },
  Channel: { v: "decides how it's built", e: "Dense and keyboard-first on a desktop. Roomy and tap-first on a store tablet." },
};

const CYCLE = 8000;

export function IntentComposer() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !visible || reduce) return;
    const t = setTimeout(() => setI((n) => (n + 1) % SCENARIOS.length), CYCLE);
    return () => clearTimeout(t);
  }, [i, auto, visible, reduce]);

  const s = SCENARIOS[i];
  const retail = s.channel === "Retail store";
  const used = s.blocks;
  const unused = LIBRARY.filter((c) => !used.includes(c.id));
  const label = (id: Block) => LIBRARY.find((c) => c.id === id)!.label;
  const signals: [keyof typeof RULES, string][] = [
    ["Intent", s.intent],
    ["Moment", s.moment],
    ["Channel", `${s.channel} · ${s.mode}`],
  ];
  const swap = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } };

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[22px] md:rounded-[36px] bg-[#e7d4f4] p-4 sm:p-6 md:p-[56px]">
      <Image src="/images/case-studies/canvas/consolidation-bg.webp" alt="" fill unoptimized className="object-cover" />

      <div className="relative flex flex-col gap-6">
        {/* Title and requests */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="text-[26px] tracking-[-0.03em] text-[#111] md:text-[36px]">
              From request to <span className="font-bold">rep experience</span>
            </p>
            <p className="text-[13px] font-semibold tracking-[0.04em] text-[#1d2550]/55 md:text-[14px]">READ → PICK → COMPOSE</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
            <span className="mr-1 text-[12px] font-bold uppercase text-[#374151]">Try a request</span>
            {SCENARIOS.map((sc, n) => (
              <button
                key={sc.ask}
                type="button"
                onClick={() => {
                  setI(n);
                  setAuto(false);
                }}
                aria-pressed={n === i}
                className={`relative overflow-hidden rounded-full border px-4 py-2.5 text-[14px] transition-colors md:px-5 md:py-[13px] md:text-[16px] ${
                  n === i ? "border-[#111] bg-[#111] text-white" : "border-[#d1d5db] bg-white text-[#374151] hover:border-[#9ca3af]"
                }`}
              >
                “{sc.ask}”
                {n === i && auto && visible && !reduce && (
                  <motion.span
                    key={`bar-${i}`}
                    className="absolute bottom-0 left-0 h-[2px] bg-white/60"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: CYCLE / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 01 Read the moment */}
        <Step n="01" title="Read the moment" sub="Intent, customer context and channel" tag="Signals">
          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {signals.map(([k, v], n) => (
              <div key={k} className="flex flex-col gap-4 rounded-[12px] border border-[#eaeaea] bg-[#f9fafb] p-5">
                <div className="min-h-[69px]">
                  <p className="text-[14px] text-[#9ca3af]">{k}</p>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={v}
                      {...swap}
                      transition={{ duration: 0.4, delay: n * 0.1, ease: EASE }}
                      className="mt-2 text-[18px] leading-[1.4] text-[#111]"
                    >
                      {v}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="h-px bg-[#eaeaea]" />
                <div>
                  <p className="text-[15px] leading-[1.4] text-[#111]">
                    <span className="font-bold">{k}</span> {RULES[k].v}
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[#6b7280]">{RULES[k].e}</p>
                </div>
              </div>
            ))}
          </div>
        </Step>

        {/* 02 Pick from the library */}
        <Step n="02" title="Pick from the library" sub="Only the components this moment needs" tag="Component library">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-[#6b7280]">
              <p className="text-[12px] font-bold uppercase">Selected · display order</p>
              <p className="text-[14px]">Numbers show the order they appear in.</p>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`sel-${i}`} className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                {used.map((b, n) => (
                  <div key={b} className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-4">
                    <motion.div
                      className="flex flex-1 items-center gap-3 rounded-[12px] bg-[#242424] p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 + n * 0.15, ease: EASE }}
                    >
                      <OrderDot n={n + 1} light />
                      <span className="text-[16px] font-semibold text-white md:text-[17px]">{label(b)}</span>
                    </motion.div>
                    {n < used.length - 1 && (
                      <motion.span
                        className="hidden text-[#9ca3af] md:block"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + n * 0.15 }}
                        aria-hidden="true"
                      >
                        <Arrow />
                      </motion.span>
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2.5 md:gap-3">
            <p className="mr-1 text-[12px] font-semibold uppercase text-[#6b7280]">Not used for this moment</p>
            {unused.map((c) => (
              <motion.span
                key={c.id}
                layout
                className="rounded-[8px] border border-[#d1d5db] px-4 py-2.5 text-[14px] text-[#6b7280]"
                transition={{ duration: 0.4, ease: EASE }}
              >
                {c.label}
              </motion.span>
            ))}
          </div>
        </Step>

        {/* 03 Compose for the channel */}
        <Step n="03" title="Compose for the channel" sub="Order, density and interaction" tag="What the rep sees">
          <div className="rounded-[12px] border border-[#eaeaea] bg-[#f9fafb] p-4 md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-2 rounded-full bg-[#111] px-4 py-2.5 text-[14px] text-white md:text-[15px]">
                <Sparkle color="#fff" size={15} />
                {s.ask}
              </span>
              <span className="rounded-full border border-[#0c4baa] bg-white px-3.5 py-2 text-[13px] text-[#6b7280]">
                {retail ? "Store tablet · tap" : "Desktop · keyboard"}
              </span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`ui-${i}`}
                className={`grid gap-4 ${retail ? "md:grid-cols-[1.25fr_1fr]" : "md:grid-cols-2"}`}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                {used.map((b, n) => (
                  <motion.div
                    key={b}
                    className={!retail && n === 0 && used.length === 3 ? "md:col-span-2" : ""}
                    initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, delay: 0.35 + n * 0.15, ease: EASE }}
                  >
                    <BlockView block={b} roomy={retail} order={n + 1} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-[8px] border border-[#eaeaea] bg-[#f3f4f6] px-5 py-4">
            <span className="mt-[3px] text-[#6b7280]" aria-hidden="true">
              <Arrow />
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={s.why} {...swap} transition={{ duration: 0.4, ease: EASE }} className="text-[15px] leading-[1.5] text-[#111] md:text-[16px]">
                <span className="font-bold">Why this layout: </span>
                {s.why}
              </motion.p>
            </AnimatePresence>
          </div>
        </Step>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Step({ n, title, sub, tag, children }: { n: string; title: string; sub: string; tag: string; children: ReactNode }) {
  return (
    <motion.section
      className="rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)] md:p-8"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] bg-[#aabdfd] text-[22px] text-white">{n}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[20px] tracking-[-0.02em] text-[#111] md:text-[24px]">{title}</p>
          <p className="mt-1 text-[14px] text-[#6b7280] md:text-[16px]">{sub}</p>
        </div>
        <p className="hidden shrink-0 text-[12px] font-bold uppercase text-[#9ca3af] sm:block">{tag}</p>
      </div>
      {children}
    </motion.section>
  );
}

function Sparkle({ size = 15, color = "#e5262e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" fill={color} />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill={color} />
    </svg>
  );
}

function OrderDot({ n, light }: { n: number; light?: boolean }) {
  return (
    <span
      className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
        light ? "bg-white text-[#111]" : "bg-[#111] text-white"
      }`}
    >
      {n}
    </span>
  );
}

function Card({ title, children, roomy, order }: { title?: string; children: ReactNode; roomy?: boolean; order?: number }) {
  return (
    <div className={`h-full rounded-[12px] border border-[#eaeaea] bg-white ${roomy ? "p-6" : "p-5"}`}>
      {title && (
        <div className="mb-3 flex items-center gap-2.5">
          {order !== undefined && <OrderDot n={order} />}
          <p className={`tracking-[-0.02em] text-[#111] ${roomy ? "text-[19px] font-semibold" : "text-[17px]"}`}>{title}</p>
        </div>
      )}
      {children}
    </div>
  );
}

function TrendChart({ w }: { w: number }) {
  const mid = w / 2;
  const end = w - 24;
  return (
    <svg viewBox={`0 0 ${w} 118`} className="h-auto w-full" aria-hidden="true">
      <path d={`M24 84 L${mid - 90} 40 L${end} 40`} fill="none" stroke={BLUE} strokeWidth="2.5" strokeDasharray="7 7" />
      {(
        [
          [24, 84, "Jan", "$180.22", "start"],
          [mid, 40, "Feb", "$200.22", "middle"],
          [end, 40, "Mar", "$200.22", "end"],
        ] as const
      ).map(([x, y, m, v, anchor]) => (
        <g key={m}>
          <circle cx={x} cy={y} r="7" fill={BLUE} />
          <text x={x} y={112} textAnchor={anchor} fontSize="14" fill="#333">
            {m} {v}
          </text>
        </g>
      ))}
      <rect x={mid - 30} y="6" width="60" height="22" rx="6" fill="#eef2fb" />
      <text x={mid} y="21" textAnchor="middle" fontSize="13" fontWeight="700" fill={BLUE}>
        +$25
      </text>
    </svg>
  );
}

function BlockView({ block, roomy, order }: { block: Block; roomy: boolean; order?: number }) {
  switch (block) {
    case "trend":
      return (
        <Card order={order} title="Current total: $200.22">
          {/* Wide on desktop, compact on phones so labels stay readable. */}
          <div className="hidden md:block">
            <TrendChart w={840} />
          </div>
          <div className="md:hidden">
            <TrendChart w={420} />
          </div>
        </Card>
      );
    case "breakdown":
      return (
        <Card order={order} title="Bill by line">
          <div className="flex flex-col text-[13px]">
            {[
              ["•••0234", "$137.22", "Plan, device, perks"],
              ["•••0488", "$90.43", "Plan, device"],
              ["•••0655", "$65.00", "Plan"],
            ].map(([l, v, d]) => (
              <div key={l} className="flex items-baseline justify-between border-b border-[#eee] py-2 last:border-0">
                <span className="text-[#444]">
                  {l} <span className="text-[#999]">· {d}</span>
                </span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </Card>
      );
    case "history":
      return (
        <Card order={order} title="Recent history">
          <div className="flex flex-col gap-2 text-[13px] text-[#444]">
            <p>Feb · New device on line •••0234</p>
            <p>Feb · Promo credit ended</p>
            <div className="mt-1 rounded-[10px] border border-[#f1c9a6] bg-[#fdf5ee] px-3 py-2 text-[12.5px]">
              3 items in a shared cart from last visit
            </div>
          </div>
        </Card>
      );
    case "deals":
      return (
        <Card order={order} title="Deals for this account" roomy={roomy}>
          <div className="flex flex-col gap-2.5">
            <div className="relative rounded-[12px] p-[2px]" style={{ background: GRADIENT }}>
              <div className="flex items-center justify-between rounded-[10px] bg-white px-4 py-3.5">
                <div>
                  <p className="text-[15px] font-bold">New phone on us</p>
                  <p className="text-[13px] text-[#555]">With an eligible trade-in</p>
                </div>
                <span className="text-[18px]">›</span>
              </div>
            </div>
            {["Pro model on us with a new line", "Standard model, $5/mo"].map((d) => (
              <div key={d} className="flex items-center justify-between rounded-[12px] bg-[#f1f0ed] px-4 py-3.5 text-[14.5px]">
                {d}
                <span className="text-[18px]">›</span>
              </div>
            ))}
          </div>
        </Card>
      );
    case "device":
      return (
        <Card order={order} title="Current device" roomy={roomy}>
          <div className="flex gap-4">
            <span className="block h-[92px] w-[50px] shrink-0 rounded-[10px] border-[3px] border-[#222] bg-[#3f7f8a]" />
            <div className="text-[14px]">
              <p className="font-bold">Pro model, 2022</p>
              <p className="text-[#555]">256 GB · 732-444-4567</p>
              <p className="mt-2 text-[#555]">Current plan</p>
              <p className="font-semibold">Unlimited Welcome</p>
            </div>
          </div>
          <span className="mt-4 inline-block rounded-full border-[1.5px] border-[#111] px-5 py-2 text-[14px] font-bold">Select</span>
        </Card>
      );
    case "savings":
      return (
        <Card order={order} title="Savings to apply now">
          <div className="flex flex-col gap-2 text-[13px]">
            {[
              ["Streaming bundle swap", "Save $9.99/mo"],
              ["Autopay & paperless", "Save $10.00/mo"],
              ["Switch to a lower plan", "Save $15.00/mo"],
            ].map(([t, v]) => (
              <div key={t} className="flex items-center justify-between rounded-[10px] bg-[#f1f0ed] px-3 py-2.5">
                <div>
                  <p className="font-semibold text-[#111]">{t}</p>
                  <p className="text-[#1a9e4b]">{v}</p>
                </div>
                <span className="h-[18px] w-[18px] rounded-full border-[1.5px] border-[#999]" />
              </div>
            ))}
          </div>
        </Card>
      );
    case "forecast":
      return (
        <Card order={order} title="Next bills">
          <div className="flex h-[118px] items-end justify-around gap-3 border-b border-[#ddd] pb-0">
            {[
              ["May", 55, true],
              ["Jun", 92, false],
              ["Jul", 70, false],
            ].map(([m, h, past]) => (
              <div key={m as string} className="flex flex-col items-center gap-1.5">
                <motion.span
                  className="block w-[34px] rounded-t-[3px]"
                  style={{
                    background: past ? `repeating-linear-gradient(45deg, ${BLUE} 0 2px, #fff 2px 6px)` : BLUE,
                    border: past ? `1.5px solid ${BLUE}` : undefined,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: h as number }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex justify-around text-[12px] text-[#555]">
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
          </div>
        </Card>
      );
  }
}
