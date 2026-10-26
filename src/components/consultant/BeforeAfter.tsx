"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

/**
 * Illustrative workflow: one ordinary customer request, done by hand vs. with a connected,
 * AI-assisted flow where the employee approves. Fictional example, labeled as such.
 */

const BEFORE = [
  { step: "Read the customer's email", tool: "Inbox" },
  { step: "Look up who they are and their history", tool: "Customer records" },
  { step: "Check what's open on Thursday afternoon", tool: "Booking tool" },
  { step: "Copy the options into a reply", tool: "Inbox" },
  { step: "Move the appointment once they answer", tool: "Booking tool" },
  { step: "Log the change for the team", tool: "Spreadsheet" },
];

const SLOTS = ["1:30 pm", "3:00 pm", "4:15 pm"];

// What changes, side by side. Counts come from the example above, not from client data.
const COMPARE = [
  { label: "Steps done by hand", before: "6", after: "1 approval" },
  { label: "Tools to open", before: "4", after: "1 screen" },
  { label: "Customer details", before: "Searched for", after: "Already there" },
  { label: "The reply", before: "Depends who answers", after: "Consistent, then personalized" },
];
const ease = [0.22, 1, 0.36, 1] as const;

export default function BeforeAfter() {
  const reduce = useReducedMotion();
  const [view, setView] = useState<"before" | "after">("before");
  const [slot, setSlot] = useState(SLOTS[1]);
  const [sent, setSent] = useState(false);

  const show = (v: "before" | "after") => {
    setView(v);
    setSent(false);
  };
  const motionProps = reduce
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.45, ease } };

  return (
    <div className="rounded-[22px] bg-white p-4 md:rounded-[36px] md:p-8 lg:p-10">
      {/* The request */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[560px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">The request</p>
          <p className="mt-2 text-[22px] font-semibold leading-[1.25] tracking-[-0.03em] md:text-[28px]">
            “Hi, can I move my Tuesday appointment to Thursday afternoon?”
          </p>
        </div>
        <div role="tablist" aria-label="Compare the workflow" className="inline-flex shrink-0 self-start rounded-full bg-[#f2f2f2] p-1 text-[14px]">
          {(["before", "after"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              type="button"
              id={`ba-tab-${v}`}
              aria-selected={view === v}
              aria-controls={`ba-panel-${v}`}
              onClick={() => show(v)}
              className={`rounded-full px-4 py-2 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111] ${
                view === v ? "bg-[#111] text-white" : "text-[#555] hover:text-[#111]"
              }`}
            >
              {v === "before" ? "Done by hand" : "Connected workflow"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 md:mt-8">
        <AnimatePresence mode="wait" initial={false}>
          {view === "before" ? (
            <motion.div key="before" id="ba-panel-before" role="tabpanel" aria-labelledby="ba-tab-before" {...motionProps}>
              <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {BEFORE.map((b, i) => (
                  <li key={b.step} className="flex min-h-[112px] flex-col justify-between rounded-[16px] border border-[#e8e8e8] p-4">
                    <span className="font-mono text-[12px] text-[#9a9a9a]">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="text-[16px] font-medium leading-[1.3] tracking-[-0.02em]">{b.step}</p>
                      <p className="mt-1.5 inline-flex rounded-full bg-[#f2f2f2] px-2.5 py-1 text-[12px] text-[#555]">{b.tool}</p>
                    </div>
                  </li>
                ))}
              </ol>

            </motion.div>
          ) : (
            <motion.div key="after" id="ba-panel-after" role="tabpanel" aria-labelledby="ba-tab-after" {...motionProps}>
              <div className="grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-4">
                {/* Gathered automatically */}
                <div className="rounded-[18px] bg-[#f4f4f4] p-5">
                  <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">Gathered for you</p>
                  <dl className="mt-4 space-y-3 text-[15px]">
                    <div className="flex justify-between gap-4 border-b border-[#e2e2e2] pb-3">
                      <dt className="text-[#777]">Customer</dt>
                      <dd className="text-right font-medium">Returning customer, 6 visits</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#e2e2e2] pb-3">
                      <dt className="text-[#777]">Current booking</dt>
                      <dd className="text-right font-medium">Tuesday, 10:00 am</dd>
                    </div>
                    <div>
                      <dt className="text-[#777]">Open on Thursday</dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {SLOTS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            aria-pressed={slot === s}
                            onClick={() => {
                              setSlot(s);
                              setSent(false);
                            }}
                            className={`rounded-full border px-3 py-1.5 text-[14px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111] ${
                              slot === s ? "border-[#111] bg-[#111] text-white" : "border-[#d4d4d4] bg-white hover:border-[#111]"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Draft + approval */}
                <div className="flex flex-col rounded-[18px] border border-[#e8e8e8] p-5">
                  <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">Suggested reply</p>
                  <p className="mt-3 flex-1 text-[16px] leading-[1.55] text-[#222] md:text-[17px]">
                    Hi! Happy to move you. I can do <strong className="font-semibold">Thursday at {slot}</strong> instead of Tuesday at 10.
                    Want me to switch it?
                  </p>
                  {!sent && (
                    <div className="mt-4 rounded-[12px] bg-[#f6f6f6] px-4 py-3 text-[14px] leading-[1.5] text-[#555]">
                      <span className="font-semibold text-[#111]">When you approve:</span> the reply goes out, the booking moves to Thursday at{" "}
                      {slot}, and a note is added to the customer&apos;s record. Nothing changes until then.
                    </div>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-3" aria-live="polite">
                    {sent ? (
                      <p className="inline-flex items-center gap-2 rounded-full bg-[#eaf7ee] px-4 py-2.5 text-[14px] font-medium text-[#1d6b36]">
                        <span aria-hidden="true">✓</span> Approved. Reply sent, booking moved, note added.
                      </p>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setSent(true)}
                          className="rounded-full bg-[#111] px-5 py-2.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111]"
                        >
                          Approve and send
                        </button>
                        <span className="text-[14px] text-[#777]">or edit it first</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side-by-side difference; the active column is highlighted */}
      <div className="mt-6 overflow-hidden rounded-[16px] border border-[#ececec] md:mt-8">
        <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-[#fafafa] text-[12px] font-bold uppercase tracking-[0.1em] text-[#999] md:text-[13px]">
          <span className="px-4 py-3">For this request</span>
          <span className={`px-4 py-3 transition-colors ${view === "before" ? "bg-[#ececec] text-[#111]" : ""}`}>By hand</span>
          <span className={`px-4 py-3 transition-colors ${view === "after" ? "bg-[#111] text-white" : ""}`}>Connected</span>
        </div>
        {COMPARE.map((c) => (
          <div key={c.label} className="grid grid-cols-[1.1fr_1fr_1fr] border-t border-[#ececec] text-[13px] sm:text-[14px] md:text-[16px]">
            <span className="px-3 py-3 text-[#666] sm:px-4">{c.label}</span>
            <span className={`px-3 py-3 transition-colors sm:px-4 ${view === "before" ? "bg-[#f4f4f4] font-semibold" : "text-[#999]"}`}>{c.before}</span>
            <span className={`px-3 py-3 transition-colors sm:px-4 ${view === "after" ? "bg-[#f4f4f4] font-semibold" : "text-[#999]"}`}>{c.after}</span>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-[#ececec] pt-4 text-[13px] text-[#9a9a9a]">
        Illustrative example to show the idea, not a client engagement. Step counts come from this example only.
      </p>
    </div>
  );
}
