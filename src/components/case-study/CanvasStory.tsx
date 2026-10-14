import Image from "next/image";

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
