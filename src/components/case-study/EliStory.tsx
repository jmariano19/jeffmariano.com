"use client";

import Image from "next/image";
import { Caveat } from "next/font/google";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";

const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"] });

/**
 * Eli's interactive story.
 *
 *  intro – key art and a beating-heart "Start Interactive Story" button
 *  story – the trailer plays with sound (skippable)
 *  chat  – four beats in the lab, each answered with a different generative UI:
 *            1. the visitor types a memory of their own   → Eli offers lab objects
 *            2. they pick an object                       → Eli finds Dad's smudged note
 *            3. they finish the note in their own words   → Eli asks about the teal flask
 *            4. they decide                               → goodbye
 *          The glow in Eli's chest follows his trust (the game's State Grammar).
 *  done  – Dad's note comes back restored, finished in the visitor's words,
 *          and the visitor is invited to see how Eli is designed.
 */

type Stage = "intro" | "story" | "chat" | "done";
type ObjectId = "flask" | "notebook" | "lamp" | "musicbox" | "photo" | "coat";
type LabObject = { id: ObjectId; name: string; line: string };
type Decision = { question: string; a: string; b: string };
type Memory = { title: string; quote: string };
type Meta = { beat: number; ui: string; trust: number; source: string };
type NewItem =
  | { kind: "eli"; text: string; meta?: Meta }
  | { kind: "you"; text: string }
  | { kind: "memory"; title: string; quote: string }
  | { kind: "note"; prefix: string; ending: string };
type Item = NewItem & { id: number };
type Action =
  | { type: "text" }
  | { type: "objects"; objects: LabObject[] }
  | { type: "notebook"; prefix: string }
  | { type: "decision"; decision: Decision };
type TurnResponse = {
  say?: string;
  trust?: number;
  memory?: Memory;
  objects?: LabObject[];
  notebook?: { prefix: string };
  decision?: Decision;
  done?: boolean;
  source?: string;
  error?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const BEATS = 4;
const OPENING = [
  "…you can see me?",
  "This is my dad's lab. Something happened here, and now I can't remember.",
  "Maybe if you tell me one of your memories, mine will come back too. What's something you remember from when you were little?",
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function EliStory() {
  const reduce = useReducedMotion();
  const storyRef = useRef<HTMLVideoElement>(null);
  const idleRef = useRef<HTMLVideoElement>(null);
  const deskScroll = useRef<HTMLDivElement>(null);
  const phoneScroll = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const runRef = useRef(0);

  const [stage, setStage] = useState<Stage>("intro");
  const [muted, setMuted] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [action, setAction] = useState<Action | null>(null);
  const [beat, setBeat] = useState(1);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [note, setNote] = useState<{ prefix: string; ending: string } | null>(null);
  const [trust, setTrust] = useState(0.15);
  const [error, setError] = useState<string | null>(null);
  const [showSystem, setShowSystem] = useState(false);

  const push = useCallback((item: NewItem) => {
    setItems((list) => [...list, { ...item, id: idRef.current++ }]);
  }, []);

  // Type Eli's line out, then commit it to the conversation.
  const say = useCallback(
    async (text: string, meta?: Meta) => {
      const run = runRef.current;
      if (!reduce) {
        for (let i = 1; i <= text.length; i++) {
          if (run !== runRef.current) return;
          setTyping(text.slice(0, i));
          const ch = text[i - 1];
          await wait(ch === "…" || ch === "." || ch === "?" ? 170 : ch === "," ? 90 : 26);
        }
        await wait(200);
      }
      if (run !== runRef.current) return;
      setTyping(null);
      push({ kind: "eli", text, meta });
    },
    [reduce, push],
  );

  const toChat = useCallback(() => {
    storyRef.current?.pause();
    setStage("chat");
    idleRef.current?.play().catch(() => {});
  }, []);

  const start = () => {
    runRef.current += 1;
    setItems([]);
    setMemories([]);
    setNote(null);
    setAction(null);
    setBeat(1);
    setTrust(0.15);
    setTyping(null);
    setThinking(false);
    setError(null);
    setStage("story");
    const v = storyRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = muted;
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => toChat());
      });
    }
    idleRef.current?.load();
  };

  // Eli's opening lines once the loop takes over; the first answer is typed.
  useEffect(() => {
    if (stage !== "chat" || items.length > 0) return;
    const run = runRef.current;
    (async () => {
      await wait(reduce ? 0 : 1100);
      for (const t of OPENING) {
        if (run !== runRef.current) return;
        await say(t);
        await wait(reduce ? 0 : 450);
      }
      if (run !== runRef.current) return;
      setTrust(0.25);
      setAction({ type: "text" });
    })();
    // Only when entering the chat stage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Keep the newest line in view.
  useEffect(() => {
    for (const el of [deskScroll.current, phoneScroll.current]) {
      el?.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
    }
  }, [items, typing, thinking, action, stage, reduce]);

  /** One beat: show the visitor's answer, ask Eli, render his reply and the next UI. */
  const answer = async (text: string, show: NewItem) => {
    const clean = text.trim().slice(0, 280);
    if (!clean || !action) return;
    const run = runRef.current;
    const current = action;
    const history: Item[] = [...items, { id: -1, kind: "you", text: clean }];
    push(show);
    setAction(null);
    setThinking(true);
    setError(null);

    let data: TurnResponse;
    try {
      const res = await fetch("/api/eli", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          beat,
          messages: history
            .filter((i) => i.kind === "eli" || i.kind === "you")
            .map((i) => ({ role: i.kind === "you" ? "user" : "assistant", content: (i as { text: string }).text })),
        }),
      });
      data = (await res.json()) as TurnResponse;
      if (!res.ok || !data.say) throw new Error(data.error);
    } catch (e) {
      if (run !== runRef.current) return;
      setThinking(false);
      setItems((list) => list.slice(0, -1));
      setError((e as Error).message || "Eli didn't hear you. Try again.");
      setAction(current);
      return;
    }
    if (run !== runRef.current) return;

    const next: Action | null = data.objects?.length
      ? { type: "objects", objects: data.objects }
      : data.notebook
        ? { type: "notebook", prefix: data.notebook.prefix }
        : data.decision
          ? { type: "decision", decision: data.decision }
          : null;

    setThinking(false);
    await wait(reduce ? 0 : 300);
    await say(data.say, {
      beat,
      ui: next ? next.type : "goodbye",
      trust: data.trust ?? trust,
      source: data.source ?? "scripted",
    });
    if (run !== runRef.current) return;

    if (typeof data.trust === "number") setTrust(data.trust);
    if (data.memory) {
      await wait(reduce ? 0 : 300);
      push({ kind: "memory", title: data.memory.title, quote: data.memory.quote });
      setMemories((m) => [...m, data.memory!].slice(0, BEATS));
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.([18, 90, 24]);
    }

    if (data.done || !next) {
      await wait(reduce ? 0 : 1600);
      if (run === runRef.current) setStage("done");
      return;
    }
    await wait(reduce ? 0 : 400);
    setBeat((b) => b + 1);
    setAction(next);
  };

  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    if (storyRef.current) storyRef.current.muted = m;
  };

  const talking = stage === "chat" || stage === "done";
  const convo = { items, typing, thinking, showSystem, done: stage === "done", note, onReplay: start };
  const act = {
    action: stage === "chat" ? action : null,
    error,
    onText: (t: string) => answer(t, { kind: "you", text: t.trim() }),
    onObject: (o: LabObject) => answer(o.name, { kind: "you", text: o.name }),
    onNote: (prefix: string, ending: string) => {
      setNote({ prefix, ending: ending.trim() });
      answer(ending, { kind: "note", prefix, ending: ending.trim() });
    },
    onDecide: (choice: string) => answer(choice, { kind: "you", text: choice }),
  };

  return (
    <div className="overflow-hidden rounded-[22px] bg-[#14110b] md:rounded-[40px]">
      {/* The frame opens up when the conversation starts, to make room for it */}
      <div
        className={`relative w-full pb-[75%] transition-[padding] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          talking ? "sm:pb-[42.38%] md:pb-[56.25%]" : "sm:pb-[42.38%]"
        }`}
      >
        <Image
          src="/images/home/eli-card-bg.webp"
          alt="Eli standing alone in his father's lab"
          fill
          priority
          sizes="(max-width: 1440px) 100vw, 1304px"
          className="object-cover object-[80%_center]"
        />
        <video
          ref={storyRef}
          src="/videos/eli/eli-story.mp4"
          playsInline
          preload="metadata"
          onEnded={toChat}
          className={`absolute inset-0 h-full w-full object-cover object-[80%_center] transition-opacity duration-500 ${
            stage === "story" ? "opacity-100" : "opacity-0"
          }`}
        />
        <video
          ref={idleRef}
          src="/videos/eli/eli-idle.mp4"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover object-[80%_center] transition-opacity duration-700 ${
            talking ? "opacity-100" : "opacity-0"
          }`}
        />

        {talking && <ChestGlow trust={trust} still={!!reduce} />}

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
            stage === "story" ? "opacity-0" : "opacity-100"
          } ${
            talking
              ? "bg-[linear-gradient(to_right,rgba(14,11,6,0.92),rgba(14,11,6,0.72)_40%,rgba(14,11,6,0.1)_62%,transparent_70%)]"
              : "bg-[linear-gradient(to_right,rgba(14,11,6,0.6),transparent_60%)]"
          }`}
        />

        {/* Intro: one button, with a heart that beats */}
        <AnimatePresence>
          {stage === "intro" && (
            <motion.div
              key="intro"
              className="absolute inset-0 flex items-end pb-[6%] pl-[6%] sm:items-center sm:pb-0 sm:pl-[11%]"
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.4 } }}
            >
              <button
                type="button"
                onClick={start}
                className="group flex items-center gap-4 rounded-full border border-[#f3e2bd]/15 bg-[#2a2016]/45 py-2.5 pl-2.5 pr-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors hover:border-[#f3e2bd]/30 hover:bg-[#2a2016]/65 md:gap-6 md:py-4 md:pl-4 md:pr-12"
              >
                <Heartbeat still={!!reduce} />
                <span className="text-[17px] font-semibold tracking-[-0.01em] text-[#f3e2bd] sm:text-[20px] md:text-[clamp(20px,2.1vw,30px)]">
                  Start Interactive Story
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {stage === "story" && (
          <div className="absolute bottom-3 right-3 flex gap-2 md:bottom-6 md:right-6">
            <Pill onClick={toggleMute}>{muted ? "Sound on" : "Mute"}</Pill>
            <Pill onClick={toChat}>Skip to Eli →</Pill>
          </div>
        )}

        {talking && (
          <motion.div
            className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <MemorySlots memories={memories} />
            <div className="hidden md:block">
              <SystemToggle on={showSystem} onChange={setShowSystem} />
            </div>
          </motion.div>
        )}

        {/* Desktop: the conversation lives in the dark left half of the frame */}
        {talking && (
          <div className="absolute bottom-0 left-0 top-[64px] hidden w-[50%] flex-col md:flex">
            <Conversation {...convo} scrollRef={deskScroll} />
            <ActionArea {...act} autoFocus />
          </div>
        )}
      </div>

      {/* Phone: the conversation sits under the picture */}
      {talking && (
        <div className="md:hidden">
          <div className="flex h-[360px] flex-col">
            <Conversation {...convo} scrollRef={phoneScroll} />
          </div>
          <ActionArea {...act} />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Pill({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-medium text-white/85 backdrop-blur transition-colors hover:bg-black/65 md:text-[13px]"
    >
      {children}
    </button>
  );
}

function ChestGlow({ trust, still }: { trust: number; still: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-[72%] top-[80%] h-0 w-0">
      <motion.div
        className="absolute h-[18vw] max-h-[260px] w-[18vw] max-w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(10,7,3,0.75),transparent)]"
        animate={{ opacity: Math.max(0, 0.7 - trust) }}
        transition={{ duration: 1.6 }}
      />
      <motion.div
        className="absolute h-[22vw] max-h-[320px] w-[22vw] max-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,196,120,0.55),rgba(255,150,60,0.18)_55%,transparent)] mix-blend-screen"
        animate={
          still
            ? { opacity: Math.min(1, trust * 1.1) }
            : { opacity: [trust * 0.7, Math.min(1, trust * 1.2), trust * 0.7], scale: [0.96, 1.05, 0.96] }
        }
        transition={still ? { duration: 1.6 } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function MemorySlots({ memories }: { memories: Memory[] }) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#f3e2bd]/55 md:text-[11px]">
        Memories recovered · {memories.length}/{BEATS}
      </p>
      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: BEATS }).map((_, i) => {
          const m = memories[i];
          return (
            <motion.span
              key={i}
              layout
              title={m ? `${m.title}: “${m.quote}”` : undefined}
              className={`flex h-[26px] items-center overflow-hidden rounded-full border px-2.5 text-[11.5px] font-medium ${
                m ? "border-[#ffcf8a]/50 bg-[#ffcf8a]/15 text-[#ffe2b3]" : "w-[26px] border-dashed border-[#f3e2bd]/25"
              }`}
              initial={false}
              animate={m ? { boxShadow: ["0 0 0px rgba(255,190,110,0)", "0 0 22px rgba(255,190,110,0.55)", "0 0 0px rgba(255,190,110,0)"] } : {}}
              transition={{ duration: 1.4 }}
            >
              {m && <span className="hidden whitespace-nowrap lg:inline">{m.title}</span>}
              {m && <span className="lg:hidden">✦</span>}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

function SystemToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex items-center gap-2 rounded-full bg-black/40 py-1.5 pl-3 pr-1.5 text-[12px] font-medium text-[#f3e2bd]/80 backdrop-blur transition-colors hover:bg-black/60"
    >
      How Eli thinks
      <span className={`flex h-[18px] w-[30px] items-center rounded-full p-[2px] transition-colors ${on ? "bg-[#ffcf8a]" : "bg-white/20"}`}>
        <span className={`h-[14px] w-[14px] rounded-full bg-[#14110b] transition-transform ${on ? "translate-x-[12px]" : ""}`} />
      </span>
    </button>
  );
}

function Conversation({
  items,
  typing,
  thinking,
  showSystem,
  done,
  note,
  onReplay,
  scrollRef,
}: {
  items: Item[];
  typing: string | null;
  thinking: boolean;
  showSystem: boolean;
  done: boolean;
  note: { prefix: string; ending: string } | null;
  onReplay: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={scrollRef}
      aria-live="polite"
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 pb-3 pt-4 [mask-image:linear-gradient(to_bottom,transparent,black_14%)] [scrollbar-width:none] [&>*]:shrink-0 md:pl-[11%] md:pr-[6%]"
    >
      <div className="mt-auto" />
      {items.map((it) => {
        if (it.kind === "eli") return <EliLine key={it.id} text={it.text} meta={showSystem ? it.meta : undefined} />;
        if (it.kind === "you") return <YouLine key={it.id} text={it.text} />;
        if (it.kind === "note") return <NotePage key={it.id} prefix={it.prefix} ending={it.ending} />;
        return <MemoryCard key={it.id} title={it.title} quote={it.quote} />;
      })}
      {typing !== null && <EliLine text={typing} live />}
      {thinking && <Remembering />}
      {done && <Finale note={note} onReplay={onReplay} />}
    </div>
  );
}

function YouLine({ text }: { text: string }) {
  return (
    <motion.p
      className="max-w-[85%] self-end rounded-[16px] rounded-br-[6px] bg-[#f3e2bd]/12 px-4 py-2 text-[14.5px] leading-[1.45] text-[#f3e2bd]/90 md:text-[15px]"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {text}
    </motion.p>
  );
}

function EliLine({ text, live, meta }: { text: string; live?: boolean; meta?: Meta }) {
  return (
    <div className="max-w-[96%]">
      <p className="text-[17px] leading-[1.45] tracking-[-0.01em] text-[#f3e2bd] md:text-[clamp(16px,1.5vw,20px)]">
        {text}
        {live && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[#f3e2bd]/80" />}
      </p>
      <AnimatePresence>
        {meta && (
          <motion.p
            className="mt-1.5 flex flex-wrap gap-1.5 font-mono text-[10.5px] text-[#9fd8d0]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {[`beat ${meta.beat}/${BEATS}`, `next ui: ${meta.ui}`, `trust: ${meta.trust.toFixed(2)} → glow`, `model: ${meta.source}`].map((t) => (
              <span key={t} className="rounded-[4px] bg-[#9fd8d0]/10 px-1.5 py-0.5">
                {t}
              </span>
            ))}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function MemoryCard({ title, quote }: { title: string; quote: string }) {
  return (
    <motion.div
      className="relative max-w-[88%] overflow-hidden rounded-[14px] border border-[#ffcf8a]/25 bg-[linear-gradient(135deg,rgba(255,207,138,0.14),rgba(255,207,138,0.04))] px-4 py-2.5"
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,226,179,0.25),transparent)]"
        initial={{ x: "0%" }}
        animate={{ x: "420%" }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
      />
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#ffcf8a]/80">✦ Memory recovered · {title}</p>
      <p className="mt-1 text-[14px] italic leading-[1.45] text-[#f3e2bd]/75">“{quote}”</p>
    </motion.div>
  );
}

/** A page from Dad's notebook: his words, and the visitor's in the smudged gap. */
function NotePage({ prefix, ending, children }: { prefix: string; ending?: string; children?: ReactNode }) {
  return (
    <motion.div
      className="relative max-w-[94%] rounded-[6px] bg-[#e9dcc0] px-5 pb-4 pt-3 text-[#3a2a17] shadow-[0_12px_40px_rgba(0,0,0,0.45)] [background-image:repeating-linear-gradient(transparent,transparent_27px,rgba(58,42,23,0.13)_27px,rgba(58,42,23,0.13)_28px)]"
      initial={{ opacity: 0, y: 12, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -0.6 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3a2a17]/50">Dad&apos;s notebook</p>
      <p className={`${hand.className} mt-1 text-[24px] leading-[28px] md:text-[26px]`}>
        {prefix} {ending !== undefined ? <span className="text-[#8a4b12]">{ending}</span> : null}
      </p>
      {children}
    </motion.div>
  );
}

function Remembering() {
  return (
    <p className="eli-shimmer w-fit py-1 text-[14px] font-medium" aria-label="Eli is remembering">
      Eli is remembering…
    </p>
  );
}

/** The ending: Dad's note, restored in the visitor's words, and a way into the case study. */
function Finale({ note, onReplay }: { note: { prefix: string; ending: string } | null; onReplay: () => void }) {
  const learnMore = () => {
    document.getElementById("eli-design")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <motion.div
      className="mt-3 rounded-[18px] border border-[#ffcf8a]/30 bg-[#1d160c]/85 p-5 shadow-[0_0_60px_rgba(255,180,90,0.12)]"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.2 }}
    >
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#ffcf8a]/80">A memory restored</p>
      {note && (
        <motion.p
          className={`${hand.className} mt-2 text-[26px] leading-[1.15] text-[#ffe2b3] md:text-[30px]`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          “{note.prefix} <span className="text-[#ffcf8a]">{note.ending}</span>”
        </motion.p>
      )}
      <motion.p
        className="mt-3 text-[14px] leading-[1.55] text-[#f3e2bd]/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        The end of Dad&apos;s note was yours. That&apos;s how the whole game works: Eli is rebuilt from what players share with him, and in the end he
        gives their words back.
      </motion.p>
      <motion.div
        className="mt-4 flex flex-wrap items-center gap-3"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.2 }}
      >
        <button
          type="button"
          onClick={learnMore}
          className="rounded-full bg-[#f3e2bd] px-5 py-2.5 text-[14px] font-semibold text-[#1d1910] transition-transform hover:-translate-y-0.5"
        >
          See how Eli is designed ↓
        </button>
        <button
          type="button"
          onClick={onReplay}
          className="rounded-full px-3 py-2 text-[13px] font-medium text-[#f3e2bd]/70 underline-offset-4 hover:text-[#f3e2bd] hover:underline"
        >
          Replay the story
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ---------- the generative UI for each beat ---------- */

function ActionArea({
  action,
  error,
  onText,
  onObject,
  onNote,
  onDecide,
  autoFocus,
}: {
  action: Action | null;
  error: string | null;
  onText: (t: string) => void;
  onObject: (o: LabObject) => void;
  onNote: (prefix: string, ending: string) => void;
  onDecide: (c: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="px-4 pb-4 md:pb-6 md:pl-[11%] md:pr-[6%]">
      {error && <p className="mb-2 text-[13px] text-[#f0b58a]">{error}</p>}
      <AnimatePresence mode="wait">
        {action?.type === "text" && (
          <Rise key="text">
            <TextAsk onSend={onText} autoFocus={autoFocus} placeholder="Type a memory of yours…" />
            <p className="mt-2 text-[11.5px] text-[#f3e2bd]/40">Eli is an AI character. Nothing you share is saved.</p>
          </Rise>
        )}
        {action?.type === "objects" && (
          <Rise key="objects">
            <Label>Choose something for Eli to look at</Label>
            <div className="grid grid-cols-3 gap-2">
              {action.objects.map((o, i) => (
                <motion.button
                  key={o.id}
                  type="button"
                  onClick={() => onObject(o)}
                  className="flex flex-col items-start gap-1.5 rounded-[14px] border border-[#f3e2bd]/15 bg-[#f3e2bd]/[0.05] p-3 text-left transition-colors hover:border-[#ffcf8a]/50 hover:bg-[#ffcf8a]/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i, ease: EASE }}
                >
                  <ObjectIcon id={o.id} />
                  <span className="text-[13.5px] font-semibold leading-tight text-[#ffe2b3]">{o.name}</span>
                  <span className="text-[12px] leading-snug text-[#f3e2bd]/60">{o.line}</span>
                </motion.button>
              ))}
            </div>
          </Rise>
        )}
        {action?.type === "notebook" && (
          <Rise key="notebook">
            <NoteFill prefix={action.prefix} onDone={(t) => onNote(action.prefix, t)} autoFocus={autoFocus} />
          </Rise>
        )}
        {action?.type === "decision" && (
          <Rise key="decision">
            <Label>{action.decision.question}</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onDecide(action.decision.a)}
                className="rounded-[14px] border border-[#5fd3c4]/40 bg-[linear-gradient(135deg,rgba(95,211,196,0.22),rgba(95,211,196,0.06))] px-4 py-3.5 text-[15px] font-semibold text-[#c9f3ec] shadow-[0_0_30px_rgba(95,211,196,0.15)] transition-colors hover:border-[#5fd3c4]/70"
              >
                {action.decision.a}
              </button>
              <button
                type="button"
                onClick={() => onDecide(action.decision.b)}
                className="rounded-[14px] border border-[#f3e2bd]/20 bg-[#f3e2bd]/[0.05] px-4 py-3.5 text-[15px] font-semibold text-[#f3e2bd]/85 transition-colors hover:border-[#f3e2bd]/45"
              >
                {action.decision.b}
              </button>
            </div>
          </Rise>
        )}
      </AnimatePresence>
    </div>
  );
}

function Rise({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.45, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f3e2bd]/55">{children}</p>;
}

function useDesktopFocus(autoFocus?: boolean) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus && window.matchMedia("(min-width: 768px)").matches) ref.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  return ref;
}

function TextAsk({ onSend, placeholder, autoFocus }: { onSend: (t: string) => void; placeholder: string; autoFocus?: boolean }) {
  const [value, setValue] = useState("");
  const ref = useDesktopFocus(autoFocus);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSend(value);
  };
  return (
    <form onSubmit={submit}>
      <label className="flex items-center gap-2 rounded-full border border-[#f3e2bd]/20 bg-[#0d0a06]/75 py-1.5 pl-5 pr-1.5 backdrop-blur-md focus-within:border-[#f3e2bd]/50">
        <span className="sr-only">Message Eli</span>
        <input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={280}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-[#f3e2bd] placeholder:text-[#f3e2bd]/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="rounded-full bg-[#f3e2bd] px-4 py-2 text-[14px] font-semibold text-[#1d1910] transition-opacity disabled:opacity-40"
        >
          Send
        </button>
      </label>
    </form>
  );
}

/** Dad's note with the smudged ending as a field the visitor writes into. */
function NoteFill({ prefix, onDone, autoFocus }: { prefix: string; onDone: (t: string) => void; autoFocus?: boolean }) {
  const [value, setValue] = useState("");
  const noteRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (autoFocus && window.matchMedia("(min-width: 768px)").matches) noteRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onDone(value);
  };
  return (
    <form onSubmit={submit}>
      <NotePage prefix={prefix}>
        <div className="relative mt-1">
          {/* The smudge, which the visitor's words write over */}
          {!value && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-1/2 h-[22px] w-[70%] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(58,42,23,0.35),transparent)] blur-[3px]"
            />
          )}
          <textarea
            ref={noteRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (value.trim()) onDone(value);
              }
            }}
            rows={2}
            maxLength={120}
            placeholder="…finish Dad's sentence"
            aria-label="Finish Dad's sentence"
            className={`${hand.className} relative block w-full resize-none bg-transparent text-[24px] leading-[28px] text-[#8a4b12] placeholder:text-[#3a2a17]/45 focus:outline-none md:text-[26px]`}
          />
        </div>
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!value.trim()}
            className="rounded-full bg-[#3a2a17] px-4 py-1.5 text-[13px] font-semibold text-[#e9dcc0] transition-opacity disabled:opacity-35"
          >
            Give it to Eli
          </button>
        </div>
      </NotePage>
    </form>
  );
}

function ObjectIcon({ id }: { id: ObjectId }) {
  const c = { fill: "none", stroke: "#ffcf8a", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<ObjectId, ReactNode> = {
    flask: (
      <>
        <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" {...c} />
        <path d="M7.5 15h9" {...c} stroke="#5fd3c4" />
      </>
    ),
    notebook: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="1.5" {...c} />
        <path d="M9 8h6M9 12h6M9 16h4" {...c} />
      </>
    ),
    lamp: <path d="M6 21h10M11 21v-6l-4-5 5-5 3 3M12 5l4 4-3 3" {...c} />,
    musicbox: (
      <>
        <rect x="4" y="10" width="16" height="10" rx="1.5" {...c} />
        <path d="M4 10l2-4h12l2 4M14 3v4M14 3l3 1" {...c} />
      </>
    ),
    photo: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="1.5" {...c} />
        <circle cx="10" cy="11" r="2" {...c} />
        <path d="M5 18l5-4 4 3 2-2 3 3" {...c} />
      </>
    ),
    coat: <path d="M9 3l3 3 3-3 4 3-2 5-2-1v11H9V10l-2 1-2-5z" {...c} />,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      {paths[id]}
    </svg>
  );
}

/** A glowing heart that beats twice, rests, and beats again, with a soft ripple. */
function Heartbeat({ still }: { still: boolean }) {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center md:h-[clamp(56px,6vw,84px)] md:w-[clamp(56px,6vw,84px)]">
      {!still && <span className="eli-ripple absolute inset-0 rounded-full bg-[#ffb35c]/35" />}
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#c99558,#8a5f30_70%)] shadow-[0_0_40px_rgba(255,170,80,0.35)]" />
      <svg viewBox="0 0 24 24" className={`relative h-[45%] w-[45%] ${still ? "" : "eli-heartbeat"}`} aria-hidden="true">
        <path
          d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"
          fill="#ffe2b3"
        />
      </svg>
    </span>
  );
}
