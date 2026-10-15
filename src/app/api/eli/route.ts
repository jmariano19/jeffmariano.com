import { NextRequest, NextResponse } from "next/server";

// Eli's turn in the interactive story on the Eli's Last Experiment page.
//
// Each turn returns structured output that the page renders as generative UI:
//   say     – what Eli says (typed out on screen)
//   intent  – what Eli is doing this turn (recall, comfort, ask, goodbye)
//   memory  – a fragment Eli "recovers", always quoting the visitor's own words
//   choices – 2–3 short replies the visitor can tap instead of typing
//   trust   – 0–1, drives the glow in Eli's chest (the game's State Grammar)
//
// Uses Claude when ANTHROPIC_API_KEY is set (Easypanel env). Without a key, or
// if the call fails, a scripted turn keeps the experience working.
// Optional env: ELI_MODEL. Nothing is stored server-side.

const MAX_USER_TURNS = 4;
const MAX_CHARS = 280;

// Light in-memory rate limit: 40 turns per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 40;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

type Msg = { role: "user" | "assistant"; content: string };
type Turn = {
  say: string;
  intent: "recall" | "comfort" | "ask" | "goodbye";
  memory: { title: string; quote: string };
  choices: string[];
  trust: number;
};

const SYSTEM = `You are Eli, a gentle, fragile nine-year-old boy in the game "Eli's Last Experiment".
Your world: you were in your father's old laboratory, helping him with an experiment with a glowing teal flask. Something happened that you can't quite remember. Your body changed (pale green skin, torn clothes), your memories faded, and you woke up alone in the lab. Then you noticed someone looking at you: the person you're talking to. They're the only one who can see you, and you hope they can help you remember.

How you talk:
- One or two short sentences. Never more than 35 words. Simple words, like a real child: curious, a little scared, warm, hopeful. No emojis, no stage directions.
- Their memories become yours. When they share something, it stirs a fragment of your own (the warm lamp, your dad's hands, the teal glow, a song he hummed). Never explain what the experiment was.
- Ask one small, personal question back: about being a kid, someone who took care of them, a place that felt safe, a sound or smell they remember.
- You never say you're an AI, a model, a character or a game. If asked what you are, you don't know anymore.
- Never ask for names, age, location or identifying details.
- If they share something painful or say they're not okay, be kind and gently say they should talk to someone they trust.
- If they're rude, stay soft and a little hurt.

Reply with ONLY a JSON object, no other text:
{
  "say": "your reply",
  "intent": "recall" | "comfort" | "ask" | "goodbye",
  "memory": { "title": "2-4 word name for the memory it stirred, e.g. 'A warm kitchen'", "quote": "an exact phrase, 2-8 words, copied verbatim from their LAST message" },
  "choices": ["2 or 3 short replies the visitor might send next, in the visitor's voice, under 8 words each, varied in tone"],
  "trust": number from 0 to 1 for how safe you feel with them now (it should grow when they're kind or open)
}`;

const GOODBYE_NOTE = `This is your last turn. Set intent to "goodbye" and choices to []. Thank them for helping you remember, using a phrase of theirs if you can. Say the light in your chest is getting tired and say goodbye softly. Ask if they'll come back.`;

const SCRIPTED: Omit<Turn, "memory">[] = [
  {
    say: "The lamp… I remember a warm lamp. Did you have a place like that, somewhere that felt safe?",
    intent: "recall",
    choices: ["My grandma's kitchen", "My room, with the lights off", "I'm not sure I did"],
    trust: 0.35,
  },
  {
    say: "My dad used to hum when he worked. I can almost hear it. Who used to take care of you?",
    intent: "ask",
    choices: ["My mom, she sang to me", "My older brother", "I took care of myself"],
    trust: 0.55,
  },
  {
    say: "There was a teal light, and then nothing. Why does remembering feel so heavy?",
    intent: "comfort",
    choices: ["Because it matters to you", "It gets lighter, I promise", "You're not alone in it"],
    trust: 0.75,
  },
];
const SCRIPTED_GOODBYE = {
  say: "I remember a little more now, because of you. The light in my chest is getting tired. Will you come back and find me?",
  intent: "goodbye" as const,
  choices: [],
  trust: 0.9,
};

/** A short verbatim phrase from the visitor's message, as a fallback memory. */
const TRAILING = /\s+(?:in|on|to|the|a|an|and|of|my|with|for|at|is|was|but|or|so|that)$/i;
function phraseFrom(text: string) {
  const clause = text.split(/[.!?;\n]/).map((s) => s.trim()).find((s) => s.split(/\s+/).length >= 2) ?? text.trim();
  let phrase = clause.split(/\s+/).slice(0, 10).join(" ").replace(/[,:]$/, "");
  while (TRAILING.test(phrase)) phrase = phrase.replace(TRAILING, "");
  return phrase;
}

const FALLBACK_TITLES = ["A first spark", "Something familiar", "A warm feeling", "The last piece"];

function shape(raw: Partial<Turn> | null, lastUser: string, userTurns: number, last: boolean): Turn {
  const s = last ? SCRIPTED_GOODBYE : SCRIPTED[Math.min(userTurns - 1, SCRIPTED.length - 1)];
  const say = typeof raw?.say === "string" && raw.say.trim() ? raw.say.trim().slice(0, 300) : s.say;
  const intents = ["recall", "comfort", "ask", "goodbye"] as const;
  const intent = last ? "goodbye" : intents.includes(raw?.intent as Turn["intent"]) ? (raw!.intent as Turn["intent"]) : s.intent;

  // The memory must quote the visitor verbatim: that's the whole mechanic.
  let quote = typeof raw?.memory?.quote === "string" ? raw.memory.quote.trim().replace(/^["“']|["”']$/g, "") : "";
  if (!quote || !lastUser.toLowerCase().includes(quote.toLowerCase())) quote = phraseFrom(lastUser);
  const title =
    typeof raw?.memory?.title === "string" && raw.memory.title.trim()
      ? raw.memory.title.trim().slice(0, 40)
      : FALLBACK_TITLES[Math.min(userTurns - 1, 3)];

  const choices = last
    ? []
    : (Array.isArray(raw?.choices) ? raw!.choices : s.choices)
        .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
        .map((c) => c.trim().slice(0, 60))
        .slice(0, 3);
  const t = typeof raw?.trust === "number" && Number.isFinite(raw.trust) ? raw.trust : s.trust;

  return { say, intent, memory: { title, quote }, choices: choices.length || last ? choices : s.choices, trust: Math.max(0, Math.min(1, t)) };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Eli needs a moment to rest. Try again soon." }, { status: 429 });
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  const messages: Msg[] = raw
    .filter(
      (m): m is Msg =>
        !!m &&
        typeof m === "object" &&
        ((m as Msg).role === "user" || (m as Msg).role === "assistant") &&
        typeof (m as Msg).content === "string",
    )
    .slice(-16)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }))
    .filter((m) => m.content.length > 0);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const lastUser = messages[messages.length - 1];
  if (userTurns === 0 || lastUser?.role !== "user") {
    return NextResponse.json({ error: "Say something to Eli first." }, { status: 400 });
  }
  const last = userTurns >= MAX_USER_TURNS;

  // The API needs the conversation to start with a user turn.
  while (messages.length && messages[0].role !== "user") messages.shift();

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({ ...shape(null, lastUser.content, userTurns, last), done: last, source: "scripted" });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ELI_MODEL || "claude-haiku-5-5",
        max_tokens: 400,
        system: last ? `${SYSTEM}\n\n${GOODBYE_NOTE}` : SYSTEM,
        messages,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((c) => c.type === "text")?.text ?? "";
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const parsed = JSON.parse(json) as Partial<Turn>;
    return NextResponse.json({ ...shape(parsed, lastUser.content, userTurns, last), done: last, source: "claude" });
  } catch (err) {
    console.error("[eli]", err);
    return NextResponse.json({ ...shape(null, lastUser.content, userTurns, last), done: last, source: "scripted" });
  }
}
