"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Generative UI based on intent: the same request, composed for two channels.
 * In retail the rep taps an action and gets roomy cards to review with the
 * customer; in the contact center the rep types and gets a dense layout.
 * Requests cycle on their own; visitors can pick one.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const BLUE = "#2f6fe4";
const CYCLE = 9500;
const TYPE_MS = 34;

type Block = "trend" | "breakdown" | "history" | "deals" | "device" | "savings" | "forecast";

type Scenario = {
  label: string;
  tap: string;
  retail: Block[];
  ask: string;
  center: Block[];
};

const SCENARIOS: Scenario[] = [
  {
    label: "Why did my bill go up?",
    tap: "Bill overview",
    retail: ["trend", "breakdown", "history"],
    ask: "Why did this customer's bill go up?",
    center: ["trend", "breakdown", "history"],
  },
  {
    label: "Upgrade a line",
    tap: "Upgrade a line",
    retail: ["deals", "device"],
    ask: "Which upgrade offers is line 0234 eligible for?",
    center: ["deals", "device"],
  },
  {
    label: "Help me lower my bill",
    tap: "Check offers",
    retail: ["savings", "forecast"],
    ask: "How can this customer lower their bill?",
    center: ["savings", "breakdown", "forecast"],
  },
];

export function IntentComposer() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [typed, setTyped] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const s = SCENARIOS[i];

  // The contact center rep types the request; the layout composes once it's sent.
  useEffect(() => {
    if (reduce || !visible) return;
    let n = 0;
    const start = setTimeout(() => setTyped(0), 0);
    const id = setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= s.ask.length) clearInterval(id);
    }, TYPE_MS);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [i, visible, reduce, s.ask.length]);

  useEffect(() => {
    if (!auto || !visible || reduce) return;
    const t = setTimeout(() => setI((n) => (n + 1) % SCENARIOS.length), CYCLE);
    return () => clearTimeout(t);
  }, [i, auto, visible, reduce]);

  const done = reduce || typed >= s.ask.length;
  const shownAsk = reduce ? s.ask : s.ask.slice(0, typed);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[22px] md:rounded-[36px] bg-[#d9cdf3] p-4 sm:p-6 md:p-[56px]">
      <Image src="/images/case-studies/canvas/consolidation-bg.webp" alt="" fill unoptimized className="object-cover" />

      <div className="relative">
        <p className="text-[26px] tracking-[-0.03em] text-[#111] md:text-[38px]">
          From request to <span className="font-bold">rep experience</span>
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2.5 md:gap-3">
          <span className="mr-1 text-[12px] font-bold uppercase text-[#374151]">Try a request</span>
          {SCENARIOS.map((sc, n) => (
            <button
              key={sc.label}
              type="button"
              onClick={() => {
                setI(n);
                setAuto(false);
              }}
              aria-pressed={n === i}
              className={`relative overflow-hidden rounded-full border px-4 py-2.5 text-[14px] transition-colors md:px-5 md:py-3 md:text-[16px] ${
                n === i ? "border-[#111] bg-[#111] text-white" : "border-[#d1d5db] bg-white text-[#374151] hover:border-[#9ca3af]"
              }`}
            >
              “{sc.label}”
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

        <p className="mt-10 text-center text-[22px] font-semibold tracking-[-0.02em] text-[#111] md:mt-12 md:text-[28px]">
          Generative UI based on intent
        </p>
        <p className="mx-auto mt-2 max-w-[34rem] text-center text-[14px] leading-[1.5] text-[#374151] md:text-[15px]">
          Same request, same component library. Each channel gets the layout that fits how the rep works.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Retail: tap, roomy */}
          <div className="flex flex-col">
            <ColumnLabel title="Retail" note="Rep taps · roomy cards to review with the customer" />
            <Glass>
              <div className="mb-4 flex items-center gap-2">
                <span className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#4b5563]">Rep tapped</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={s.tap}
                    className="flex items-center gap-1.5 rounded-full border border-[#111] bg-white px-3.5 py-1.5 text-[14px]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <TapIcon />
                    {s.tap}
                  </motion.span>
                </AnimatePresence>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={`r-${i}`} className="flex flex-col gap-4" exit={{ opacity: 0, filter: "blur(4px)" }} transition={{ duration: 0.3 }}>
                  {s.retail.map((b, n) => (
                    <motion.div
                      key={b}
                      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.6, delay: 0.25 + n * 0.15, ease: EASE }}
                    >
                      <BlockView block={b} roomy order={n + 1} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </Glass>
          </div>

          {/* Contact centers: type, dense */}
          <div className="flex flex-col">
            <ColumnLabel title="Contact centers" note="Rep types · dense, keyboard-first answers" />
            <Glass>
              <div className="flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  {done ? (
                    <motion.div key={`c-${i}`} className="grid gap-3 sm:grid-cols-2" exit={{ opacity: 0, filter: "blur(4px)" }} transition={{ duration: 0.3 }}>
                      {s.center.map((b, n) => (
                        <motion.div
                          key={b}
                          className={n === 0 && s.center.length !== 2 ? "sm:col-span-2" : ""}
                          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ duration: 0.55, delay: 0.15 + n * 0.12, ease: EASE }}
                        >
                          <BlockView block={b} roomy={false} order={n + 1} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`p-${i}`}
                      className="grid gap-3 sm:grid-cols-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {s.center.map((b, n) => (
                        <div key={b} className={`h-[150px] rounded-[14px] bg-white/80 ${n === 0 && s.center.length !== 2 ? "sm:col-span-2" : ""}`} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-[16px] border border-white/70 bg-white/60 px-5 py-4 backdrop-blur">
                <Sparkle size={16} />
                <p className="min-w-0 flex-1 text-[15px] text-[#111] md:text-[17px]">
                  {shownAsk}
                  {!done && <span className="ml-[1px] inline-block h-[18px] w-[1.5px] translate-y-[3px] animate-pulse bg-[#111]" />}
                </p>
                <span
                  className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    done ? "bg-[#111] text-white" : "bg-white text-[#9ca3af]"
                  }`}
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </span>
              </div>
            </Glass>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Frame pieces ---------- */

function ColumnLabel({ title, note }: { title: string; note: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1">
      <p className="text-[15px] font-semibold uppercase tracking-[0.04em] text-[#111] md:text-[17px]">{title}</p>
      <p className="text-[13px] text-[#374151]">{note}</p>
    </div>
  );
}

function Glass({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col rounded-[24px] border border-white/60 bg-white/35 p-4 shadow-[0_20px_60px_rgba(60,50,140,0.10)] backdrop-blur-xl md:p-8 lg:min-h-[760px]">
      {children}
    </div>
  );
}

function Sparkle({ size = 15, color = "#e5262e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" fill={color} />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill={color} />
    </svg>
  );
}

function TapIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-4.6-2.2L4 15.5a1.6 1.6 0 0 1 2.4-2l2.6 2.5" />
    </svg>
  );
}

function OrderDot({ n, roomy }: { n: number; roomy: boolean }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${roomy ? "h-[26px] w-[26px] text-[13px]" : "h-[22px] w-[22px] text-[11px]"}`}
      style={{ background: BLUE }}
    >
      {n}
    </span>
  );
}

function Card({ title, children, roomy, order }: { title: ReactNode; children: ReactNode; roomy: boolean; order?: number }) {
  return (
    <div className={`h-full rounded-[14px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)] ${roomy ? "p-5 md:p-6" : "p-4"}`}>
      <div className={`flex items-center gap-2.5 ${roomy ? "mb-4" : "mb-3"}`}>
        {order !== undefined && <OrderDot n={order} roomy={roomy} />}
        <p className={`tracking-[-0.02em] text-[#111] ${roomy ? "text-[18px] md:text-[20px]" : "text-[14.5px] font-semibold"}`}>{title}</p>
      </div>
      {children}
    </div>
  );
}

/* ---------- Library components, in a roomy (tap) and dense (type) form ---------- */

function TrendChart({ roomy }: { roomy: boolean }) {
  const w = 560;
  const mid = w * 0.6;
  const end = w - 12;
  return (
    <div>
      <svg viewBox={`0 0 ${w} 86`} className="h-auto w-full" aria-hidden="true">
        <path d={`M12 70 L${mid} 40 L${mid + 70} 32 L${end} 32`} fill="none" stroke={BLUE} strokeWidth="2.2" strokeDasharray="5 6" />
        <circle cx="12" cy="70" r="7" fill={BLUE} />
        <circle cx={mid} cy="40" r="7" fill={BLUE} />
        <rect x={mid - 30} y="4" width="60" height="22" rx="6" fill="#e4eefc" />
        <text x={mid} y="19" textAnchor="middle" fontSize="13" fontWeight="700" fill={BLUE}>
          +$25
        </text>
      </svg>
      <div className={`mt-2 flex justify-between text-[#6b7280] ${roomy ? "text-[14px]" : "text-[12px]"}`}>
        <span>Jan $180.22</span>
        <span>Feb $200.22</span>
        <span>Mar $200.22</span>
      </div>
    </div>
  );
}

function BlockView({ block, roomy, order }: { block: Block; roomy: boolean; order?: number }) {
  const t = roomy ? "text-[15px] md:text-[16px]" : "text-[13px]";
  const row = roomy ? "py-3" : "py-2";
  switch (block) {
    case "trend":
      return (
        <Card
          roomy={roomy}
          order={order}
          title={
            <>
              Current total: <span className="font-bold">$200.22</span>
            </>
          }
        >
          <TrendChart roomy={roomy} />
        </Card>
      );
    case "breakdown":
      return (
        <Card roomy={roomy} order={order} title="Bill by line">
          <div className={`flex flex-col ${t}`}>
            {[
              ["•••0234", "Plan, device, perks", "$137.22"],
              ["•••0488", "Plan, device", "$90.43"],
              ["•••0655", "Plan", "$65.00"],
            ].map(([l, d, v]) => (
              <div key={l} className={`flex items-baseline justify-between gap-3 border-b border-[#eee] last:border-0 ${row}`}>
                <span className="text-[#111]">
                  {l} <span className="text-[#6b7280]">· {d}</span>
                </span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      );
    case "history": {
      const items = [
        ["bill", "Promo credit ended on line •••0234", "Feb 1"],
        ["call", "Called support about a higher bill", "Jan 28"],
        ["clock", "Autopay turned off", "Jan 15"],
        ["device", "New Pro phone and plan change", "Jan 9"],
      ];
      return (
        <Card
          roomy={roomy}
          order={order}
          title={
            <span className="flex items-center gap-1 font-semibold">
              History <span aria-hidden="true">›</span>
            </span>
          }
        >
          <div className={`flex flex-col ${roomy ? "gap-3" : "gap-2"} ${t}`}>
            {(roomy ? items : items.slice(0, 3)).map(([ic, x, d]) => (
              <div key={x} className="flex items-start gap-3">
                <HistoryIcon kind={ic} />
                <span className="flex-1 text-[#111]">{x}</span>
                <span className="shrink-0 text-[#9ca3af]">{d}</span>
              </div>
            ))}
            <div className={`mt-1 flex items-center justify-between gap-3 rounded-[10px] border border-[#f0a868] bg-[#fbf3ea] ${roomy ? "px-4 py-3" : "px-3 py-2"}`}>
              <span className={roomy ? "text-[14px]" : "text-[12px]"}>3 items in a shared cart from the last visit</span>
              <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-white text-[14px]">›</span>
            </div>
          </div>
        </Card>
      );
    }
    case "deals":
      return (
        <Card roomy={roomy} order={order} title={<span className="font-semibold">Deals ›</span>}>
          <div className={`flex flex-col ${roomy ? "gap-2.5" : "gap-2"}`}>
            <div className={`flex items-center justify-between rounded-[12px] bg-[#e5262e] text-white ${roomy ? "px-4 py-4" : "px-3 py-2.5"}`}>
              <div>
                <p className={`font-bold ${roomy ? "text-[16px]" : "text-[13px]"}`}>New Pro phone on us</p>
                <p className={roomy ? "text-[14px]" : "text-[12px]"}>with an eligible trade-in</p>
              </div>
              <span>›</span>
            </div>
            {[
              ["Standard model on us", "With a new line on select plans"],
              ["Pro model for $5/mo", "With a new line on premium plans"],
            ].map(([a, b]) => (
              <div key={a} className={`flex items-center justify-between rounded-[12px] bg-[#f3f4f6] ${roomy ? "px-4 py-3.5" : "px-3 py-2"}`}>
                <div>
                  <p className={`font-semibold ${roomy ? "text-[15px]" : "text-[13px]"}`}>{a}</p>
                  <p className={`text-[#6b7280] ${roomy ? "text-[14px]" : "text-[12px]"}`}>{b}</p>
                </div>
                <span>›</span>
              </div>
            ))}
          </div>
        </Card>
      );
    case "device":
      return (
        <Card roomy={roomy} order={order} title="Current device">
          <div className="flex gap-4">
            <span className={`block shrink-0 rounded-[10px] border-[3px] border-[#222] bg-[#3f7f8a] ${roomy ? "h-[96px] w-[52px]" : "h-[64px] w-[36px]"}`} />
            <div className={t}>
              <p className="font-semibold">Pro model, 2022 · 128 GB</p>
              <p className="text-[#6b7280]">Line •••0234 · upgrade eligible</p>
              <p className="mt-2 text-[#6b7280]">Current plan</p>
              <p className="font-semibold">Unlimited Welcome</p>
            </div>
          </div>
          {roomy && <span className="mt-5 inline-block rounded-full border-[1.5px] border-[#111] px-6 py-2.5 text-[15px] font-semibold">Select</span>}
        </Card>
      );
    case "savings":
      return (
        <Card roomy={roomy} order={order} title="Recommended savings">
          <div className={`flex flex-col ${roomy ? "gap-2.5" : "gap-2"}`}>
            {[
              ["Add a streaming bundle", "Save $9.99/mo", "#0f3b4a"],
              ["Enroll in Autopay & paperless", "Save $10.00/mo", "#e5e7eb"],
              ["Switch to a lower plan", "Save $15.00/mo", "#e5262e"],
            ].map(([a, b, c]) => (
              <div key={a} className={`flex items-center gap-3 rounded-[12px] bg-[#f3f4f6] ${roomy ? "px-4 py-3.5" : "px-3 py-2"}`}>
                <span className={`shrink-0 rounded-[8px] ${roomy ? "h-[40px] w-[40px]" : "h-[28px] w-[28px]"}`} style={{ background: c }} />
                <div className="flex-1">
                  <p className={`font-semibold ${roomy ? "text-[15px]" : "text-[13px]"}`}>{a}</p>
                  <p className={`text-[#1a9e4b] ${roomy ? "text-[14px]" : "text-[12px]"}`}>{b}</p>
                </div>
                <span className={`shrink-0 rounded-full border-[1.5px] border-[#9ca3af] ${roomy ? "h-[22px] w-[22px]" : "h-[16px] w-[16px]"}`} />
              </div>
            ))}
          </div>
        </Card>
      );
    case "forecast":
      return (
        <Card roomy={roomy} order={order} title="Next bills">
          <div className={`flex items-end justify-around gap-3 border-b border-[#e5e7eb] ${roomy ? "h-[150px]" : "h-[96px]"}`}>
            {(
              [
                ["May", 0.55, true, "$200"],
                ["Jun", 0.92, false, "$215"],
                ["Jul", 0.62, false, "$175"],
              ] as const
            ).map(([m, h, past, v]) => (
              <div key={m} className="flex h-full flex-col items-center justify-end gap-1">
                <span className={`text-[#374151] ${roomy ? "text-[13px]" : "text-[11px]"}`}>{v}</span>
                <motion.span
                  className={`block rounded-t-[3px] ${roomy ? "w-[52px]" : "w-[30px]"}`}
                  style={{
                    background: past ? `repeating-linear-gradient(45deg, ${BLUE} 0 2px, #fff 2px 6px)` : BLUE,
                    border: past ? `1.5px solid ${BLUE}` : undefined,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: h * (roomy ? 110 : 62) }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
                />
              </div>
            ))}
          </div>
          <div className={`mt-1.5 flex justify-around text-[#6b7280] ${roomy ? "text-[13px]" : "text-[11px]"}`}>
            <span>May · actual</span>
            <span>Jun · estimate</span>
            <span>Jul · new</span>
          </div>
        </Card>
      );
  }
}

function HistoryIcon({ kind }: { kind: string }) {
  const d: Record<string, ReactNode> = {
    bill: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" />,
    call: <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H4zM17 14h3v5h-3z" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </>
    ),
    device: (
      <>
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mt-[2px] shrink-0" aria-hidden="true">
      {d[kind]}
    </svg>
  );
}
