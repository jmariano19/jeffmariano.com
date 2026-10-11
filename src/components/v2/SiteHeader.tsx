"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo";
import { contactHref } from "@/content/work";

const links = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Articles", href: "/articles" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="relative px-5 md:px-10 pt-6 md:pt-8 flex items-start justify-between gap-6">
      <Link href="/" className="flex flex-col gap-3" aria-label="Jeffrey Mariano, home">
        <Logo size={44} rotateOuter />
        <span className="text-[13px] leading-[18px] text-ink">
          Jeffrey Mariano
          <br />
          Based in the US
          <br />
          <span className="text-ink-muted">Available for fractional engagements</span>
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-7 text-[13px] text-ink" aria-label="Main">
        {links.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`hover:opacity-60 transition-opacity ${pathname.startsWith(href) ? "underline underline-offset-4" : ""}`}
            data-ga-event="nav_click"
            data-ga-category="navigation"
            data-ga-label={label}
          >
            {label}
          </Link>
        ))}
        <a
          href={contactHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-ink hover:text-white transition-colors"
          data-ga-event="contact_click"
          data-ga-category="contact"
          data-ga-label="Header book a call"
        >
          Book a call <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <button
        className="md:hidden flex flex-col gap-[6px] pt-2"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <span className={`block h-[1.5px] w-8 bg-ink transition-transform ${open ? "translate-y-[3.75px] rotate-45" : ""}`} />
        <span className={`block h-[1.5px] w-8 bg-ink transition-transform ${open ? "-translate-y-[3.75px] -rotate-45" : ""}`} />
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 z-50 bg-paper border-b border-line px-5 py-6 flex flex-col gap-4 text-lg text-ink"
        >
          {links.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <a href={contactHref} className="font-bold">
            Book a call ↗
          </a>
        </div>
      )}
    </header>
  );
}
