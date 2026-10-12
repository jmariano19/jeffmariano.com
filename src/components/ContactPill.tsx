"use client";

import Image from "next/image";
import { FormEvent, useEffect, useId, useRef, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Status = "idle" | "sending" | "sent" | "error";

function Pill({
  label,
  ref,
  ...props
}: { label: string; ref?: React.Ref<HTMLButtonElement> } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button ref={ref} type="button" {...props}>
      <span className="relative w-6 h-6 rounded-full overflow-hidden">
        <Image src="/images/about_portrait.jpg" alt="" fill sizes="24px" className="object-cover object-top" />
      </span>
      {label} <span aria-hidden="true">↗</span>
    </button>
  );
}

/**
 * "Get in touch" pill that opens a small contact form. In the header the card
 * grows down and left from the pill (the pill stays in the card's top-right
 * corner); in the dark variant it opens above the pill, aligned left.
 */
export default function ContactPill({ dark = false, label = "Get in touch" }: { dark?: boolean; label?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const formId = useId();

  const valid = name.trim().length > 0 && EMAIL_RE.test(email.trim());
  const canSend = valid && status !== "sending";

  useEffect(() => {
    if (!open) return;
    nameRef.current?.focus();
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
    if (status === "sent" || status === "error") {
      setStatus("idle");
      setError("");
    }
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as unknown as { gtag: (...a: unknown[]) => void }).gtag("event", "contact_click", {
        event_category: "contact",
        event_label: dark ? "Contact section" : "Header",
      });
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
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

  const field =
    "w-full rounded-[10px] bg-[#f1f1f1] px-4 text-[12px] text-black placeholder:text-black/60 outline-none focus-visible:ring-2 focus-visible:ring-black/20";

  return (
    <div ref={wrapRef} className="relative">
      <Pill
        ref={pillRef}
        label={label}
        aria-expanded={open}
        aria-controls={formId}
        onClick={toggle}
        className={`relative z-[41] inline-flex items-center gap-2 rounded-full pl-1 pr-3.5 py-1 text-[12px] transition-opacity hover:opacity-80 ${
          dark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"
        } ${!dark && !open ? "shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : ""}`}
      />

      {open && (
        <div
          id={formId}
          role="dialog"
          aria-label="Send me a message"
          className={`absolute z-40 w-[min(327px,calc(100vw-40px))] rounded-[20px] bg-white p-[15px] shadow-[0_12px_40px_rgba(0,0,0,0.10)] ${
            dark ? "left-0 bottom-full mb-3" : "-right-[15px] -top-[6px] pt-[52px]"
          }`}
        >
          {status === "sent" ? (
            <div className="px-2 py-8 text-center">
              <p className="text-[18px] font-semibold tracking-[-0.02em]">Thanks, message sent.</p>
              <p className="mt-2 text-[13px] text-black/60">I&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-[17px]">
              <label className="sr-only" htmlFor={`${formId}-name`}>Name</label>
              <input
                ref={nameRef}
                id={`${formId}-name`}
                className={`${field} h-[51.5px]`}
                placeholder="Name"
                autoComplete="name"
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="sr-only" htmlFor={`${formId}-email`}>Email</label>
              <input
                id={`${formId}-email`}
                className={`${field} h-[51.5px]`}
                placeholder="Email"
                type="email"
                autoComplete="email"
                inputMode="email"
                maxLength={200}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="sr-only" htmlFor={`${formId}-message`}>Message</label>
              <textarea
                id={`${formId}-message`}
                className={`${field} h-[122px] resize-none py-3`}
                placeholder="Message"
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

              {error && <p className="-mt-1 px-1 text-[12px] text-[#b42318]" role="alert">{error}</p>}

              <button
                type="submit"
                disabled={!canSend}
                className={`relative mt-[3px] h-[51px] w-full rounded-[10px] bg-black text-[20px] font-bold text-white transition-opacity ${
                  canSend ? "opacity-100 hover:opacity-85" : "opacity-40 cursor-not-allowed"
                }`}
              >
                {status === "sending" ? "SENDING…" : "SEND"}
                <Image
                  src="/images/send.svg"
                  alt=""
                  width={36.4336}
                  height={35.5117}
                  className="absolute right-[7px] top-1/2 -translate-y-1/2"
                />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
