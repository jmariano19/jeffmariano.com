import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ContactPill, { ContactForm } from "@/components/ContactPill";
import MobileMenu from "@/components/MobileMenu";

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
    <div id={id} className="scroll-mt-8 border-t border-[#d4d4d4] pt-4 mb-6 flex items-center gap-2 text-[15px] uppercase tracking-[0.02em] text-[#555]">
      <Asterisk />
      {children}
    </div>
  );
}

const navLinks = [
  { label: "About", href: "/about", key: "about" },
  { label: "Experiments", href: "/#side-projects", key: "experiments" },
  { label: "Articles", href: "/articles", key: "articles" },
] as const;

type NavKey = (typeof navLinks)[number]["key"];

export function SiteHeader({ active }: { active?: NavKey }) {
  return (
    <Reveal onLoad delay={0} y={-20} className="relative z-30">
      <header className="pt-7 md:pt-9 flex items-start justify-between">
        <Link href="/" className="flex flex-col gap-4" aria-label="Jeffrey Mariano, home">
          <Image src="/images/Logo/logo-center.svg" alt="" width={36} height={36} priority />
          <span className="text-[15px] md:text-[16px] leading-[1.4] tracking-[-0.03em]">
            <span className="font-semibold">Jeffrey Mariano</span>
            <br />
            <span className="text-[#6b6b6b]">Based in the US</span>
            <br />
            <span className="text-[#6b6b6b]">Currently at Verizon</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 md:gap-8 text-[15px] md:text-[16px] tracking-[-0.03em]" aria-label="Main">
          {navLinks.map((l) => {
            const isActive = l.key === active;
            return (
              <Link
                key={l.key}
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={`hidden sm:inline-flex items-center gap-1.5 font-medium transition-opacity hover:opacity-50 ${isActive ? "" : "text-[#111]/70"}`}
              >
                {isActive && <Asterisk size={11} />}
                {l.label}
              </Link>
            );
          })}
          <span className="hidden sm:block">
            <ContactPill />
          </span>
          <MobileMenu />
        </nav>
      </header>
    </Reveal>
  );
}

/** Large display heading for a homepage section, with an optional note on the right. */
export function SectionTitle({
  title,
  kicker,
  aside,
  id,
}: {
  title: string;
  kicker?: string;
  aside?: React.ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="scroll-mt-8 border-t border-[#d4d4d4] pt-8 md:pt-10 mb-10 md:mb-14">
      <Reveal y={50}>
        <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,360px)] md:items-end">
          <div>
            <h2 className="text-[64px] sm:text-[96px] xl:text-[136px] leading-[0.92] font-semibold tracking-[-0.065em]">
              {title}
            </h2>
            {kicker && <p className="mt-3 text-[22px] md:text-[30px] font-semibold tracking-[-0.05em]">{kicker}</p>}
          </div>
          {aside && <div className="text-[16px] md:text-[17px] leading-[1.5] tracking-[-0.02em] text-[#6b6b6b] md:pb-3">{aside}</div>}
        </div>
      </Reveal>
    </div>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-8 pb-10 md:pb-14">
      <Reveal y={60}>
        <div className="relative overflow-hidden rounded-[24px] bg-[#121212] text-white px-6 py-10 md:p-14 lg:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_0%,rgba(255,255,255,0.10),transparent_60%)]"
          />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-[15px] text-white/60">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ade80]" />
                </span>
                Open to new work
              </p>
              <h2 className="mt-6 text-[64px] sm:text-[96px] xl:text-[136px] leading-[0.92] font-semibold tracking-[-0.065em]">
                Let&apos;s talk.
              </h2>
              <p className="mt-6 max-w-[30rem] text-[18px] md:text-[22px] leading-[1.35] tracking-[-0.03em] text-white/70">
                Rolling out AI your teams and customers need to actually adopt? I&apos;d be glad to help.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[16px] tracking-[-0.02em]">
                <a href="mailto:jmariano19@gmail.com" className="underline-offset-4 hover:underline">
                  jmariano19@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/jeffrey-mariano-0b28722a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
            <div className="rounded-[18px] bg-white p-4 md:p-5 text-[#111]">
              <p className="mb-4 px-1 text-[20px] font-semibold tracking-[-0.04em]">
                Have a project in mind?
              </p>
              <ContactForm roomy />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-[#d4d4d4] py-8 text-[15px] tracking-[-0.02em] text-[#6b6b6b] sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} Jeffrey Mariano</p>
      <div className="flex gap-6">
        <a href="mailto:jmariano19@gmail.com" className="hover:text-[#111]">Email</a>
        <a
          href="https://www.linkedin.com/in/jeffrey-mariano-0b28722a/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#111]"
        >
          LinkedIn ↗
        </a>
        <a href="#top" className="hover:text-[#111]">Back to top ↑</a>
      </div>
    </footer>
  );
}

/** Standard page frame: neutral background, shared header, contact panel and footer. */
export function SitePage({
  children,
  active,
  contact = true,
}: {
  children: React.ReactNode;
  active?: NavKey;
  contact?: boolean;
}) {
  return (
    <div id="top" className="min-h-screen bg-[#f2f2f2] text-[#111] font-[family-name:var(--font-inter)] tracking-[-0.02em]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[68px]">
        <SiteHeader active={active} />
        {children}
        {contact && <ContactSection />}
        <SiteFooter />
      </div>
    </div>
  );
}
