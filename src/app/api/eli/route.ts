import { NextRequest, NextResponse } from "next/server";

// Eli's turns in the interactive story on the Eli's Last Experiment page.
//
// The conversation is four beats, and each beat answers with a different piece
// of generative UI that the page renders:
//   beat 1  visitor types a memory      → Eli offers 3 lab objects to examine   (ui: objects)
//   beat 2  visitor picks an object     → Eli finds Dad's smudged note          (ui: notebook)
//   beat 3  visitor finishes the note   → Eli asks whether to face the flask    (ui: decision)
//   beat 4  visitor decides             → Eli says goodbye; the note is restored (done)
// Every turn also returns a memory (quoting the visitor) and a trust level that
// drives the glow in Eli's chest.
//
// Uses Claude when ANTHROPIC_API_KEY is set; otherwise, or on any failure, a
// scripted turn keeps it working. Optional env: ELI_MODEL. Nothing is stored.

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

const OBJECTS = {
  flask: "The teal flask",
  notebook: "Dad's notebook",
  lamp: "The brass lamp",
  musicbox: "The music box",
  photo: "An old photograph",
  coat: "Dad's lab coat",
} as const;
type ObjectId = keyof typeof OBJECTS;

type Turn = {
  say: string;
  trust: number;
  memory: { title: string; quote: string };
  objects?: { id: ObjectId; name: string; line: string }[];
  notebook?: { prefix: string };
  decision?: { question: string; a: string; b: string };
};

const SYSTEM = `You are Eli, a gentle, fragile nine-year-old boy in the game "Eli's Last Experiment".
Your world: this is your father's old laboratory (wooden shelves of bottles, a brass desk lamp, his notebook, a music box, his lab coat, the glowing teal flask from the experiment). You were here helping him. Something happened with the teal flask, a bright teal flash, and you can't remember the rest. Your body changed (pale green skin, torn clothes), your memories faded, and you woke up alone. Your dad is gone and you don't know where. Then you noticed someone looking at you: the visitor, the only one who can see you. When they share their own memories, yours start coming back.

How you talk:
- One or two short sentences. Never more than 32 words. Simple words, like a real child: curious, a little scared, warm. No emojis, no stage directions.
- Connect what they say to something in the lab and to your dad. Hold on to a phrase of theirs and say it back.
- Never explain the experiment. You never say you're an AI, a model or a game character.
- Never ask for names, age, location or identifying details.
- If they share something painful or say they're not okay, be kind and gently say they should talk to someone they trust.
- If they're rude or silly, stay soft and gently bring it back to the lab.

Reply with ONLY a JSON object, no other text.`;

const BEATS: Record<number, string> = {
  1: `They just told you one of their earliest memories. Let it stir something in the lab, then say some things in here might help you remember, and ask which one you should look at together.
JSON: {"say": "...", "trust": 0-1, "memory": {"title": "2-4 words", "quote": "2-8 words copied exactly from their message"}, "objects": [three items, each {"id": one of "flask","notebook","lamp","musicbox","photo","coat", "line": "what you whisper about it, max 7 words"}]}
Pick the three objects that connect best to their memory. Always include "notebook".`,
  2: `They chose an object for you to examine. Describe the small memory it brings back from the night of the accident, in one sentence. Then you find a page in Dad's notebook with a note to you; the end of the sentence is smudged. Ask them to help you finish it.
JSON: {"say": "...", "trust": 0-1, "memory": {"title": "2-4 words", "quote": "the object they chose, as written in their message"}, "notebook": {"prefix": "the start of Dad's note, addressed to Eli, 6-12 words, ending right where the smudge begins, e.g. 'Eli, if you ever forget who you are, remember'"}}`,
  3: `They just finished Dad's note with their own words. React as if you can hear your dad saying it. Then you look at the teal flask on the bench, still faintly glowing, and ask if you should look at it again, now that they're here.
JSON: {"say": "...", "trust": 0-1, "memory": {"title": "2-4 words", "quote": "2-8 words copied exactly from their message"}, "decision": {"question": "short question, max 8 words", "a": "brave option, 2-4 words", "b": "gentle option, 2-4 words"}}`,
  4: `This is your last turn. They decided about the flask. If they chose to look, you remember one more piece: your dad's voice in the flash, saying the note they finished. If they chose to wait, you're relieved and thank them for not rushing you. Either way, say the light in your chest is getting tired, and ask softly if they'll come back to find out what happened to your dad.
JSON: {"say": "...", "trust": 0-1, "memory": {"title": "2-4 words", "quote": "their choice, as written in their message"}}`,
};

const SCRIPTED: Record<number, Turn> = {
  1: {
    say: "That feels warm… like the lamp Dad always left on for me. Some things in here might help me remember. Which one should we look at?",
    trust: 0.35,
    memory: { title: "A first spark", quote: "" },
    objects: [
      { id: "flask", name: OBJECTS.flask, line: "It's still glowing a little." },
      { id: "notebook", name: OBJECTS.notebook, line: "He wrote in it every night." },
      { id: "musicbox", name: OBJECTS.musicbox, line: "I think it was mine." },
    ],
  },
  2: {
    say: "Dad was holding it when the light turned teal. Wait, there's a page here for me, but the end is smudged. Can you help me finish it?",
    trust: 0.55,
    memory: { title: "The night of the light", quote: "" },
    notebook: { prefix: "Eli, if you ever forget who you are, remember" },
  },
  3: {
    say: "I can almost hear him saying that. The flask is still glowing on the bench… should I look at it again, now that you're here?",
    trust: 0.75,
    memory: { title: "Dad's words", quote: "" },
    decision: { question: "Look at the teal flask again?", a: "Look together", b: "Not yet" },
  },
  4: {
    say: "Thank you for staying with me. I remember his voice now. The light in my chest is getting tired… will you come back and help me find him?",
    trust: 0.9,
    memory: { title: "His voice", quote: "" },
  },
};

const TRAILING = /\s+(?:in|on|to|the|a|an|and|of|my|with|for|at|is|was|but|or|so|that)$/i;
function phraseFrom(text: string) {
  const clause = text.split(/[.!?;\n]/).map((s) => s.trim()).find((s) => s.split(/\s+/).length >= 2) ?? text.trim();
  let phrase = clause.split(/\s+/).slice(0, 10).join(" ").replace(/[,:]$/, "");
  while (TRAILING.test(phrase)) phrase = phrase.replace(TRAILING, "");
  return phrase;
}

const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : "");

/** Validate the model's turn and fill any gaps from the scripted beat. */
function shape(beat: number, raw: Partial<Turn> | null, lastUser: string): Turn {
  const s = SCRIPTED[beat];
  let quote = str(raw?.memory?.quote, 120).replace(/^["“']|["”']$/g, "");
  if (!quote || !lastUser.toLowerCase().includes(quote.toLowerCase())) quote = beat === 1 || beat === 3 ? phraseFrom(lastUser) : lastUser;
  const t = typeof raw?.trust === "number" && Number.isFinite(raw.trust) ? raw.trust : s.trust;
  const turn: Turn = {
    say: str(raw?.say, 320) || s.say,
    trust: Math.max(0, Math.min(1, t)),
    memory: { title: str(raw?.memory?.title, 40) || s.memory.title, quote },
  };

  if (beat === 1) {
    const seen = new Set<string>();
    const objs = (Array.isArray(raw?.objects) ? raw!.objects : [])
      .filter((o): o is { id: ObjectId; name: string; line: string } => !!o && typeof o === "object" && (o as { id: string }).id in OBJECTS)
      .filter((o) => !seen.has(o.id) && seen.add(o.id))
      .map((o) => ({ id: o.id, name: OBJECTS[o.id], line: str(o.line, 60) || "Something about this…" }))
      .slice(0, 3);
    turn.objects = objs.length === 3 ? objs : s.objects;
  }
  if (beat === 2) {
    const prefix = str(raw?.notebook?.prefix, 90).replace(/[.…]+$/, "");
    turn.notebook = { prefix: prefix || s.notebook!.prefix };
  }
  if (beat === 3) {
    const d = raw?.decision;
    turn.decision =
      str(d?.question, 60) && str(d?.a, 30) && str(d?.b, 30)
        ? { question: str(d!.question, 60), a: str(d!.a, 30), b: str(d!.b, 30) }
        : s.decision;
  }
  return turn;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Eli needs a moment to rest. Try again soon." }, { status: 429 });
  }

  let body: { beat?: unknown; messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const beat = Number(body.beat);
  if (![1, 2, 3, 4].includes(beat)) return NextResponse.json({ error: "Invalid beat" }, { status: 400 });

  const raw = Array.isArray(body.messages) ? body.messages : [];
  const messages: Msg[] = raw
    .filter(
      (m): m is Msg =>
        !!m &&
        typeof m === "object" &&
        ((m as Msg).role === "user" || (m as Msg).role === "assistant") &&
        typeof (m as Msg).content === "string",
    )
    .slice(-14)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }))
    .filter((m) => m.content.length > 0);

  const lastUser = messages[messages.length - 1];
  if (lastUser?.role !== "user") return NextResponse.json({ error: "Say something to Eli first." }, { status: 400 });
  while (messages.length && messages[0].role !== "user") messages.shift();

  const done = beat === 4;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ ...shape(beat, null, lastUser.content), beat, done, source: "scripted" });

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
        max_tokens: 450,
        system: `${SYSTEM}\n\n${BEATS[beat]}`,
        messages,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((c) => c.type === "text")?.text ?? "";
    const parsed = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)) as Partial<Turn>;
    return NextResponse.json({ ...shape(beat, parsed, lastUser.content), beat, done, source: "claude" });
  } catch (err) {
    console.error("[eli]", err);
    return NextResponse.json({ ...shape(beat, null, lastUser.content), beat, done, source: "scripted" });
  }
}
