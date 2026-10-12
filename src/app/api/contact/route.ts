import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Sends "Get in touch" form submissions to Jeff's inbox through Gmail SMTP.
// Required env (set in Easypanel): SMTP_USER (the Gmail address) and
// SMTP_PASS (a Google app password). Optional: CONTACT_TO, SMTP_HOST, SMTP_PORT.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 200, message: 5000 };

// Light in-memory rate limit: 5 submissions per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/\r/g, "").trim().slice(0, max) : "";
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (clean(body.company, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, LIMITS.name).replace(/\n/g, " ");
  const email = clean(body.email, LIMITS.email).replace(/\n/g, "");
  const message = clean(body.message, LIMITS.message);

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter your name and a valid email." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  const user = process.env.SMTP_USER;
  // Google shows app passwords in groups of four; strip the spaces if pasted that way.
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  if (!user || !pass) {
    console.error("[contact] SMTP_USER / SMTP_PASS are not set");
    return NextResponse.json({ error: "The form isn't working right now. Please email jmariano19@gmail.com." }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user, pass },
  });

  const text = `${message || "(no message)"}\n\n— ${name} <${email}>`;
  const html = `<p style="white-space:pre-wrap;font:15px/1.6 system-ui,sans-serif">${escapeHtml(message || "(no message)")}</p>
<p style="font:14px system-ui,sans-serif;color:#666">— ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`;

  try {
    await transporter.sendMail({
      from: { name: "jeffmariano.com", address: user },
      to: process.env.CONTACT_TO || "jmariano19@gmail.com",
      replyTo: { name, address: email },
      subject: `New message from ${name} via jeffmariano.com`,
      text,
      html,
    });
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json({ error: "Couldn't send right now. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
