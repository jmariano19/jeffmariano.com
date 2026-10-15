"use client";

import { useState } from "react";

const moments = [
  { name: "Morning", color: "#ffc46a", edge: "#ef883a", face: "sleepy", title: "A softer start.", text: "After a restless night, a gentle glow and sleepy eyes could greet me. A little reminder to ease into the day." },
  { name: "Active day", color: "#a9ebbb", edge: "#43aa88", face: "happy", title: "A little celebration.", text: "After a walk or a basketball session, a brighter glow and a happy face could celebrate that I moved." },
  { name: "Wind down", color: "#ffb775", edge: "#d76c48", face: "rest", title: "Time to slow down.", text: "As bedtime approaches, warm light and relaxed eyes could help create a quieter evening ritual." },
] as const;

export function LampCharacter({ color = "#ffc46a", edge = "#ef883a", face = "sleepy" }: { color?: string; edge?: string; face?: string }) {
  return (
    <svg viewBox="0 0 440 420" role="img" aria-label={face + " companion lamp"} className="mx-auto w-full max-w-[440px]">
      <defs>
        <radialGradient id={"lamp-body-" + face} cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fff1c5" /><stop offset="48%" stopColor={color} /><stop offset="100%" stopColor={edge} />
        </radialGradient>
        <radialGradient id={"lamp-halo-" + face}><stop stopColor={color} stopOpacity=".28" /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="220" cy="215" rx="215" ry="200" fill={"url(#lamp-halo-" + face + ")"} />
      <ellipse cx="220" cy="371" rx="116" ry="14" fill="#100b08" opacity=".32" />
      <g className="lamp-float">
        <path d="M104 298C101 250 126 228 134 183C142 129 160 79 216 76C282 71 306 131 311 189C316 241 342 286 326 329C311 371 268 371 216 369C162 368 110 366 104 328Z" fill={"url(#lamp-body-" + face + ")"} />
        <ellipse cx="143" cy="353" rx="16" ry="12" fill={edge} /><ellipse cx="287" cy="355" rx="16" ry="12" fill={edge} />
        <ellipse cx="116" cy="277" rx="10" ry="17" fill={edge} opacity=".6" /><ellipse cx="316" cy="277" rx="10" ry="17" fill={edge} opacity=".6" />
        <g fill="none" stroke="#39231f" strokeWidth="7" strokeLinecap="round">
          {face === "happy" ? <><path d="M169 220Q179 203 189 220" /><path d="M246 220Q256 203 266 220" /><path d="M208 237Q219 250 231 237" /></> :
           face === "rest" ? <><path d="M169 219Q179 228 189 219" /><path d="M246 219Q256 228 266 219" /><path d="M214 241h10" /></> :
           <><path d="M173 216v7" /><path d="M255 216v7" /><path d="M211 238q9-4 17 0" /></>}
        </g>
        <ellipse cx="163" cy="237" rx="13" ry="7" fill="#e86f63" opacity=".6" /><ellipse cx="270" cy="237" rx="13" ry="7" fill="#e86f63" opacity=".6" />
        <circle cx="178" cy="151" r="4" fill="#fff7b8" opacity=".7" /><circle cx="277" cy="180" r="3" fill="#fff7b8" opacity=".7" />
      </g>
    </svg>
  );
}

export default function LampExperience() {
  const [selected, setSelected] = useState(0);
  const moment = moments[selected];
  return (
    <section aria-label="Try the lamp concept" className="overflow-hidden rounded-[24px] bg-[#211b18] text-[#fff4df]">
      <div className="grid items-center md:grid-cols-2">
        <div className="px-5 pt-6 md:p-10"><LampCharacter color={moment.color} edge={moment.edge} face={moment.face} /></div>
        <div className="px-6 pb-10 md:p-12">
          <p className="text-xs uppercase tracking-[.16em] text-[#d8bda8]">Imagine a day together</p>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Choose a moment">
            {moments.map((item, i) => <button key={item.name} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)} className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${selected === i ? "border-[#ffe0b0] bg-[#ffe0b0] text-[#211b18]" : "border-[#79685a] text-[#fff4df] hover:bg-white/10"}`}>{item.name}</button>)}
          </div>
          <div aria-live="polite" aria-atomic="true" className="min-h-[190px]">
            <h2 className="mt-8 text-3xl font-semibold tracking-[-.04em]">{moment.title}</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-[#e0cbbb]">{moment.text}</p>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-[#c3ad9b]">Interactive concept · Simulated states · No health data connected</p>
        </div>
      </div>
      <style jsx>{`@keyframes lamp-breathe { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-5px) } } :global(.lamp-float) { animation:lamp-breathe 5s ease-in-out infinite; } @media(prefers-reduced-motion:reduce) { :global(.lamp-float) { animation:none; } }`}</style>
    </section>
  );
}
