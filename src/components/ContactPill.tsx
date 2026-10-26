"use client";

import Image from "next/image";
import { FormEvent, useEffect, useId, useRef, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Status = "idle" | "sending" | "sent" | "error";

function trackContact(label: string) {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag("event", "contact_click", {
      event_category: "contact",
      event_label: label,
    });
  }
}

/**
 * Name / email / message form that emails Jeff through /api/contact.
 * Send stays disabled until there's a name and a valid email.
 */
export function ContactForm({
  autoFocus = false,
  roomy = false,
  tone = "light",
  source,
  placeholder = "Message",
}: {
  /** Tags the email subject, e.g. "consulting" for messages from /consultant. */
  source?: string;
  placeholder?: string;
  autoFocus?: boolean;
  roomy?: boolean;
  /** "dark" is the footer panel style: gray fields and a white pill button. */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const valid = name.trim().length > 0 && EMAIL_RE.test(email.trim());
  const canSend = valid && status !== "sending";

  useEffect(() => {
    if (autoFocus) nameRef.current?.focus();
  }, [autoFocus]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't send right now. Please try again.");
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't send right now. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className={`px-2 text-center ${roomy ? "py-16" : "py-8"}`} role="status">
        <p className="text-[20px] font-semibold tracking-[-0.03em]">Thanks, message sent.</p>
        <p className={`mt-2 text-[15px] ${dark ? "text-white/60" : "text-black/60"}`}>I&apos;ll get back to you soon.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-[15px] underline underline-offset-4 hover:opacity-60"
        >
          Send another
        </button>
      </div>
    );
  }

  const field = dark
    ? "w-full rounded-[8px] bg-[#909090] px-5 text-[17px] text-black placeholder:text-black/60 caret-black outline-none transition-colors duration-200 hover:bg-[#9c9c9c] focus:bg-white focus:placeholder:text-black/40"
    : "w-full rounded-[10px] bg-[#f1f1f1] px-4 text-[15px] text-black placeholder:text-black/50 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-black/20";
  const lineH = dark ? "h-[57px]" : "h-[52px]";

  return (
    <form onSubmit={submit} noValidate className={`flex flex-col ${dark ? "gap-4" : roomy ? "gap-3" : "gap-[14px]"}`}>
      <label className="sr-only" htmlFor={`${id}-name`}>Name</label>
      <input
        ref={nameRef}
        id={`${id}-name`}
        className={`${field} ${lineH}`}
        placeholder="Name"
        autoComplete="name"
        maxLength={120}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label className="sr-only" htmlFor={`${id}-email`}>Email</label>
      <input
        id={`${id}-email`}
        className={`${field} ${lineH}`}
        placeholder="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        maxLength={200}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="sr-only" htmlFor={`${id}-message`}>Message</label>
      <textarea
        id={`${id}-message`}
        className={`${field} ${dark ? "h-[135px] py-3" : roomy ? "h-[150px] py-3.5" : "h-[122px] py-3.5"} resize-none`}
        placeholder={placeholder}
        maxLength={5000}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {/* Honeypot, hidden from people and screen readers */}
      <input
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        name="company"
      />

      {error && <p className={`px-1 text-[14px] ${dark ? "text-[#ff9b8f]" : "text-[#b42318]"}`} role="alert">{error}</p>}

      <button
        type="submit"
        disabled={!canSend}
        className={`mt-1 w-full rounded-full font-bold tracking-[0.01em] transition-opacity ${
          dark ? "h-[57px] bg-white text-[20px] text-black" : "h-[52px] bg-black text-[18px] text-white"
        } ${canSend ? "opacity-100 hover:opacity-85" : "opacity-40 cursor-not-allowed"}`}
      >
        {status === "sending" ? "SENDING…" : "SEND"}
      </button>
    </form>
  );
}

/**
 * "Get in touch" pill that opens the contact form in a small card. In the
 * header the card grows down and left from the pill, which stays in the
 * card's top-right corner.
 */
export default function ContactPill({ dark = false, label = "Get in touch" }: { dark?: boolean; label?: string }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const cardId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        pillRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  function toggle() {
    setOpen((o) => !o);
    trackContact(dark ? "Contact section" : "Header");
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={pillRef}
        type="button"
        aria-expanded={open}
        aria-controls={cardId}
        onClick={toggle}
        className={`relative z-[41] inline-flex items-center gap-2 rounded-full pl-1 pr-4 py-1 text-[14px] md:text-[15px] transition-opacity hover:opacity-80 ${
          dark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"
        } ${!dark && !open ? "shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : ""}`}
      >
        <span className="relative w-7 h-7 rounded-full overflow-hidden">
          <Image src="/images/about_portrait.jpg" alt="" fill sizes="28px" className="object-cover object-top" />
        </span>
        {label} <span aria-hidden="true">↗</span>
      </button>

      {open && (
        <div
          id={cardId}
          role="dialog"
          aria-label="Send me a message"
          className={`absolute z-40 w-[min(340px,calc(100vw-40px))] rounded-[20px] bg-white p-[15px] text-[#111] shadow-[0_12px_40px_rgba(0,0,0,0.12)] ${
            dark ? "left-0 bottom-full mb-3" : "-right-[15px] -top-[6px] pt-[56px]"
          }`}
        >
          <ContactForm autoFocus />
        </div>
      )}
    </div>
  );
}
