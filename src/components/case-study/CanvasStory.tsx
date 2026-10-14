import Image from "next/image";
import type { ReactNode } from "react";

/* Visuals for the AI Conversational Canvas case study. */

const GRADIENT = "linear-gradient(90deg, #f7c948, #f08a24 45%, #e5262e)";

function Sparkle({ size = 16, color = "#e5262e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" fill={color} />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill={color} />
    </svg>
  );
}

/** Many separate rep tools on the left, one canvas on the right. */
export function Consolidation({ tools }: { tools: string[] }) {
  return (
    <div className="grid items-center gap-6 rounded-[20px] bg-white p-6 md:grid-cols-[1fr_auto_1fr] md:gap-10 md:p-10">
      <div>
        <p className="mb-4 text-[13px] font-bold uppercase tracking-[2px] text-[#888]">Before · separate apps</p>
        <div className="grid grid-cols-2 gap-2.5">
          {tools.map((t, n) => (
            <div
              key={t}
              className="rounded-[10px] border border-[#e2e2e2] bg-[#f6f6f6] px-3.5 py-3 text-[14px] text-[#444]"
              style={{ transform: `rotate(${[-1.2, 0.8, 1.1, -0.6, 0.5, -1, 0.9, -0.4][n % 8]}deg)` }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center text-[28px] text-[#999] md:flex-col">
        <span className="md:hidden">↓</span>
        <span className="hidden md:inline">→</span>
      </div>
      <div>
        <p className="mb-4 text-[13px] font-bold uppercase tracking-[2px] text-[#888]">After · one canvas</p>
        <div className="rounded-[16px] border border-[#e6e3de] bg-[#f6f5f3] p-5">
          <p className="flex items-center gap-2 text-[17px] font-bold tracking-[-0.02em]">
            <Sparkle /> How can I help you today?
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Credit check", "Plan upgrade", "Build quote"].map((c) => (
              <span key={c} className="rounded-[8px] border-[1.5px] border-[#111] bg-white px-3 py-1.5 text-[13.5px]">
                {c}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-full p-[2px]" style={{ background: GRADIENT }}>
            <div className="rounded-full bg-white px-4 py-2.5 text-[14px] text-[#777]">Search or ask</div>
          </div>
          <p className="mt-4 text-[14px] leading-[1.6] text-[#555]">
            The rep asks once. The canvas pulls in the customer&apos;s context and assembles the right tool for the task.
          </p>
        </div>
      </div>
    </div>
  );
}

type Channel = {
  name: string;
  mode: string;
  setting: string;
  visual: ReactNode;
  points: string[];
};

/** The same canvas, adapted to how each channel works. */
export function ChannelAdapt({ channels }: { channels: Channel[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
      {channels.map((c) => (
        <div key={c.name} className="flex flex-col rounded-[20px] bg-white p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[22px] font-bold tracking-[-0.03em]">{c.name}</p>
            <span className="rounded-full bg-[#111] px-3 py-1 text-[13px] font-semibold text-white">{c.mode}</span>
          </div>
          <p className="mt-1 text-[15px] text-[#666]">{c.setting}</p>
          <div className="mt-5 rounded-[14px] bg-[#f3f2ef] p-5">{c.visual}</div>
          <ul className="mt-5 flex flex-col gap-2.5">
            {c.points.map((p) => (
              <li key={p} className="flex gap-2.5 text-[15.5px] leading-[1.55] text-[#444]">
                <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#111]" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Retail: big tap targets, suggested actions first. */
export function TapVisual() {
  return (
    <div>
      <p className="flex items-center gap-2 text-[15px] font-bold">
        <Sparkle size={14} /> How can I help you today?
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {["Credit check", "Plan upgrade", "Build quote"].map((c, n) => (
          <span
            key={c}
            className={`rounded-[10px] border-[1.5px] border-[#111] px-2 py-3.5 text-center text-[13.5px] font-semibold ${n === 2 ? "bg-[#111] text-white" : "bg-white"}`}
          >
            {c}
          </span>
        ))}
      </div>
      <div className="mt-3 rounded-full p-[1.5px]" style={{ background: GRADIENT }}>
        <div className="rounded-full bg-white px-4 py-2 text-[13px] text-[#999]">Search or ask</div>
      </div>
    </div>
  );
}

/** Customer service: type-first, with the conversation feeding context. */
export function TypeVisual() {
  return (
    <div className="font-[family-name:var(--font-inter)]">
      <div className="rounded-[10px] bg-white p-3 text-[13px] leading-[1.5]">
        <p className="text-[#888]">Customer · chat</p>
        <p className="mt-1">Hi, my bill went up this month and I want to know why.</p>
      </div>
      <div className="mt-2.5 flex items-center gap-2 rounded-[10px] border border-[#ddd] bg-white px-3 py-2.5 text-[13.5px]">
        <Sparkle size={14} />
        <span>explain bill change since last month</span>
        <span className="ml-auto h-[16px] w-[1.5px] animate-pulse bg-[#111]" />
      </div>
      <p className="mt-2 text-[12px] text-[#888]">⏎ to run · / for commands</p>
    </div>
  );
}

/** One card per adoption barrier, each with the design decision that answers it. */
export function BarrierDecisions({ items }: { items: { barrier: string; decision: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, n) => (
        <div key={it.barrier} className="flex flex-col rounded-[18px] bg-white p-6">
          <span className="text-[13px] tabular-nums text-[#999]">0{n + 1}</span>
          <p className="mt-3 text-[20px] font-bold tracking-[-0.03em]">{it.barrier}</p>
          <p className="mt-2 text-[15.5px] leading-[1.6] text-[#555]">{it.decision}</p>
        </div>
      ))}
    </div>
  );
}

/** A screen from the canvas, framed like the tablet it runs on. */
export function ScreenShot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-[20px] bg-[#161616] p-3 md:p-5">
        <Image src={src} alt={alt} width={1600} height={1050} className="h-auto w-full rounded-[10px]" />
      </div>
      {caption && <figcaption className="mt-3 text-[14px] text-[#777]">{caption}</figcaption>}
    </figure>
  );
}
