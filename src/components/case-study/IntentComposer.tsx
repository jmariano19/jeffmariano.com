"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
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

export function IntentComposer() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !visible || reduce) return;
    const t = setTimeout(() => setI((n) => (n + 1) % SCENARIOS.length), 6000);
    return () => clearTimeout(t);
  }, [i, auto, visible, reduce]);

  const s = SCENARIOS[i];
  const retail = s.channel === "Retail store";

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[22px] md:rounded-[36px] bg-[#cfc9ec] p-4 sm:p-6 md:p-[5%]">
      <Image src="/images/case-studies/canvas/consolidation-bg.webp" alt="" fill unoptimized className="object-cover" />

      <div className="relative grid gap-4 lg:grid-cols-[300px_1fr] lg:gap-6">
        {/* The signals the canvas reads */}
        <div className="flex flex-col gap-3">
          <div className="rounded-[20px] bg-white/90 p-4 shadow-[0_14px_40px_rgba(40,40,110,0.10)] backdrop-blur md:p-5">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#1d2550]">The rep asks</p>
            <div className="mt-3 flex flex-col gap-2">
              {SCENARIOS.map((sc, n) => (
                <button
                  key={sc.ask}
                  type="button"
                  onClick={() => {
                    setI(n);
                    setAuto(false);
                  }}
                  className={`relative overflow-hidden rounded-[12px] px-3.5 py-2.5 text-left text-[14.5px] transition-colors ${
                    n === i ? "bg-[#111] text-white" : "bg-[#f3f2ef] text-[#333] hover:bg-[#ebe9e5]"
                  }`}
                >
                  “{sc.ask}”
                  {n === i && auto && visible && !reduce && (
                    <motion.span
                      key={`bar-${i}`}
                      className="absolute bottom-0 left-0 h-[2px] bg-white/60"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 6, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] bg-white/90 p-4 shadow-[0_14px_40px_rgba(40,40,110,0.10)] backdrop-blur md:p-5">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#1d2550]">Signals the canvas reads</p>
            <dl className="mt-3 flex flex-col gap-3 text-[14px]">
              {[
                ["Intent", s.intent],
                ["Moment", s.moment],
                ["Channel", `${s.channel} · ${s.mode}`],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[12px] text-[#888]">{k}</dt>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.dd
                      key={v}
                      className="font-semibold text-[#111]"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      {v}
                    </motion.dd>
                  </AnimatePresence>
                </div>
              ))}
            </dl>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={s.why}
                className="mt-4 border-t border-[#eee] pt-3 text-[13.5px] leading-[1.55] text-[#555]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {s.why}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* The interface it composes */}
        <div className="rounded-[22px] bg-white p-4 shadow-[0_24px_60px_rgba(40,40,110,0.16)] md:p-5">
          <div className="flex items-center justify-between gap-3 border-b border-[#eee] pb-3">
            <div className="flex items-center gap-2 rounded-full bg-[#111] px-3.5 py-1.5 text-[13.5px] text-white">
              <Sparkle color="#fff" size={13} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={s.ask} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  {s.ask}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="rounded-full border border-[#ddd] px-3 py-1 text-[12px] text-[#555]">{retail ? "Tablet · tap" : "Desktop · keyboard"}</span>
          </div>

          <LayoutGroup>
            <motion.div
              layout
              className={`mt-4 grid gap-3 ${retail ? "md:grid-cols-[1.2fr_1fr]" : "md:grid-cols-2"}`}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {s.blocks.map((b, n) => (
                  <motion.div
                    key={`${i}-${b}`}
                    layout
                    className={!retail && n === 0 && s.blocks.length === 3 ? "md:col-span-2" : ""}
                    initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                    transition={{ duration: 0.6, delay: 0.1 + n * 0.12, ease: EASE }}
                  >
                    <BlockView block={b} roomy={retail} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </div>
    </div>
  );
}

/* ---------- Library components, drawn simply ---------- */

function Sparkle({ size = 15, color = "#e5262e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" fill={color} />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill={color} />
    </svg>
  );
}

function Card({ title, children, roomy }: { title?: string; children: ReactNode; roomy?: boolean }) {
  return (
    <div className={`h-full rounded-[16px] border border-[#ecebe8] bg-[#fbfbfa] ${roomy ? "p-5" : "p-4"}`}>
      {title && <p className={`mb-3 font-bold tracking-[-0.02em] ${roomy ? "text-[17px]" : "text-[15px]"}`}>{title}</p>}
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

function BlockView({ block, roomy }: { block: Block; roomy: boolean }) {
  switch (block) {
    case "trend":
      return (
        <Card title="Current total: $200.22">
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
        <Card title="Bill by line">
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
        <Card title="Recent history">
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
        <Card title="Deals for this account" roomy={roomy}>
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
        <Card title="Current device" roomy={roomy}>
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
        <Card title="Savings to apply now">
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
        <Card title="Next bills">
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
