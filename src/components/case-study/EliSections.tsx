"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* Visual building blocks for the Eli's Last Experiment case study.
   Dark, warm surfaces so every section reads as part of Eli's world. */

const EASE = [0.22, 1, 0.36, 1] as const;
const PROTOTYPE_URL = "https://eli-eli.yydhsb.easypanel.host/index.html?game=prototype_10";

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`overflow-hidden rounded-[22px] bg-[#14110b] text-[#f3e2bd] md:rounded-[36px] ${className}`}>{children}</div>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f3e2bd]/50">{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Bridge: what the visitor just felt → the system behind it           */

export function PlayedBridge() {
  const items = [
    { felt: "The glow in his chest", system: "State Grammar", line: "Trust drives three channels: heart, posture, language." },
    { felt: "The memories you recovered", system: "Memory Loop", line: "What players share unlocks what Eli remembers." },
    { felt: "Dad's note, in your words", system: "The return", line: "The finale hands players their own words back." },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((it, i) => (
        <motion.div
          key={it.system}
          className="rounded-[20px] bg-white p-5 md:p-6"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
        >
          <p className="text-[13px] text-[#888]">{it.felt}</p>
          <p className="mt-1 flex items-center gap-2 text-[20px] font-bold tracking-[-0.02em] text-[#111]">
            <span className="text-[#c99558]">→</span> {it.system}
          </p>
          <p className="mt-2 text-[14.5px] leading-[1.5] text-[#555]">{it.line}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · Two loops and the seven memories                               */

const FRAGMENTS = ["Cold feeling", "Someone was there", "Bright light", "A voice", "The experiment", "Before it happened", "Who I was"];

function Loop({ title, steps, color }: { title: string; steps: string[]; color: string }) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-5 md:p-6">
      <p className="text-[18px] font-bold tracking-[-0.02em]" style={{ color }}>
        {title}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className="rounded-full border border-white/12 px-3 py-1.5 text-[13.5px] text-[#f3e2bd]/90">{s}</span>
            {i < steps.length - 1 && <span className="text-[#f3e2bd]/35">→</span>}
          </span>
        ))}
        <span className="text-[13px] text-[#f3e2bd]/35">↺</span>
      </div>
    </div>
  );
}

export function SystemLoops() {
  return (
    <Panel className="p-5 md:p-10">
      <div className="grid gap-3 md:grid-cols-2">
        <Loop title="Care Loop" color="#ffcf8a" steps={["Eli needs something", "You tend to him", "Bond grows"]} />
        <Loop title="Memory Loop" color="#9fd8d0" steps={["You share a memory", "A fragment unlocks", "Eli remembers"]} />
      </div>
      <div className="mt-8">
        <div className="flex items-baseline justify-between">
          <Eyebrow>Seven sessions · seven memories</Eyebrow>
          <p className="hidden text-[12px] text-[#f3e2bd]/40 sm:block">from the game&apos;s memory system</p>
        </div>
        <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {FRAGMENTS.map((f, i) => (
            <motion.li
              key={f}
              className="rounded-[14px] border border-white/8 p-3"
              style={{ background: `rgba(255,207,138,${0.03 + i * 0.025})` }}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
            >
              <span className="font-mono text-[10.5px] text-[#f3e2bd]/40">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-1 text-[13.5px] leading-tight text-[#ffe2b3]">{f}</p>
            </motion.li>
          ))}
        </ol>
        <div className="mt-2 flex justify-between text-[12px] text-[#f3e2bd]/45">
          <span>Stranger</span>
          <span>Mirror</span>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · The editor, annotated                                          */

const PINS = [
  { n: 1, x: 7.5, y: 40, label: "Scene sequence", line: "Drag to reorder, duplicate, filter" },
  { n: 2, x: 25.5, y: 14, label: "Scene types", line: "Rive · video · chat · jigsaw · words" },
  { n: 3, x: 47, y: 23.5, label: "Guided flow", line: "Voice → lip sync → what happens next" },
  { n: 4, x: 27, y: 52, label: "Live Rive preview", line: "Eli reacts as you edit" },
  { n: 5, x: 55, y: 56, label: "Eli's voice", line: "Generated with an emotional performance" },
  { n: 6, x: 80, y: 84, label: "Segments", line: "Voice, AI chat, silence or video, in order" },
];

export function EditorAnatomy() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div>
      <Panel className="p-2 md:p-3">
        <div className="relative overflow-hidden rounded-[16px] md:rounded-[28px]">
          <Image
            src="/images/case-studies/eli/editor.webp"
            alt="The Elia editor: scene list, scene setup, live Rive preview, voice generation and segments"
            width={3200}
            height={2000}
            sizes="(max-width: 1440px) 100vw, 1304px"
            className="h-auto w-full"
          />
          {PINS.map((p) => (
            <button
              key={p.n}
              type="button"
              onMouseEnter={() => setHover(p.n)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(p.n)}
              onBlur={() => setHover(null)}
              className={`absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[12px] font-bold shadow-[0_0_0_4px_rgba(255,207,138,0.25)] transition-transform md:h-8 md:w-8 md:text-[14px] ${
                hover === p.n ? "scale-125 bg-[#ffe2b3] text-[#1d1910]" : "bg-[#ffcf8a] text-[#1d1910]"
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-label={`${p.n}. ${p.label}`}
            >
              {p.n}
            </button>
          ))}
        </div>
      </Panel>
      <ol className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {PINS.map((p) => (
          <li
            key={p.n}
            onMouseEnter={() => setHover(p.n)}
            onMouseLeave={() => setHover(null)}
            className={`flex gap-3 rounded-[14px] p-2 transition-colors ${hover === p.n ? "bg-white" : ""}`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111] text-[12px] font-bold text-white">{p.n}</span>
            <span>
              <span className="block text-[15px] font-semibold text-[#111]">{p.label}</span>
              <span className="block text-[13.5px] text-[#666]">{p.line}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const TYPES = [
  { name: "Rive", line: "Eli, lip-synced, with heart and body cues", color: "#7fb2ff" },
  { name: "Video", line: "Cinematic beats that hand back to Eli", color: "#c79bff" },
  { name: "Chat", line: "Open conversation with memory", color: "#9fd8d0" },
  { name: "Jigsaw", line: "Rebuild a memory, piece by piece", color: "#ff9fd0" },
  { name: "Words", line: "Find the word hiding in the letters", color: "#ffcf8a" },
];

export function SceneTypes() {
  return (
    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TYPES.map((t) => (
          <div key={t.name} className="rounded-[18px] bg-white p-4">
            <span className="rounded-[6px] px-2 py-0.5 font-mono text-[12px] font-semibold" style={{ background: `${t.color}33`, color: "#222" }}>
              {t.name.toLowerCase()}
            </span>
            <p className="mt-2 text-[13.5px] leading-[1.45] text-[#555]">{t.line}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
        {[
          ["2", "games built"],
          ["24", "scenes"],
          ["0", "lines of code per scene"],
        ].map(([n, l]) => (
          <div key={l} className="flex flex-col justify-center rounded-[18px] bg-[#111] p-4 text-white lg:flex-row lg:items-baseline lg:justify-start lg:gap-3">
            <span className="text-[30px] font-bold leading-none tracking-[-0.04em] md:text-[38px]">{n}</span>
            <span className="mt-1 text-[13px] text-white/60 lg:mt-0">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · The Give Ritual, with a working hold                            */

const STATES = ["Arrive", "Invite", "Holding", "Complete"];
const HOLD_MS = 3200;

export function GiveRitual() {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "holding" | "released" | "done">("idle");
  const start = useRef(0);
  const raf = useRef(0);
  const beats = useRef(0);

  const stop = () => cancelAnimationFrame(raf.current);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const down = () => {
    if (phase === "done") return;
    setPhase("holding");
    start.current = performance.now();
    beats.current = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start.current) / HOLD_MS);
      setProgress(p);
      // Three steadying heartbeats under the visitor's hand, at 0 / 1.2 / 2.4s
      if (beats.current < 3 && now - start.current >= beats.current * 1200) {
        navigator.vibrate?.([20, 90, 28]);
        beats.current += 1;
      }
      if (p >= 1) {
        setPhase("done");
        navigator.vibrate?.(30);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const up = () => {
    if (phase !== "holding") return;
    stop();
    setPhase("released");
    // Early release is information, not punishment: ease back gently.
    const from = progress;
    const t0 = performance.now();
    const ease = (now: number) => {
      const k = Math.min(1, (now - t0) / 400);
      setProgress(from * (1 - k));
      if (k < 1) raf.current = requestAnimationFrame(ease);
    };
    raf.current = requestAnimationFrame(ease);
  };

  const reset = () => {
    stop();
    setProgress(0);
    setPhase("idle");
  };

  const stage = phase === "done" ? 3 : phase === "holding" ? 2 : 1;

  return (
    <Panel>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
        {/* Try it */}
        <div className="relative flex min-h-[340px] flex-col items-center justify-center gap-5 bg-[radial-gradient(ellipse_at_50%_55%,#2b2013,#14110b_70%)] p-8 md:min-h-[440px]">
          <button
            type="button"
            onPointerDown={down}
            onPointerUp={up}
            onPointerLeave={up}
            onPointerCancel={up}
            onContextMenu={(e) => e.preventDefault()}
            className="relative h-40 w-40 touch-none select-none rounded-full md:h-48 md:w-48"
            aria-label="Hold to give Eli the memory"
          >
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255,196,120,${0.15 + progress * 0.7}), rgba(255,140,60,${progress * 0.35}) 55%, transparent 72%)`,
                boxShadow: `0 0 ${20 + progress * 80}px rgba(255,170,80,${0.15 + progress * 0.45})`,
              }}
            />
            <motion.span
              className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffe2b3] shadow-[0_0_24px_rgba(255,210,150,0.9)]"
              animate={reduce || phase === "holding" ? { scale: 1 - progress * 0.6 } : { y: [0, -6, 0] }}
              transition={reduce || phase === "holding" ? { duration: 0.1 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </button>
          <p className="h-5 text-center text-[13.5px] text-[#f3e2bd]/65">
            {phase === "done"
              ? "…"
              : phase === "released"
                ? "gently. all the way."
                : phase === "holding"
                  ? "keep holding"
                  : "he can't take it himself. hold the ember."}
          </p>
          {phase === "done" && (
            <button type="button" onClick={reset} className="text-[12.5px] text-[#f3e2bd]/50 underline underline-offset-4">
              Try again
            </button>
          )}
        </div>

        {/* The spec */}
        <div className="flex flex-col gap-6 border-t border-white/5 p-6 md:p-10 lg:border-l lg:border-t-0">
          <div>
            <Eyebrow>States</Eyebrow>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {STATES.map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
                      i === stage ? "border-[#ffcf8a]/60 bg-[#ffcf8a]/15 text-[#ffe2b3]" : "border-white/12 text-[#f3e2bd]/60"
                    }`}
                  >
                    {s}
                  </span>
                  {i < STATES.length - 1 && <span className="text-[#f3e2bd]/30">→</span>}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[12.5px] text-[#f3e2bd]/45">Release early → the ember eases back. No error, no reset penalty.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["3.2s", "hold"],
              ["3", "heartbeats"],
              ["0", "scores or toasts"],
            ].map(([n, l]) => (
              <div key={l} className="rounded-[14px] border border-white/8 p-3">
                <p className="text-[24px] font-bold tracking-[-0.03em] text-[#ffe2b3] md:text-[28px]">{n}</p>
                <p className="text-[12px] text-[#f3e2bd]/55">{l}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {["A vigil, not a slot machine.", "Early release is information, not punishment.", "The chest glow is the progress bar."].map((q) => (
              <p key={q} className="border-l-2 border-[#ffcf8a]/50 pl-3 text-[15px] italic text-[#f3e2bd]/85">
                {q}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · Play the prototype                                             */

const SEQUENCE: [string, string, string][] = [
  ["start", "Start", "rive"],
  ["enter", "Enter", "video"],
  ["game", "Jigsaw", "jigsaw"],
  ["playground", "Playground", "video"],
  ["words", "Words", "words"],
  ["know_you_better", "Know you better", "video"],
  ["diary", "Diary", "rive"],
  ["the_voice", "The voice", "video"],
  ["last", "Last", "rive"],
];

export function PlayPrototype() {
  const [scene, setScene] = useState<string | null>(null);
  const src = scene ? `${PROTOTYPE_URL}&scene=${scene}` : null;

  return (
    <Panel className="p-5 md:p-10">
      <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-14">
        {/* Phone */}
        <div className="mx-auto w-[280px] md:w-[320px]">
          <div className="relative aspect-[390/844] overflow-hidden rounded-[44px] border-[10px] border-[#2a2219] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            {src ? (
              <iframe
                key={src}
                src={src}
                title="Eli's Last Experiment, prototype 10"
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; vibrate"
              />
            ) : (
              <button type="button" onClick={() => setScene("start")} className="group absolute inset-0">
                <Image src="/images/case-studies/eli/phone-start.webp" alt="" fill sizes="320px" className="object-cover" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e2bd] text-[#1d1910] transition-transform group-hover:scale-105">
                    <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" aria-hidden="true">
                      <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="text-[15px] font-semibold text-[#f3e2bd]">Play prototype 10</span>
                  <span className="text-[12px] text-[#f3e2bd]/60">sound on · best on a phone</span>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Scene jump list */}
        <div>
          <Eyebrow>Built in the editor · jump to any scene</Eyebrow>
          <ol className="mt-4 grid gap-1.5 sm:grid-cols-2">
            {SEQUENCE.map(([id, name, type], i) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setScene(id)}
                  className={`flex w-full items-center gap-3 rounded-[12px] border px-3 py-2.5 text-left transition-colors ${
                    scene === id ? "border-[#ffcf8a]/50 bg-[#ffcf8a]/10" : "border-white/8 hover:border-white/25"
                  }`}
                >
                  <span className="w-5 font-mono text-[11px] text-[#f3e2bd]/40">{i + 1}</span>
                  <span className="flex-1 text-[14.5px] text-[#f3e2bd]">{name}</span>
                  <span className="font-mono text-[11px] text-[#f3e2bd]/45">{type}</span>
                </button>
              </li>
            ))}
          </ol>
          <a
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full bg-[#f3e2bd] px-5 py-2.5 text-[14px] font-semibold text-[#1d1910] transition-transform hover:-translate-y-0.5"
          >
            Open full screen ↗
          </a>
        </div>
      </div>

      {/* A glance at the scenes */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["phone-game", "Jigsaw: rebuild the memory"],
          ["phone-words", "Words: find what he lost"],
          ["phone-diary", "Diary: his chapter, written after you"],
          ["phone-last", "Last: remember me"],
        ].map(([img, cap]) => (
          <figure key={img}>
            <div className="relative aspect-[390/844] overflow-hidden rounded-[22px] border border-white/8">
              <Image src={`/images/case-studies/eli/${img}.webp`} alt={cap} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
            </div>
            <figcaption className="mt-2 text-[12.5px] text-[#f3e2bd]/60">{cap}</figcaption>
          </figure>
        ))}
      </div>
    </Panel>
  );
}
