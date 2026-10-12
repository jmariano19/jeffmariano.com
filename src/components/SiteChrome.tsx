import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

// Shared header, section labels and contact block used by the homepage and About page.

export const contactEmail = "mailto:jmariano19@gmail.com";

export function Asterisk({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" className="shrink-0">
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <line x1="7" y1="0.5" x2="7" y2="13.5" />
        <line x1="0.5" y1="7" x2="13.5" y2="7" />
        <line x1="2.4" y1="2.4" x2="11.6" y2="11.6" />
        <line x1="11.6" y1="2.4" x2="2.4" y2="11.6" />
      </g>
    </svg>
  );
}

export function SectionLabel({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="scroll-mt-8 border-t border-[#c9c9c9] pt-3 mb-5 flex items-center gap-2 text-[13px] uppercase tracking-[0.02em] text-[#555]">
      <Asterisk />
      {children}
    </div>
  );
}

export function ContactPill({ dark = false, label = "Get in touch" }: { dark?: boolean; label?: string }) {
  return (
    <a
      href={contactEmail}
      className={`inline-flex items-center gap-2 rounded-full pl-1 pr-3.5 py-1 text-[12px] transition-opacity hover:opacity-80 ${
        dark ? "bg-[#1a1a1a] text-white" : "bg-white text-black shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
      }`}
      data-ga-event="contact_click"
      data-ga-category="contact"
      data-ga-label={dark ? "Contact section" : "Header"}
    >
      <span className="relative w-6 h-6 rounded-full overflow-hidden">
        <Image src="/images/about_portrait.jpg" alt="" fill sizes="24px" className="object-cover object-top" />
      </span>
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}

const navLinks = [
  { label: "About", href: "/about", key: "about" },
  { label: "Experiments", href: "/#side-projects", key: "experiments" },
] as const;

export function SiteHeader({ active }: { active?: "about" }) {
  return (
    <Reveal onLoad delay={0} y={-20}>
      <header className="pt-8 md:pt-9 flex items-start justify-between">
        <Link href="/" className="flex flex-col gap-4" aria-label="Jeffrey Mariano, home">
          <Image src="/images/Logo/logo-center.svg" alt="" width={34} height={34} priority />
          <span className="text-[12px] md:text-[13px] leading-[1.5]">
            Jeffrey Mariano
            <br />
            Based in the US
            <br />
            Currently at Verizon
          </span>
        </Link>
        <nav className="flex items-center gap-5 md:gap-7 text-[12px] md:text-[13px]" aria-label="Main">
          {navLinks.map((l) => {
            const isActive = l.key === active;
            return (
              <Link
                key={l.key}
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={`hidden sm:inline-flex items-center gap-1.5 hover:opacity-60 ${isActive ? "font-semibold" : ""}`}
              >
                {isActive && <Asterisk size={11} />}
                {l.label}
              </Link>
            );
          })}
          <ContactPill />
        </nav>
      </header>
    </Reveal>
  );
}

export function ContactSection() {
  return (
    <section className="pb-20">
      <SectionLabel>Contact</SectionLabel>
      <Reveal y={60}>
        <h2 className="text-[36px] md:text-[56px] leading-[1.1] font-semibold tracking-[-0.04em]">
          Always happy to connect.
          <br />
          <span className="text-[#a8a8a8]">Feel free to reach out!</span>
        </h2>
        <div className="mt-8">
          <ContactPill dark />
        </div>
      </Reveal>
    </section>
  );
}
