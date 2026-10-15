"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";

/* A Little Light: a companion lamp whose character responds to the rhythms
   of your day. Everything visual here is code: the character, its light, the
   day simulator and the placeholder sketches. */

const EASE = [0.22, 1, 0.36, 1] as const;

type Face = "sleepy" | "awake" | "happy" | "celebrate" | "nudge" | "rest" | "calm" | "asleep";

/* ------------------------------------------------------------------ */
/* Hero: the photo, with the lamp gently breathing                     */

export function LittleLightHero() {
  const reduce = useReducedMotion();
  return (
    <div className="relative aspect-[1470/630] overflow-hidden rounded-[22px] bg-[#3a2416] md:rounded-[40px]">
      <video
        src="/videos/little-light/top.mp4"
        poster="/images/case-studies/little-light/top-poster.webp"
        autoPlay={!reduce}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="The lamp shifting through warm, pink, lavender and teal light on a bedside table"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

/** A short silent loop of the lamp shifting moods. */
export function MoodVideo() {
  const reduce = useReducedMotion();
  return (
    <figure className="mb-3">
      <div className="relative aspect-[1470/630] overflow-hidden rounded-[22px] bg-[#3a2416] md:rounded-[36px]">
        <video
          src="/videos/little-light/mood.mp4"
          poster="/images/case-studies/little-light/mood-poster.webp"
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="The lamp's face and light shifting from happy to sad, to neutral, and back to a warm smile"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-2 text-[13px] text-[#666]">
        {["Happy · pink", "Low · cool white", "Neutral · soft", "Content · warm"].map((m) => (
          <span key={m} className="rounded-full bg-white px-3 py-1">
            {m}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* The character                                                       */

export function LampCharacter({ face, color, glow, size = 220 }: { face: Face; color: string; glow: number; size?: number }) {
  const reduce = useReducedMotion();
  const bounce = face === "celebrate" && !reduce;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* The light it throws */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[55%] h-[170%] w-[170%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ opacity: 0.15 + glow * 0.85, background: `radial-gradient(closest-side, ${color}cc, ${color}33 55%, transparent)` }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <motion.svg
        viewBox="0 0 200 200"
        className="relative h-full w-full"
        animate={bounce ? { y: [0, -10, 0, -6, 0] } : { y: 0 }}
        transition={bounce ? { duration: 1.1, repeat: Infinity, repeatDelay: 0.8 } : { duration: 0.4 }}
      >
        <defs>
          <radialGradient id="ll-body" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor="#fffaf0" />
            <motion.stop offset="100%" animate={{ stopColor: color }} transition={{ duration: 1.2 }} />
          </radialGradient>
        </defs>
        {/* body with ears */}
        <path
          d="M52 70 L50 30 L80 52 Q100 46 120 52 L150 30 L148 70 Q172 100 166 140 Q160 178 100 180 Q40 178 34 140 Q28 100 52 70 Z"
          fill="url(#ll-body)"
        />
        {/* feet */}
        <ellipse cx="78" cy="181" rx="9" ry="5" fill="#3a2a1d" />
        <ellipse cx="122" cy="181" rx="9" ry="5" fill="#3a2a1d" />
        {/* cheeks */}
        <motion.ellipse cx="62" cy="112" rx="11" ry="8" fill="#f2a28c" animate={{ opacity: face === "asleep" ? 0.35 : 0.75 }} />
        <motion.ellipse cx="138" cy="112" rx="11" ry="8" fill="#f2a28c" animate={{ opacity: face === "asleep" ? 0.35 : 0.75 }} />
        <FaceFeatures face={face} />
      </motion.svg>
      <AnimatePresence>
        {face === "celebrate" && !reduce && (
          <motion.div key="spark" className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-2 w-2 rounded-full"
                style={{ left: "50%", top: "30%", background: i % 2 ? "#fff3c4" : color }}
                animate={{ x: Math.cos((i / 6) * Math.PI * 2) * size * 0.55, y: Math.sin((i / 6) * Math.PI * 2) * size * 0.4 - 10, opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.08, repeatDelay: 0.5 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaceFeatures({ face }: { face: Face }) {
  const ink = "#2a1d14";
  const line = { stroke: ink, strokeWidth: 4, strokeLinecap: "round" as const, fill: "none" };
  const eyes: Record<Face, ReactNode> = {
    awake: (
      <>
        <circle cx="80" cy="100" r="5.5" fill={ink} />
        <circle cx="120" cy="100" r="5.5" fill={ink} />
      </>
    ),
    happy: (
      <>
        <circle cx="80" cy="100" r="5.5" fill={ink} />
        <circle cx="120" cy="100" r="5.5" fill={ink} />
      </>
    ),
    celebrate: (
      <>
        <path d="M72 103 Q80 93 88 103" {...line} />
        <path d="M112 103 Q120 93 128 103" {...line} />
      </>
    ),
    sleepy: (
      <>
        <path d="M72 101 Q80 106 88 101" {...line} />
        <path d="M112 101 Q120 106 128 101" {...line} />
      </>
    ),
    nudge: (
      <>
        <circle cx="80" cy="100" r="5.5" fill={ink} />
        <path d="M112 101 Q120 94 128 101" {...line} />
      </>
    ),
    rest: (
      <>
        <path d="M72 100 L88 100" {...line} />
        <path d="M112 100 L128 100" {...line} />
      </>
    ),
    calm: (
      <>
        <path d="M72 102 Q80 107 88 102" {...line} />
        <path d="M112 102 Q120 107 128 102" {...line} />
      </>
    ),
    asleep: (
      <>
        <path d="M72 103 Q80 108 88 103" {...line} />
        <path d="M112 103 Q120 108 128 103" {...line} />
      </>
    ),
  };
  const mouths: Record<Face, ReactNode> = {
    awake: <path d="M93 118 Q100 124 107 118" {...line} />,
    happy: <path d="M91 116 Q100 127 109 116" {...line} />,
    celebrate: <path d="M89 114 Q100 132 111 114 Z" fill={ink} />,
    sleepy: <ellipse cx="100" cy="121" rx="4" ry="5" fill={ink} />,
    nudge: <path d="M93 118 Q100 123 107 118" {...line} />,
    rest: <path d="M94 119 Q100 122 106 119" {...line} />,
    calm: <path d="M93 118 Q100 123 107 118" {...line} />,
    asleep: <path d="M95 120 L105 120" {...line} />,
  };
  return (
    <AnimatePresence mode="wait">
      <motion.g key={face} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
        {eyes[face]}
        {mouths[face]}
        {face === "asleep" && (
          <text x="140" y="70" fontSize="16" fill={ink} opacity="0.5" fontFamily="sans-serif">
            z
          </text>
        )}
      </motion.g>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · The questions                                                  */

export function Questions() {
  const qs = ["How much can a glance communicate?", "Can a subtle expression make a familiar object feel alive?", "How can it encourage, especially on days you need rest?"];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {qs.map((q, i) => (
        <motion.div
          key={q}
          className="rounded-[20px] bg-white p-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
        >
          <span className="text-[13px] font-semibold text-[#c9874a]">Q{i + 1}</span>
          <p className="mt-2 text-[19px] font-semibold leading-[1.3] tracking-[-0.02em] text-[#111]">{q}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Health app → mood → lamp                                       */

export function HealthFlow() {
  const reduce = useReducedMotion();
  const stats = [
    ["Sleep", "5h 40m", "restless"],
    ["Movement", "9,820 steps", "active"],
    ["Routine", "Wind-down 10pm", "on time"],
  ];
  const dots = (
    <div className="relative hidden h-px flex-1 bg-[#fbe9cf]/15 md:block">
      {!reduce &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute -top-[3px] h-[7px] w-[7px] rounded-full bg-[#ffb38a]"
            animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "linear" }}
          />
        ))}
    </div>
  );
  return (
    <div className="mb-3 overflow-hidden rounded-[22px] bg-[#1c140e] p-5 text-[#fbe9cf] md:rounded-[36px] md:p-10">
      <div className="flex flex-col items-center gap-6 md:flex-row md:gap-6">
        {/* Health app */}
        <div className="w-full max-w-[260px] rounded-[28px] border-[6px] border-[#2e2219] bg-[#fbf6ee] p-4 text-[#1c140e] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a7b5f]">Your health app · today</p>
          <div className="mt-3 flex flex-col gap-2">
            {stats.map(([k, v, tag]) => (
              <div key={k} className="flex items-center justify-between rounded-[12px] bg-white px-3 py-2">
                <span>
                  <span className="block text-[11px] text-[#9a8a7a]">{k}</span>
                  <span className="block text-[15px] font-semibold">{v}</span>
                </span>
                <span className="rounded-full bg-[#ffe7cf] px-2 py-0.5 text-[11px] font-semibold text-[#9a4d12]">{tag}</span>
              </div>
            ))}
          </div>
        </div>

        {dots}

        {/* The mood it reads */}
        <div className="w-full max-w-[240px] rounded-[20px] border border-[#fbe9cf]/12 bg-white/[0.04] p-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#fbe9cf]/55">Mood</p>
          <p className="mt-1 text-[18px] font-semibold leading-snug">Tired, but proud</p>
          <p className="mt-1 text-[13px] text-[#fbe9cf]/60">restless night + active afternoon</p>
        </div>

        {dots}

        {/* The lamp */}
        <div className="flex flex-col items-center gap-2">
          <LampCharacter face="happy" color="#ffc79a" glow={0.75} size={150} />
          <p className="text-[13px] text-[#fbe9cf]/70">Soft peach glow, a gentle smile</p>
        </div>
      </div>
      <p className="mt-8 text-center text-[13px] text-[#fbe9cf]/50">No buttons, no logging. It reads the day you&apos;re already having.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Signals → behaviors                                            */

export function SignalMap() {
  const rows = [
    { signal: "Sleep", from: "Restless night", to: "Soft glow, sleepy eyes", face: "sleepy" as Face, color: "#f4c27a" },
    { signal: "Movement", from: "Active afternoon", to: "Brighter color, a small celebration", face: "celebrate" as Face, color: "#ffb38a" },
    { signal: "Routine", from: "Evening approaches", to: "Warm light, relaxed face", face: "calm" as Face, color: "#f0a35e" },
  ];
  return (
    <div className="overflow-hidden rounded-[22px] bg-[#1c140e] p-4 text-[#fbe9cf] md:rounded-[36px] md:p-8">
      <div className="grid gap-3">
        {rows.map((r) => (
          <div key={r.signal} className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-[18px] bg-white/[0.04] p-4 md:grid-cols-[150px_1fr_auto_1fr_120px] md:gap-6 md:p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#fbe9cf]/55 md:text-[13px]">{r.signal}</p>
            <div className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto">
              <p className="text-[17px] font-semibold">{r.from}</p>
            </div>
            <span className="hidden text-[#fbe9cf]/35 md:block">→</span>
            <p className="col-span-2 row-start-3 text-[15px] text-[#fbe9cf]/80 md:col-span-1 md:row-start-auto">{r.to}</p>
            <div className="col-start-2 row-start-1 flex justify-end md:col-start-auto md:row-start-auto">
              <LampCharacter face={r.face} color={r.color} glow={r.face === "sleepy" ? 0.35 : r.face === "calm" ? 0.55 : 0.9} size={76} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · A day with the light (interactive)                             */

type DayState = { face: Face; color: string; glow: number; says: string; label: string };

function readDay(hour: number, restless: boolean, active: boolean): DayState {
  if (hour >= 22) return { face: "asleep", color: "#c98a4a", glow: 0.15, says: "Time to wind down.", label: "Night" };
  if (hour >= 18) return { face: "calm", color: "#f0a35e", glow: 0.5, says: "Settling in for the evening.", label: "Evening" };
  if (hour >= 12) {
    if (active) return { face: "celebrate", color: "#ffb38a", glow: 1, says: "You moved today. Little celebration!", label: "Afternoon" };
    if (restless) return { face: "rest", color: "#f6d3a1", glow: 0.4, says: "Rest counts too.", label: "Afternoon" };
    return { face: "nudge", color: "#ffd59a", glow: 0.65, says: "A short walk? No pressure.", label: "Afternoon" };
  }
  if (restless) return { face: "sleepy", color: "#f4c27a", glow: 0.35, says: "Slow start. Take it easy.", label: "Morning" };
  return { face: "happy", color: "#fff1c9", glow: 0.8, says: "Good morning.", label: "Morning" };
}

function fmt(h: number) {
  const hr = Math.floor(h);
  const ampm = hr >= 12 ? "pm" : "am";
  return `${((hr + 11) % 12) + 1}${ampm}`;
}

export function DaySimulator() {
  const [hour, setHour] = useState(8);
  const [restless, setRestless] = useState(true);
  const [active, setActive] = useState(true);
  const s = useMemo(() => readDay(hour, restless, active), [hour, restless, active]);

  return (
    <div className="overflow-hidden rounded-[22px] bg-[#1c140e] text-[#fbe9cf] md:rounded-[36px]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        {/* The light */}
        <motion.div
          className="relative flex min-h-[360px] flex-col items-center justify-center gap-6 p-8 md:min-h-[460px]"
          animate={{ background: `radial-gradient(ellipse at 50% 60%, ${s.color}${Math.round(20 + s.glow * 40).toString(16).padStart(2, "0")}, #1c140e 70%)` }}
          transition={{ duration: 1.2 }}
        >
          <LampCharacter face={s.face} color={s.color} glow={s.glow} />
          <AnimatePresence mode="wait">
            <motion.p
              key={s.says}
              className="text-center text-[17px] font-medium text-[#fff4e2]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35 }}
            >
              {s.says}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* The day */}
        <div className="flex flex-col gap-7 border-t border-white/5 p-6 md:p-10 lg:border-l lg:border-t-0">
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fbe9cf]/55">Time of day</p>
              <p className="text-[22px] font-bold tracking-[-0.02em]">
                {fmt(hour)} <span className="text-[14px] font-medium text-[#fbe9cf]/55">· {s.label}</span>
              </p>
            </div>
            <input
              type="range"
              min={6}
              max={23}
              step={1}
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              aria-label="Time of day"
              className="mt-4 w-full accent-[#ffb38a]"
            />
            <div className="mt-1 flex justify-between text-[11.5px] text-[#fbe9cf]/40">
              <span>6am</span>
              <span>noon</span>
              <span>6pm</span>
              <span>11pm</span>
            </div>
          </div>
          <Toggle label="Last night" a="Restless" b="Rested" on={restless} onChange={setRestless} />
          <Toggle label="Movement" a="Active" b="Still" on={active} onChange={setActive} />
          <div className="mt-auto grid grid-cols-3 gap-2">
            {[
              ["Face", s.face],
              ["Glow", `${Math.round(s.glow * 100)}%`],
              ["Color", s.color],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[12px] border border-white/8 p-3">
                <p className="text-[11px] text-[#fbe9cf]/45">{k}</p>
                <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[12.5px]">
                  {k === "Color" && <span className="h-3 w-3 rounded-full" style={{ background: v }} />}
                  {v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, a, b, on, onChange }: { label: string; a: string; b: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fbe9cf]/55">{label}</p>
      <div className="inline-flex rounded-full bg-white/[0.06] p-1">
        {[
          [a, true],
          [b, false],
        ].map(([name, val]) => (
          <button
            key={name as string}
            type="button"
            onClick={() => onChange(val as boolean)}
            className={`rounded-full px-4 py-1.5 text-[13.5px] font-medium transition-colors ${on === val ? "bg-[#fbe9cf] text-[#1c140e]" : "text-[#fbe9cf]/70 hover:text-[#fbe9cf]"}`}
          >
            {name as string}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · Moods: tap a mood, see the real lamp change                    */

const MOODS = [
  { id: "happy", label: "Happy", color: "#ffd66b", tint: "#fff3cf", signal: "Slept well and moved today", light: "Warm yellow, bright" },
  { id: "tired", label: "Tired", color: "#ff8fc8", tint: "#ffe3f1", signal: "A short night of sleep", light: "Soft pink, dimmed" },
  { id: "sleepy", label: "Sleepy", color: "#6fb8ff", tint: "#e1f0ff", signal: "Past your wind-down time", light: "Cool blue, low" },
  { id: "sick", label: "Sick", color: "#6fe08a", tint: "#e2f8e6", signal: "Resting heart rate higher than usual", light: "Calm green, gentle" },
  { id: "grumpy", label: "Grumpy", color: "#ff6b5e", tint: "#ffe3df", signal: "A restless, broken night", light: "Coral red, steady" },
] as const;

export function MoodPicker() {
  const [active, setActive] = useState<(typeof MOODS)[number]["id"]>("happy");
  const m = MOODS.find((x) => x.id === active)!;
  return (
    <motion.div
      className="overflow-hidden rounded-[22px] p-3 md:rounded-[36px] md:p-5"
      animate={{ backgroundColor: m.tint }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
        {/* The lamp */}
        <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[#6f6c72] md:rounded-[28px]">
          <AnimatePresence initial={false}>
            <motion.img
              key={m.id}
              src={`/images/case-studies/little-light/mood-${m.id}.webp`}
              alt={`The lamp feeling ${m.label.toLowerCase()}: ${m.light.toLowerCase()}`}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </AnimatePresence>
        </div>

        {/* The moods */}
        <div className="px-2 pb-3 md:px-0 md:pb-0 md:pr-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#111]/45">Choose a mood</p>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Lamp mood">
            {MOODS.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={x.id === active}
                onClick={() => setActive(x.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-all ${
                  x.id === active ? "bg-[#111] text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)]" : "bg-white text-[#111] hover:-translate-y-0.5"
                }`}
              >
                <span className="h-3 w-3 rounded-full" style={{ background: x.color, boxShadow: `0 0 10px ${x.color}` }} />
                {x.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={m.id}
              className="mt-8 border-t border-[#111]/10 pt-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <p className="text-[34px] font-bold tracking-[-0.03em] text-[#111] md:text-[44px]">{m.label}</p>
              <dl className="mt-4 grid gap-3">
                <div>
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#111]/45">When your day shows</dt>
                  <dd className="mt-0.5 text-[17px] text-[#111]">{m.signal}</dd>
                </div>
                <div>
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#111]/45">The lamp responds</dt>
                  <dd className="mt-0.5 flex items-center gap-2 text-[17px] text-[#111]">
                    <span className="h-3.5 w-3.5 rounded-full" style={{ background: m.color }} />
                    {m.light}
                  </dd>
                </div>
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · Principles                                                     */

export function Principles() {
  const items = [
    ["A glance, not a notification", "No sounds, no badges. Light and a face you notice when you look."],
    ["Rest is a good day too", "A slow day gets warmth, never a frown or a streak lost."],
    ["Subtle over spectacular", "Small shifts in color and expression. Celebrations stay small."],
    ["Yours, and only yours", "Health data stays private. The lamp shows a mood, never a number."],
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([h, b], i) => (
        <motion.div
          key={h}
          className="rounded-[20px] bg-white p-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
        >
          <p className="text-[18px] font-bold tracking-[-0.02em] text-[#111]">{h}</p>
          <p className="mt-1.5 text-[15px] leading-[1.5] text-[#666]">{b}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · Process, with placeholder sketches                             */

const STEPS: { title: string; line: string; status: "Exploring" | "Next" | "Later"; sketch: ReactNode }[] = [
  { title: "Define the personality", line: "Who is this little light? Expression sheet and voice.", status: "Exploring", sketch: <ExpressionSketch /> },
  { title: "Prototype behaviors", line: "Faces and light on a screen, driven by mock data.", status: "Exploring", sketch: <ScreenSketch /> },
  { title: "Build the lamp", line: "A small screen inside a soft diffuser body.", status: "Next", sketch: <LampSketch /> },
  { title: "Connect health data", line: "Sleep, movement and routine from my health app.", status: "Later", sketch: <DataSketch /> },
];

export function Process() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((s, i) => (
        <div key={s.title} className="flex flex-col overflow-hidden rounded-[20px] bg-white">
          <div className="flex h-[170px] items-center justify-center bg-[#fbf6ee] [background-image:radial-gradient(#e8dccb_1px,transparent_1px)] [background-size:14px_14px]">
            {s.sketch}
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold tabular-nums text-[#999]">{String(i + 1).padStart(2, "0")}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${
                  s.status === "Exploring" ? "bg-[#ffe7cf] text-[#9a4d12]" : "bg-[#f1f1f1] text-[#777]"
                }`}
              >
                {s.status}
              </span>
            </div>
            <p className="mt-2 text-[17px] font-bold tracking-[-0.02em] text-[#111]">{s.title}</p>
            <p className="mt-1 text-[14px] leading-[1.5] text-[#666]">{s.line}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const pen = { fill: "none", stroke: "#5b4636", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function MiniFace({ x, y, eyes, mouth }: { x: number; y: number; eyes: string; mouth: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-22 -8 L-23 -26 L-10 -17 Q0 -20 10 -17 L23 -26 L22 -8 Q30 6 26 18 Q22 30 0 30 Q-22 30 -26 18 Q-30 6 -22 -8 Z" {...pen} />
      <path d={eyes} {...pen} />
      <path d={mouth} {...pen} />
    </g>
  );
}

function ExpressionSketch() {
  return (
    <svg viewBox="0 0 220 150" className="h-[150px] w-[220px]" aria-hidden="true">
      <MiniFace x={55} y={45} eyes="M-10 0 h0.1 M10 0 h0.1" mouth="M-5 9 Q0 13 5 9" />
      <MiniFace x={165} y={45} eyes="M-13 1 Q-9 4 -5 1 M5 1 Q9 4 13 1" mouth="M-2 10 h4" />
      <MiniFace x={55} y={110} eyes="M-13 2 Q-9 -4 -5 2 M5 2 Q9 -4 13 2" mouth="M-6 8 Q0 18 6 8 Z" />
      <MiniFace x={165} y={110} eyes="M-13 0 h8 M5 0 h8" mouth="M-4 10 Q0 12 4 10" />
    </svg>
  );
}

function ScreenSketch() {
  return (
    <svg viewBox="0 0 220 150" className="h-[150px] w-[220px]" aria-hidden="true">
      <rect x="40" y="20" width="140" height="100" rx="10" {...pen} />
      <MiniFace x={110} y={66} eyes="M-10 0 h0.1 M10 0 h0.1" mouth="M-5 9 Q0 13 5 9" />
      <path d="M90 132 h40 M110 120 v12" {...pen} />
      <path d="M150 34 l10 -8 M160 44 l12 -2" {...pen} strokeDasharray="3 4" />
    </svg>
  );
}

function LampSketch() {
  return (
    <svg viewBox="0 0 220 150" className="h-[150px] w-[220px]" aria-hidden="true">
      <path d="M78 40 L76 14 L96 28 Q110 24 124 28 L144 14 L142 40" {...pen} />
      <path d="M78 40 Q62 62 66 84 Q70 104 110 104 Q150 104 154 84 Q158 62 142 40" {...pen} strokeDasharray="5 4" />
      <rect x="92" y="54" width="36" height="26" rx="4" {...pen} />
      <path d="M100 86 h20 v8 h-20 z" {...pen} />
      <path d="M70 116 h80 M74 116 v10 h72 v-10" {...pen} />
      <text x="160" y="60" fontSize="10" fill="#8a7563" fontFamily="sans-serif">diffuser</text>
      <text x="160" y="76" fontSize="10" fill="#8a7563" fontFamily="sans-serif">screen</text>
      <text x="160" y="124" fontSize="10" fill="#8a7563" fontFamily="sans-serif">base</text>
      <path d="M156 58 L146 60 M156 74 L130 68 M156 122 L148 120" {...pen} strokeWidth={1} />
    </svg>
  );
}

function DataSketch() {
  return (
    <svg viewBox="0 0 220 150" className="h-[150px] w-[220px]" aria-hidden="true">
      <rect x="22" y="28" width="56" height="94" rx="10" {...pen} />
      <path d="M34 98 L44 84 L54 92 L66 64" {...pen} />
      <path d="M34 50 h32 M34 60 h20" {...pen} />
      <path d="M88 75 h44" {...pen} strokeDasharray="4 5" />
      <path d="M126 69 l8 6 -8 6" {...pen} />
      <MiniFace x={172} y={76} eyes="M-13 2 Q-9 -4 -5 2 M5 2 Q9 -4 13 2" mouth="M-6 8 Q0 18 6 8 Z" />
    </svg>
  );
}
