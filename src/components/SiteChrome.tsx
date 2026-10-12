import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ContactPill from "@/components/ContactPill";

// Shared page frame, header, section labels and contact block used across the site.

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

const navLinks = [
  { label: "About", href: "/about", key: "about" },
  { label: "Experiments", href: "/#side-projects", key: "experiments" },
] as const;

export function SiteHeader({ active }: { active?: "about" }) {
  return (
    <Reveal onLoad delay={0} y={-20} className="relative z-30">
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

export function SiteFooter() {
  return (
    <footer className="pb-10 text-center text-[13px] text-[#9a9a9a]">
      Portfolio created with CODEX AND CLAUDE
    </footer>
  );
}

/** Standard page frame: neutral background, shared header, contact block and footer. */
export function SitePage({
  children,
  active,
  contact = true,
}: {
  children: React.ReactNode;
  active?: "about";
  contact?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#111] font-[family-name:var(--font-inter)] tracking-[-0.02em]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[68px]">
        <SiteHeader active={active} />
        {children}
        {contact && <ContactSection />}
        <SiteFooter />
      </div>
    </div>
  );
}
