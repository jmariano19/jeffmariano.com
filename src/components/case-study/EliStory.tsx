"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

/**
 * Eli's interactive story. Four stages:
 *  intro – key art and a heartbeat "Start the story" button
 *  story – the trailer plays with sound (skippable)
 *  chat  – Eli idles on a loop, speaks to the viewer, and a chat input appears
 *  done  – after a few exchanges Eli says goodbye; the story can be replayed
 */

type Stage = "intro" | "story" | "chat" | "done";
type Line = { from: "eli" | "you"; text: string; id: number };

const EASE = [0.22, 1, 0.36, 1] as const;
const OPENING = [
  "…you can see me?",
  "I was here with my dad. Something happened, and now I can't remember.",
  "Will you help me remember?",
];

export function EliStory() {
  const reduce = useReducedMotion();
  const storyRef = useRef<HTMLVideoElement>(null);
  const idleRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const phoneScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);

  const [stage, setStage] = useState<Stage>("intro");
  const [muted, setMuted] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState<string | null>(null); // Eli's line being typed out
  const [thinking, setThinking] = useState(false);
  const [canType, setCanType] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Type a line out character by character, then commit it.
  const say = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        if (reduce) {
          setLines((l) => [...l, { from: "eli", text, id: idRef.current++ }]);
          resolve();
          return;
        }
        let i = 0;
        const tick = () => {
          i += 1;
          setTyping(text.slice(0, i));
          if (i < text.length) {
            setTimeout(tick, text[i - 1] === "…" || text[i - 1] === "." ? 160 : 32);
          } else {
            setTimeout(() => {
              setTyping(null);
              setLines((l) => [...l, { from: "eli", text, id: idRef.current++ }]);
              resolve();
            }, 250);
          }
        };
        setTimeout(tick, 0);
      }),
    [reduce],
  );

  const toChat = useCallback(() => {
    storyRef.current?.pause();
    setStage("chat");
    idleRef.current?.play().catch(() => {});
  }, []);

  const start = () => {
    setLines([]);
    setDraft("");
    setError(null);
    setCanType(false);
    setStage("story");
    const v = storyRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = muted;
      v.play().catch(() => {
        // Autoplay with sound refused: play muted rather than not at all.
        v.muted = true;
        setMuted(true);
        v.play().catch(() => toChat());
      });
    }
    idleRef.current?.load();
  };

  // Eli's opening lines once the loop takes over.
  useEffect(() => {
    if (stage !== "chat" || lines.length > 0) return;
    let cancelled = false;
    (async () => {
      await new Promise((r) => setTimeout(r, reduce ? 0 : 900));
      for (const t of OPENING) {
        if (cancelled) return;
        await say(t);
        await new Promise((r) => setTimeout(r, reduce ? 0 : 500));
      }
      if (!cancelled) setCanType(true);
    })();
    return () => {
      cancelled = true;
    };
    // Only when entering the chat stage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (canType && window.matchMedia("(min-width: 768px)").matches) inputRef.current?.focus({ preventScroll: true });
  }, [canType]);

  // Keep the newest line in view.
  useEffect(() => {
    for (const el of [scrollRef.current, phoneScrollRef.current]) {
      el?.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
    }
  }, [lines, typing, thinking, stage, reduce]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim().slice(0, 280);
    if (!text || !canType) return;
    const next: Line[] = [...lines, { from: "you", text, id: idRef.current++ }];
    setLines(next);
    setDraft("");
    setCanType(false);
    setThinking(true);
    setError(null);
    try {
      const res = await fetch("/api/eli", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.map((l) => ({ role: l.from === "you" ? "user" : "assistant", content: l.text })),
        }),
      });
      const data = (await res.json()) as { reply?: string; done?: boolean; error?: string };
      setThinking(false);
      if (!res.ok || !data.reply) {
        setError(data.error ?? "Eli didn't hear you. Try again.");
        setCanType(true);
        return;
      }
      await new Promise((r) => setTimeout(r, reduce ? 0 : 400));
      await say(data.reply);
      if (data.done) setTimeout(() => setStage("done"), reduce ? 0 : 1600);
      else setCanType(true);
    } catch {
      setThinking(false);
      setError("Eli didn't hear you. Try again.");
      setCanType(true);
    }
  };

  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    if (storyRef.current) storyRef.current.muted = m;
  };

  const talking = stage === "chat" || stage === "done";

  return (
    <div className="overflow-hidden rounded-[22px] bg-[#14110b] md:rounded-[40px]">
      {/* Picture: key art, then the story, then Eli's idle loop */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[2218/940]">
        <Image
          src="/images/home/eli-card-bg.webp"
          alt="Eli standing alone in his father's lab"
          fill
          priority
          sizes="(max-width: 1440px) 100vw, 1304px"
          className="object-cover object-[80%_center] sm:object-center"
        />
        <video
          ref={storyRef}
          src="/videos/eli/eli-story.mp4"
          playsInline
          preload="metadata"
          onEnded={toChat}
          className={`absolute inset-0 h-full w-full object-cover object-[80%_center] transition-opacity duration-500 sm:object-center ${
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
          className={`absolute inset-0 h-full w-full object-cover object-[80%_center] transition-opacity duration-700 sm:object-center ${
            talking ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Darken the left so the logo and Eli's words read clearly */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(14,11,6,0.82),rgba(14,11,6,0.35)_45%,transparent_65%)] transition-opacity duration-700 ${
            stage === "story" ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Intro: title and the heartbeat button */}
        <AnimatePresence>
          {stage === "intro" && (
            <motion.div
              key="intro"
              className="absolute inset-0 flex flex-col justify-center pl-[6%]"
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
            >
              <div className="w-[52%] sm:w-[38%]">
                <Image src="/images/home/eli-logo.webp" alt="Eli's Last Experiment" width={1400} height={885} className="h-auto w-full" />
              </div>
              <button
                type="button"
                onClick={start}
                className="group mt-[3%] flex w-fit items-center gap-3 rounded-full bg-[#f3e2bd]/10 py-2 pl-2 pr-5 text-left backdrop-blur-md transition-colors hover:bg-[#f3e2bd]/20 md:mt-8 md:gap-4 md:py-2.5 md:pl-2.5 md:pr-6"
              >
                <Heartbeat still={!!reduce} />
                <span>
                  <span className="block text-[13px] font-semibold text-[#f3e2bd] md:text-[17px]">Start the interactive story</span>
                  <span className="hidden text-[12px] text-[#f3e2bd]/60 sm:block md:text-[13px]">50 sec · sound on · then talk to Eli</span>
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Story controls */}
        {stage === "story" && (
          <div className="absolute bottom-3 right-3 flex gap-2 md:bottom-6 md:right-6">
            <button
              type="button"
              onClick={toggleMute}
              className="rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-medium text-white/85 backdrop-blur transition-colors hover:bg-black/65 md:text-[13px]"
            >
              {muted ? "Sound on" : "Mute"}
            </button>
            <button
              type="button"
              onClick={toChat}
              className="rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-medium text-white/85 backdrop-blur transition-colors hover:bg-black/65 md:text-[13px]"
            >
              Skip to Eli →
            </button>
          </div>
        )}

        {/* Desktop: the conversation sits over the dark left side of the frame */}
        {talking && (
          <div className="absolute inset-y-0 left-0 hidden w-[46%] md:flex">
            <Conversation
              lines={lines}
              typing={typing}
              thinking={thinking}
              scrollRef={scrollRef}
              done={stage === "done"}
              onReplay={start}
            />
          </div>
        )}

        {/* Desktop input, under Eli's words */}
        <AnimatePresence>
          {stage === "chat" && canType && (
            <motion.form
              key="ask-desktop"
              onSubmit={send}
              className="absolute bottom-6 left-[5%] hidden w-[38%] md:block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <AskBar value={draft} onChange={setDraft} error={error} inputRef={inputRef} />
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Phone: the conversation sits under the picture */}
      {talking && (
        <div className="flex h-[300px] md:hidden">
          <Conversation
            lines={lines}
            typing={typing}
            thinking={thinking}
            scrollRef={phoneScrollRef}
            done={stage === "done"}
            onReplay={start}
          />
        </div>
      )}

      {/* Phone input */}
      <AnimatePresence>
        {stage === "chat" && canType && (
          <motion.form
            key="ask-phone"
            onSubmit={send}
            className="px-4 pb-4 md:hidden"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <AskBar value={draft} onChange={setDraft} error={error} />
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function AskBar({
  value,
  onChange,
  error,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div>
      {error && <p className="mb-2 text-[13px] text-[#f0b58a]">{error}</p>}
      <label className="flex items-center gap-2 rounded-full border border-[#f3e2bd]/20 bg-[#0d0a06]/70 py-1.5 pl-5 pr-1.5 backdrop-blur-md focus-within:border-[#f3e2bd]/50">
        <span className="sr-only">Message Eli</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={280}
          placeholder="Talk to Eli…"
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
    </div>
  );
}

function Conversation({
  lines,
  typing,
  thinking,
  scrollRef,
  done,
  onReplay,
}: {
  lines: Line[];
  typing: string | null;
  thinking: boolean;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  done: boolean;
  onReplay: () => void;
}) {
  return (
    <div
      ref={scrollRef}
      aria-live="polite"
      className="flex w-full flex-col gap-3 overflow-y-auto px-5 pb-4 pt-5 [mask-image:linear-gradient(to_bottom,transparent,black_18%)] md:px-[10%] md:pb-[88px] md:pt-[8%] md:[scrollbar-width:none]"
    >
      <div className="mt-auto" />
      {lines.map((l) =>
        l.from === "eli" ? (
          <EliLine key={l.id} text={l.text} />
        ) : (
          <motion.p
            key={l.id}
            className="max-w-[85%] self-end rounded-[16px] rounded-br-[6px] bg-[#f3e2bd]/12 px-4 py-2 text-[14.5px] leading-[1.45] text-[#f3e2bd]/90 md:text-[15px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {l.text}
          </motion.p>
        ),
      )}
      {typing !== null && <EliLine text={typing} live />}
      {thinking && (
        <p className="flex gap-1.5 py-2" aria-label="Eli is thinking">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#f3e2bd]/70"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            />
          ))}
        </p>
      )}
      {done && (
        <motion.div
          className="mt-2 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-[13px] italic text-[#f3e2bd]/55">Eli fades back into the lab.</p>
          <button
            type="button"
            onClick={onReplay}
            className="rounded-full border border-[#f3e2bd]/30 px-4 py-1.5 text-[13px] font-semibold text-[#f3e2bd] transition-colors hover:bg-[#f3e2bd]/10"
          >
            Replay the story
          </button>
        </motion.div>
      )}
    </div>
  );
}

function EliLine({ text, live }: { text: string; live?: boolean }) {
  return (
    <p className="max-w-[95%] text-[17px] leading-[1.45] tracking-[-0.01em] text-[#f3e2bd] md:text-[clamp(16px,1.6vw,21px)]">
      {text}
      {live && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[#f3e2bd]/80" />}
    </p>
  );
}

/** A glowing heart that beats twice, rests, and beats again, with a soft ripple. */
function Heartbeat({ still }: { still: boolean }) {
  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center md:h-12 md:w-12">
      {!still && <span className="eli-ripple absolute inset-0 rounded-full bg-[#ffb35c]/40" />}
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,190,110,0.55),rgba(255,150,60,0.15)_60%,transparent_72%)]" />
      <svg viewBox="0 0 24 24" className={`relative h-5 w-5 md:h-6 md:w-6 ${still ? "" : "eli-heartbeat"}`} aria-hidden="true">
        <path
          d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"
          fill="#ffd9a0"
        />
      </svg>
    </span>
  );
}
