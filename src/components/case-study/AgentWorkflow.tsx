"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Agentic workflow: the same upgrade done the old way (the rep drives every
 * system by hand) and the new way (the rep asks once, the agent plans and runs
 * the steps, and stops for approval where money or the customer is involved).
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const MANUAL = [
  ["Look up the account and lines", "Billing"],
  ["Check upgrade eligibility", "Device system"],
  ["Get the trade-in value", "Trade-in tool"],
  ["Build the quote by hand", "Quote tool"],
  ["Apply credits and promos", "Billing"],
  ["Write the call notes", "CRM"],
] as const;

type Step = { text: string; system: string; kind: "auto" | "approve" | "done" };

const AGENT: Step[] = [
  { text: "Pulled account, lines and upgrade eligibility", system: "Billing · Devices", kind: "auto" },
  { text: "Found the trade-in and its $400 value", system: "Trade-in", kind: "auto" },
  { text: "Built a quote with the best offer", system: "Quote", kind: "auto" },
  { text: "Rep reviewed the quote with Emily", system: "Rep approval", kind: "approve" },
  { text: "Applied credits and placed the order", system: "Billing", kind: "auto" },
  { text: "Wrote call notes and texted a confirmation", system: "CRM · SMS", kind: "done" },
];

// When each agent step completes, in ms after the request is sent.
const AT = [1100, 1900, 2800, 4300, 5200, 6000];
const ASK_AT = 400;
const LOOP = 9500;

export function AgentWorkflow() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [t, setT] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Step the run forward on a few timers, then start over.
  useEffect(() => {
    if (reduce || !visible) return;
    const marks = [0, ASK_AT, ...AT.map((a) => a - 650), ...AT];
    const timers = marks.map((m) => setTimeout(() => setT(m), m));
    const loop = setTimeout(() => {
      setT(0);
      setRun((r) => r + 1);
    }, LOOP);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(loop);
    };
  }, [visible, reduce, run]);

  const now = reduce ? LOOP : t;
  const doneCount = AT.filter((a) => now >= a).length;
  const finished = doneCount === AGENT.length;

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[22px] md:rounded-[36px] bg-[#d8d4f6] p-4 sm:p-6 md:p-12">
      <Image src="/images/case-studies/canvas/agentic-bg.webp" alt="" fill unoptimized className="object-cover" />

      <div className="relative">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p className="text-[26px] tracking-[-0.03em] text-[#111] md:text-[34px]">
            Same task, <span className="font-bold">two ways</span>
          </p>
          <p className="text-[14px] text-[#374151] md:text-[15px]">Upgrade a line with a trade-in</p>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_1.25fr]">
          {/* Before */}
          <Panel label="Before" note="The rep drives every system">
            <ol className="flex flex-col gap-2">
              {MANUAL.map(([text, sys], n) => (
                <li key={text} className="flex items-center gap-3 rounded-[12px] bg-white/80 px-4 py-3">
                  <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full border border-[#d1d5db] text-[12px] text-[#6b7280]">
                    {n + 1}
                  </span>
                  <span className="flex-1 text-[14.5px] text-[#374151]">{text}</span>
                  <span className="shrink-0 rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[11.5px] text-[#6b7280]">{sys}</span>
                </li>
              ))}
            </ol>
            <Tally items={["6 manual steps", "4 systems", "Notes after the call"]} muted />
          </Panel>

          {/* Now */}
          <Panel label="Now" note="The rep asks once and approves" accent>
            <div className="flex justify-end">
              <motion.span
                className="max-w-[90%] rounded-[16px] rounded-br-[6px] bg-[#111] px-4 py-2.5 text-[14.5px] text-white"
                animate={{ opacity: now >= ASK_AT ? 1 : 0, y: now >= ASK_AT ? 0 : 8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                Upgrade Emily&apos;s line 0234 with her trade-in
              </motion.span>
            </div>

            <ol className="mt-4 flex flex-col gap-2">
              {AGENT.map((st, n) => {
                const done = now >= AT[n];
                const active = !done && now >= AT[n] - 650 && now >= ASK_AT;
                const show = done || active;
                return (
                  <motion.li
                    key={st.text}
                    className={`flex items-center gap-3 rounded-[12px] px-4 py-3 ${
                      st.kind === "approve" ? "border border-[#f3b4b4] bg-[#fff6f6]" : "bg-white"
                    }`}
                    animate={{ opacity: show ? 1 : 0.35 }}
                    transition={{ duration: 0.35 }}
                  >
                    <StatusIcon state={done ? (st.kind === "approve" ? "approved" : "done") : active ? "working" : "queued"} />
                    <span className={`flex-1 text-[14.5px] ${show ? "text-[#111]" : "text-[#9ca3af]"}`}>{st.text}</span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] ${
                        st.kind === "approve" ? "bg-[#fde8e8] font-semibold text-[#b42318]" : "bg-[#eef2ff] text-[#3b4a8a]"
                      }`}
                    >
                      {st.system}
                    </span>
                  </motion.li>
                );
              })}
            </ol>

            {/* Space is reserved so the panel doesn't jump when the run finishes. */}
            <motion.p
              className="mt-3 flex items-center gap-2 rounded-[12px] bg-[#effaf3] px-4 py-2.5 text-[14px] text-[#14532d]"
              animate={{ opacity: finished ? 1 : 0, y: finished ? 0 : 6 }}
              transition={{ duration: 0.4, ease: EASE }}
              aria-hidden={!finished}
            >
              <StatusIcon state="done" /> Done. The rep stayed with the customer the whole time.
            </motion.p>
            <Tally items={["1 request", "1 approval", "Notes written for you"]} />
          </Panel>
        </div>

        {/* How the agent behaves */}
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ["Plans out loud", "Every step shows up before it runs, with the system it touches, so the rep is never guessing what the agent did."],
            ["Stops for consent", "Anything that changes the bill or reaches the customer waits for the rep to approve it."],
            ["Cleans up after", "Call notes, confirmations and follow-ups are written and filed, so the next rep picks up with full context."],
          ].map(([h, b]) => (
            <div key={h} className="rounded-[16px] bg-white/85 px-5 py-4 backdrop-blur">
              <p className="text-[16px] font-bold tracking-[-0.02em] text-[#111]">{h}</p>
              <p className="mt-1 text-[14px] leading-[1.5] text-[#4b5563]">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Panel({ label, note, accent, children }: { label: string; note: string; accent?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1">
        <p className="text-[15px] font-semibold uppercase tracking-[0.04em] text-[#111] md:text-[17px]">{label}</p>
        <p className="text-[13px] text-[#374151]">{note}</p>
      </div>
      <div
        className={`flex flex-1 flex-col rounded-[24px] border p-4 backdrop-blur-xl md:p-6 ${
          accent ? "border-white/70 bg-white/45 shadow-[0_20px_60px_rgba(60,50,140,0.12)]" : "border-white/50 bg-white/25"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Tally({ items, muted }: { items: string[]; muted?: boolean }) {
  return (
    <div className="mt-auto flex flex-wrap gap-2 pt-4">
      {items.map((x) => (
        <span
          key={x}
          className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${muted ? "bg-white/70 text-[#6b7280]" : "bg-[#111] text-white"}`}
        >
          {x}
        </span>
      ))}
    </div>
  );
}

function StatusIcon({ state }: { state: "done" | "approved" | "working" | "queued" }) {
  if (state === "working")
    return (
      <motion.span
        className="block h-[18px] w-[18px] shrink-0 rounded-full border-2 border-[#2f6fe4]/25 border-t-[#2f6fe4]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
    );
  if (state === "queued") return <span className="block h-[18px] w-[18px] shrink-0 rounded-full border-[1.5px] border-[#c4c9d4]" />;
  return (
    <motion.svg initial={{ scale: 0.5 }} animate={{ scale: 1 }} width="18" height="18" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill={state === "approved" ? "#e5262e" : "#1a9e4b"} />
      {state === "approved" ? (
        <path d="M8 12.5l2.5 2.5L16 9" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </motion.svg>
  );
}
