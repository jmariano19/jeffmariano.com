"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type FormEvent, type RefObject } from "react";

/**
 * Eli's interactive story.
 *
 *  intro – key art and a beating-heart "Start Interactive Story" button
 *  story – the trailer plays with sound (skippable)
 *  chat  – the frame opens up, Eli idles on a loop and talks to the visitor.
 *          Each of his turns is generative UI: a reply, a memory he recovers
 *          (always quoting the visitor's own words), and suggested replies.
 *          The glow in his chest follows how safe he feels (State Grammar).
 *  done  – after four exchanges he says goodbye, and the memories he
 *          recovered come back as one card: every word on it was the visitor's.
 */

type Stage = "intro" | "story" | "chat" | "done";
type Meta = { intent: string; trust: number; choices: number; source: string };
type Item =
  | { id: number; kind: "eli"; text: string; meta?: Meta }
  | { id: number; kind: "you"; text: string }
  | { id: number; kind: "memory"; title: string; quote: string };
type Memory = { title: string; quote: string };
type NewItem =
  | { kind: "eli"; text: string; meta?: Meta }
  | { kind: "you"; text: string }
  | { kind: "memory"; title: string; quote: string };
type TurnResponse = {
  say?: string;
  intent?: string;
  memory?: Memory;
  choices?: string[];
  trust?: number;
  done?: boolean;
  source?: string;
  error?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const SLOTS = 4;
const OPENING = [
  "…you can see me?",
  "I was here with my dad. Something happened, and now I can't remember.",
  "Will you help me remember?",
];
const FIRST_CHOICES = ["Yes. What do you remember?", "Are you okay?", "Who are you?"];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function EliStory() {
  const reduce = useReducedMotion();
  const storyRef = useRef<HTMLVideoElement>(null);
  const idleRef = useRef<HTMLVideoElement>(null);
  const deskScroll = useRef<HTMLDivElement>(null);
  const phoneScroll = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);
  const runRef = useRef(0);

  const [stage, setStage] = useState<Stage>("intro");
  const [muted, setMuted] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [canType, setCanType] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [trust, setTrust] = useState(0.15);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSystem, setShowSystem] = useState(false);

  const push = useCallback((item: NewItem) => {
    setItems((list) => [...list, { ...item, id: idRef.current++ } as Item]);
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
          await wait(ch === "…" || ch === "." || ch === "?" ? 170 : ch === "," ? 90 : 28);
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
    setChoices([]);
    setTrust(0.15);
    setTyping(null);
    setThinking(false);
    setDraft("");
    setError(null);
    setCanType(false);
    setStage("story");
    const v = storyRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = muted;
      v.play().catch(() => {
        // Sound refused: play muted rather than not at all.
        v.muted = true;
        setMuted(true);
        v.play().catch(() => toChat());
      });
    }
    idleRef.current?.load();
  };

  // Eli's opening lines once the loop takes over.
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
      setChoices(FIRST_CHOICES);
      setCanType(true);
    })();
    // Only when entering the chat stage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (canType && window.matchMedia("(min-width: 768px)").matches) inputRef.current?.focus({ preventScroll: true });
  }, [canType]);

  // Keep the newest line in view.
  useEffect(() => {
    for (const el of [deskScroll.current, phoneScroll.current]) {
      el?.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
    }
  }, [items, typing, thinking, choices, stage, reduce]);

  const send = async (raw: string) => {
    const text = raw.trim().slice(0, 280);
    if (!text || !canType) return;
    const run = runRef.current;
    const history = [...items, { id: -1, kind: "you" as const, text }];
    push({ kind: "you", text });
    setDraft("");
    setChoices([]);
    setCanType(false);
    setThinking(true);
    setError(null);

    let data: TurnResponse;
    try {
      const res = await fetch("/api/eli", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter((i): i is Extract<Item, { kind: "eli" | "you" }> => i.kind === "eli" || i.kind === "you")
            .map((i) => ({ role: i.kind === "you" ? "user" : "assistant", content: i.text })),
        }),
      });
      data = (await res.json()) as TurnResponse;
      if (!res.ok || !data.say) throw new Error(data.error);
    } catch (e) {
      if (run !== runRef.current) return;
      setThinking(false);
      setError((e as Error).message || "Eli didn't hear you. Try again.");
      setCanType(true);
      return;
    }
    if (run !== runRef.current) return;

    setThinking(false);
    await wait(reduce ? 0 : 300);
    await say(data.say, {
      intent: data.intent ?? "ask",
      trust: data.trust ?? trust,
      choices: data.choices?.length ?? 0,
      source: data.source ?? "scripted",
    });
    if (run !== runRef.current) return;

    // The memory he recovers: the visitor's own words, handed back.
    if (data.memory) {
      await wait(reduce ? 0 : 350);
      push({ kind: "memory", title: data.memory.title, quote: data.memory.quote });
      setMemories((m) => [...m, data.memory!].slice(0, SLOTS));
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.([18, 90, 24]);
    }
    if (typeof data.trust === "number") setTrust(data.trust);

    if (data.done) {
      await wait(reduce ? 0 : 1800);
      if (run === runRef.current) setStage("done");
    } else {
      await wait(reduce ? 0 : 300);
      setChoices(data.choices ?? []);
      setCanType(true);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(draft);
  };

  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    if (storyRef.current) storyRef.current.muted = m;
  };

  const talking = stage === "chat" || stage === "done";
  const convo = {
    items,
    typing,
    thinking,
    showSystem,
    done: stage === "done",
    memories,
    onReplay: start,
  };
  const ask = {
    canType: stage === "chat" && canType,
    choices,
    draft,
    setDraft,
    onSubmit,
    onChoice: send,
    error,
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
          className="object-cover object-[80%_center] sm:object-[80%_center]"
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

        {/* The chest glow follows Eli's trust: dimmer when he's scared, brighter as he opens up */}
        {talking && <ChestGlow trust={trust} still={!!reduce} />}

        {/* Darken the left so the conversation reads clearly */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
            stage === "story" ? "opacity-0" : "opacity-100"
          } ${
            talking
              ? "bg-[linear-gradient(to_right,rgba(14,11,6,0.92),rgba(14,11,6,0.7)_38%,rgba(14,11,6,0.1)_62%,transparent_70%)]"
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

        {/* Story controls */}
        {stage === "story" && (
          <div className="absolute bottom-3 right-3 flex gap-2 md:bottom-6 md:right-6">
            <Pill onClick={toggleMute}>{muted ? "Sound on" : "Mute"}</Pill>
            <Pill onClick={toChat}>Skip to Eli →</Pill>
          </div>
        )}

        {/* Chat chrome: memory slots, system view, disclosure */}
        {talking && (
          <motion.div
            className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <MemorySlots memories={memories} />
            <div className="hidden items-center gap-2 md:flex">
              <SystemToggle on={showSystem} onChange={setShowSystem} />
            </div>
          </motion.div>
        )}

        {/* Desktop: the conversation lives in the dark left half of the frame */}
        {talking && (
          <div className="absolute bottom-0 left-0 top-[64px] hidden w-[50%] flex-col md:flex">
            <Conversation {...convo} scrollRef={deskScroll} />
            <AskArea {...ask} inputRef={inputRef} />
          </div>
        )}
      </div>

      {/* Phone: the conversation sits under the picture */}
      {talking && (
        <div className="md:hidden">
          <div className="flex h-[340px] flex-col">
            <Conversation {...convo} scrollRef={phoneScroll} />
          </div>
          <AskArea {...ask} />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Pill({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
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
      {/* Dims the glow in the footage while Eli is unsure */}
      <motion.div
        className="absolute h-[18vw] max-h-[260px] w-[18vw] max-w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(10,7,3,0.75),transparent)]"
        animate={{ opacity: Math.max(0, 0.7 - trust) }}
        transition={{ duration: 1.6 }}
      />
      {/* Brightens as he trusts the visitor, breathing slowly */}
      <motion.div
        className="absolute h-[22vw] max-h-[320px] w-[22vw] max-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,196,120,0.55),rgba(255,150,60,0.18)_55%,transparent)] mix-blend-screen"
        animate={still ? { opacity: Math.min(1, trust * 1.1) } : { opacity: [trust * 0.7, Math.min(1, trust * 1.2), trust * 0.7], scale: [0.96, 1.05, 0.96] }}
        transition={still ? { duration: 1.6 } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function MemorySlots({ memories }: { memories: Memory[] }) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#f3e2bd]/55 md:text-[11px]">
        Memories recovered · {memories.length}/{SLOTS}
      </p>
      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: SLOTS }).map((_, i) => {
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
  memories,
  onReplay,
  scrollRef,
}: {
  items: Item[];
  typing: string | null;
  thinking: boolean;
  showSystem: boolean;
  done: boolean;
  memories: Memory[];
  onReplay: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={scrollRef}
      aria-live="polite"
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto [&>*]:shrink-0 px-5 pb-3 pt-4 [mask-image:linear-gradient(to_bottom,transparent,black_14%)] [scrollbar-width:none] md:pl-[11%] md:pr-[6%]"
    >
      <div className="mt-auto" />
      {items.map((it) => {
        if (it.kind === "eli") return <EliLine key={it.id} text={it.text} meta={showSystem ? it.meta : undefined} />;
        if (it.kind === "you")
          return (
            <motion.p
              key={it.id}
              className="max-w-[85%] self-end rounded-[16px] rounded-br-[6px] bg-[#f3e2bd]/12 px-4 py-2 text-[14.5px] leading-[1.45] text-[#f3e2bd]/90 md:text-[15px]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {it.text}
            </motion.p>
          );
        return <MemoryCard key={it.id} title={it.title} quote={it.quote} />;
      })}
      {typing !== null && <EliLine text={typing} live />}
      {thinking && <Remembering />}
      {done && <Finale memories={memories} onReplay={onReplay} />}
    </div>
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
            {[
              `intent: ${meta.intent}`,
              `trust: ${meta.trust.toFixed(2)} → glow`,
              `ui: reply + memory${meta.choices ? ` + ${meta.choices} choices` : ""}`,
              `model: ${meta.source}`,
            ].map((t) => (
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

/** A memory surfacing: Eli's version of the moment, in the visitor's words. */
function MemoryCard({ title, quote }: { title: string; quote: string }) {
  return (
    <motion.div
      className="relative max-w-[88%] overflow-hidden rounded-[14px] border border-[#ffcf8a]/25 bg-[linear-gradient(135deg,rgba(255,207,138,0.14),rgba(255,207,138,0.04))] px-4 py-3"
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
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#ffcf8a]/80">✦ Memory recovered</p>
      <p className="mt-1 text-[15px] font-semibold text-[#ffe2b3]">{title}</p>
      <p className="mt-0.5 text-[14px] italic leading-[1.45] text-[#f3e2bd]/75">“{quote}”</p>
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

/** The ending: everything Eli remembers now, made from the visitor's words. */
function Finale({ memories, onReplay }: { memories: Memory[]; onReplay: () => void }) {
  return (
    <motion.div
      className="mt-3 rounded-[18px] border border-[#ffcf8a]/30 bg-[#1d160c]/80 p-5 shadow-[0_0_60px_rgba(255,180,90,0.12)]"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.2 }}
    >
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#ffcf8a]/80">What Eli remembers now</p>
      <ul className="mt-3 flex flex-col gap-2">
        {memories.map((m, i) => (
          <motion.li
            key={i}
            className="text-[15px] leading-[1.45] text-[#ffe2b3] md:text-[16px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 + i * 0.5 }}
          >
            “{m.quote}”
          </motion.li>
        ))}
      </ul>
      <motion.p
        className="mt-4 text-[13.5px] leading-[1.5] text-[#f3e2bd]/65"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 + memories.length * 0.5 }}
      >
        Every word here was yours. In the full game, Eli is built from what players share, and in the end he gives it back.
      </motion.p>
      <motion.button
        type="button"
        onClick={onReplay}
        className="mt-4 rounded-full border border-[#f3e2bd]/30 px-4 py-1.5 text-[13px] font-semibold text-[#f3e2bd] transition-colors hover:bg-[#f3e2bd]/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 + memories.length * 0.5 }}
      >
        Replay the story
      </motion.button>
    </motion.div>
  );
}

function AskArea({
  canType,
  choices,
  draft,
  setDraft,
  onSubmit,
  onChoice,
  error,
  inputRef,
}: {
  canType: boolean;
  choices: string[];
  draft: string;
  setDraft: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onChoice: (text: string) => void;
  error: string | null;
  inputRef?: RefObject<HTMLInputElement | null>;
}) {
  return (
    <AnimatePresence>
      {canType && (
        <motion.form
          key="ask"
          onSubmit={onSubmit}
          className="px-4 pb-4 md:pb-6 md:pl-[11%] md:pr-[6%]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {choices.length > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-2">
              {choices.map((c, i) => (
                <motion.button
                  key={c}
                  type="button"
                  onClick={() => onChoice(c)}
                  className="rounded-full border border-[#f3e2bd]/20 bg-[#f3e2bd]/[0.06] px-3.5 py-1.5 text-[13px] text-[#f3e2bd]/90 backdrop-blur transition-colors hover:border-[#f3e2bd]/45 hover:bg-[#f3e2bd]/15"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 * i, ease: EASE }}
                >
                  {c}
                </motion.button>
              ))}
            </div>
          )}
          {error && <p className="mb-2 text-[13px] text-[#f0b58a]">{error}</p>}
          <label className="flex items-center gap-2 rounded-full border border-[#f3e2bd]/20 bg-[#0d0a06]/75 py-1.5 pl-5 pr-1.5 backdrop-blur-md focus-within:border-[#f3e2bd]/50">
            <span className="sr-only">Message Eli</span>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={280}
              placeholder="Or say it in your own words…"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-[#f3e2bd] placeholder:text-[#f3e2bd]/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="rounded-full bg-[#f3e2bd] px-4 py-2 text-[14px] font-semibold text-[#1d1910] transition-opacity disabled:opacity-40"
            >
              Send
            </button>
          </label>
          <p className="mt-2 text-[11.5px] text-[#f3e2bd]/40">Eli is an AI character. Nothing you share is saved.</p>
        </motion.form>
      )}
    </AnimatePresence>
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
