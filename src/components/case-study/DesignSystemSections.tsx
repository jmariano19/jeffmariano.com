import FadeUp from "../FadeUp";

/**
 * Small, static pieces for the retail design system case study:
 * the team pods, the sandbox loop, the adoption path, results and the closing line.
 */

const RED = "#ee0000";

/* ---------- 03 · Three pods, each with a lead on both continents ---------- */

export function TeamPods() {
  const pods = ["Sales", "Unity", "Service"];
  return (
    <div className="rounded-[22px] bg-white p-5 md:rounded-[32px] md:p-10">
      <div className="grid gap-3 md:grid-cols-3 md:gap-4">
        {pods.map((p) => (
          <div key={p} className="rounded-[18px] border border-[#e6e6e6] p-5">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">Pod</p>
            <p className="mt-1 text-[24px] font-bold tracking-[-0.03em] text-[#111]">{p}</p>
            <div className="mt-4 flex flex-col gap-2">
              {["US lead", "India lead"].map((lead) => (
                <div key={lead} className="flex items-center gap-3 rounded-[12px] bg-[#f4f4f4] px-3 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: lead === "US lead" ? "#111" : RED }} />
                  <span className="text-[15px] text-[#222]">{lead}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2 rounded-[16px] bg-[#111] px-5 py-4 text-white md:flex-row md:items-center md:justify-between">
        <p className="text-[15px] font-semibold">Weekly lead sync across all three pods</p>
        <p className="text-[14px] text-white/65">Work assigned by priority, not geography</p>
      </div>
    </div>
  );
}

/* ---------- 04 · The sandbox loop and the adoption path ---------- */

const LOOP = [
  { n: "01", t: "Ship a micro-flow", d: "One small flow, not a whole redesign." },
  { n: "02", t: "Watch it in stores", d: "See how reps and customers really use it." },
  { n: "03", t: "Read the signals", d: "Keep what works, fix what doesn't." },
  { n: "04", t: "Join the system", d: "Only proven patterns become components." },
];

export function SandboxLoop() {
  return (
    <div>
      <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">The sandbox</p>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {LOOP.map((s, i) => (
          <FadeUp key={s.n} delay={i * 0.08}>
            <li className="relative h-full rounded-[20px] bg-white p-5 md:p-6">
              <span className="font-mono text-[12px]" style={{ color: RED }}>
                {s.n}
              </span>
              <p className="mt-2 text-[19px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111]">{s.t}</p>
              <p className="mt-1.5 text-[15px] leading-[1.5] text-[#666]">{s.d}</p>
              {i < LOOP.length - 1 && (
                <span aria-hidden="true" className="absolute -right-[13px] top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#111] text-[12px] text-white lg:flex">
                  →
                </span>
              )}
            </li>
          </FadeUp>
        ))}
      </ol>
    </div>
  );
}

export function AdoptionPath() {
  const steps = ["My design team", "Product managers", "Senior leadership"];
  return (
    <div className="mt-8 md:mt-10">
      <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">How adoption spread</p>
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch md:gap-0">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2 md:gap-0">
            <div
              className="flex flex-1 items-center gap-3 rounded-full px-5 py-3.5"
              style={{ background: i === steps.length - 1 ? "#111" : "#fff", color: i === steps.length - 1 ? "#fff" : "#111" }}
            >
              <span className="font-mono text-[12px] opacity-60">{i + 1}</span>
              <span className="text-[16px] font-semibold">{s}</span>
            </div>
            {i < steps.length - 1 && <span aria-hidden="true" className="hidden px-3 text-[#999] md:block">→</span>}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[15px] text-[#666]">No mandate, no pure grassroots. By the time I presented up, everyone already knew.</p>
    </div>
  );
}

/* ---------- Results, in the same quiet style as the challenges ---------- */

export function Results({ items }: { items: { title: string; line: string }[] }) {
  return (
    <section className="border-t border-[#d4d4d4] pt-10 pb-6 md:pt-14">
      <FadeUp>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
          <h2 className="text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-[#111] md:text-[38px]">Outcomes</h2>
          <dl className="grid border-t border-[#d4d4d4] sm:grid-cols-2 lg:border-t-0">
            {items.map((it, i) => (
              <div
                key={it.title}
                className={`py-5 sm:py-6 ${i % 2 === 1 ? "sm:border-l sm:border-[#d4d4d4] sm:pl-8" : "sm:pr-8"} ${i > 1 ? "border-t border-[#d4d4d4]" : i === 1 ? "max-sm:border-t max-sm:border-[#d4d4d4]" : ""}`}
              >
                <dt className="text-[22px] font-bold leading-[1.15] tracking-[-0.03em] text-[#111] md:text-[26px]">{it.title}</dt>
                <dd className="mt-1 text-[15px] leading-[1.45] text-[#666]">{it.line}</dd>
              </div>
            ))}
          </dl>
        </div>
      </FadeUp>
    </section>
  );
}

/* ---------- The closing line ---------- */

export function ClosingLine({ text }: { text: string }) {
  return (
    <section className="py-16 md:py-24">
      <FadeUp>
        <p className="mx-auto max-w-[30ch] text-center text-[26px] font-bold leading-[1.2] tracking-[-0.03em] text-[#111] md:text-[40px]">
          {text}
        </p>
        <span aria-hidden="true" className="mx-auto mt-8 block h-[3px] w-12 rounded-full" style={{ background: RED }} />
      </FadeUp>
    </section>
  );
}
