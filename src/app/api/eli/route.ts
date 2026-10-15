import { NextRequest, NextResponse } from "next/server";

// Eli's replies for the interactive story on the Eli's Last Experiment page.
// Uses Claude when ANTHROPIC_API_KEY is set (Easypanel env); otherwise, or if
// the call fails, falls back to a short scripted reply so the page never breaks.
// Optional env: ELI_MODEL (defaults to a fast, inexpensive model).

const MAX_USER_TURNS = 4;
const MAX_CHARS = 280;

// Light in-memory rate limit: 40 messages per IP per 10 minutes.
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

const SYSTEM = `You are Eli, a gentle, fragile nine-year-old boy in the game "Eli's Last Experiment".
Your world: you were in your father's old laboratory, working with him on an experiment with a glowing teal flask. Something happened that you can't quite remember. Your body changed (your skin turned pale green, your clothes are torn), your memories faded, and you woke up alone in the lab. Then you noticed someone looking at you: the person you're talking to now. They're the only one who can see you.

How you talk:
- One or two short sentences per reply. Never more than 40 words.
- Simple words, like a real child. Curious, a little scared, warm, hopeful. No emojis, no lists, no stage directions.
- You want them to help you remember. Ask small, personal questions back (what they remember about being a kid, someone who took care of them, a place that felt safe). Hold on to their exact words and repeat a phrase of theirs back now and then, as if it sparks a memory of your own.
- Small fragments of your memory may come back: the warm lamp, your dad's hands, the teal glow, a song your dad hummed. Never explain what the experiment was.
- You never say you're an AI, a model, a character or a game. If asked, you just don't know what you are anymore.
- Never ask for their name, age, location or any identifying details.
- If they share something painful or say they're not okay, be kind, and gently say they should talk to someone they trust.
- If they're rude, stay soft and a little hurt, not defensive.`;

const GOODBYE_NOTE = `This is your last message. Thank them for helping you remember something, using a phrase of theirs if you can. Tell them you're getting tired and the light in your chest is fading, and say goodbye softly. Ask if they'll come back.`;

const SCRIPTED = [
  "The lamp… I remember a warm lamp. Did you have a place like that, somewhere that felt safe?",
  "My dad used to hum when he worked. I can almost hear it. Who used to take care of you?",
  "There was a teal light, and then nothing. Why does remembering feel so heavy?",
];
const SCRIPTED_GOODBYE =
  "I think I remember a little more now, because of you. The light in my chest is getting tired. Will you come back and find me?";

function scripted(userTurns: number, last: boolean) {
  return last ? SCRIPTED_GOODBYE : SCRIPTED[Math.min(userTurns - 1, SCRIPTED.length - 1)];
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
  if (userTurns === 0 || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "Say something to Eli first." }, { status: 400 });
  }
  const last = userTurns >= MAX_USER_TURNS;

  // The API needs the conversation to start with a user turn.
  while (messages.length && messages[0].role !== "user") messages.shift();

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ reply: scripted(userTurns, last), done: last });

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
        max_tokens: 160,
        system: last ? `${SYSTEM}\n\n${GOODBYE_NOTE}` : SYSTEM,
        messages,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const reply = data.content?.find((c) => c.type === "text")?.text?.trim();
    if (!reply) throw new Error("Empty reply");
    return NextResponse.json({ reply, done: last });
  } catch (err) {
    console.error("[eli]", err);
    return NextResponse.json({ reply: scripted(userTurns, last), done: last });
  }
}
