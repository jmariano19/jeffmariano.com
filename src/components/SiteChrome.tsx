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

/** Green asterisk that slowly turns and pulses, signalling "online / available". */
export function OnlineAsterisk() {
  return (
    <span className="relative inline-flex h-3 w-3 shrink-0 items-center justify-center text-[#4ade80]" aria-hidden="true">
      <span className="online-halo absolute inset-[-2px] rounded-full bg-[#4ade80]" />
      <span className="online-spin relative inline-flex drop-shadow-[0_0_4px_rgba(74,222,128,0.7)]">
        <Asterisk size={12} />
      </span>
    </span>
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
  { label: "AI Consulting", href: "/consultant", key: "consulting" },
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
        <nav className="flex items-center gap-6 whitespace-nowrap sm:gap-4 md:gap-6 lg:gap-8 text-[15px] md:text-[16px] tracking-[-0.03em]" aria-label="Main">
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
        <div className="relative overflow-hidden rounded-[28px] lg:rounded-[46px] bg-[#161616] text-white p-4 md:p-6 lg:p-[46px] lg:pl-[110px]">
          <Image
            src="/images/contact-silhouette.webp"
            alt=""
            width={1356}
            height={1159}
            sizes="(max-width: 1024px) 90vw, 660px"
            className="pointer-events-none absolute bottom-0 right-0 w-[90%] h-auto opacity-30 lg:right-auto lg:left-[10.6%] lg:w-[50.3%] lg:opacity-45"
          />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_389px] lg:gap-16 lg:min-h-[522px]">
            <div className="flex flex-col justify-end px-2 pt-8 md:px-6 md:pt-10 lg:px-0 lg:pt-0 lg:pb-[30px]">
              <p className="flex items-center gap-2.5 text-[17px] md:text-[21px] text-white/50">
                <OnlineAsterisk />
                Open to new work
              </p>
              <h2 className="mt-3 text-[72px] sm:text-[104px] xl:text-[142px] leading-[0.95] font-bold tracking-[-0.055em]">
                Let’s talk.
              </h2>
              <p className="mt-5 max-w-[26rem] text-[18px] md:text-[20px] leading-[1.3] tracking-[-0.02em] text-white/50">
                Rolling out AI your teams and customers need to actually adopt? I’d be glad to help.
              </p>
              <div className="mt-8 max-w-[593px] border-t border-white/15 pt-5 flex flex-wrap gap-x-8 gap-y-2 text-[14px] tracking-[-0.01em] text-white/50">
                <a href="mailto:jmariano19@gmail.com" className="hover:text-white">
                  jmariano19@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/jeffrey-mariano-0b28722a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-white"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-[22px] lg:rounded-[27px] bg-[#262626] p-5 md:p-7 lg:px-[28px] lg:py-[40px]">
              <p className="mb-7 flex items-center gap-2.5 px-1 text-[22px] md:text-[27px] font-bold tracking-[-0.03em]">
                <OnlineAsterisk />
                <span>
                  Have a project <span className="text-[#c1c1c1]">in mind?</span>
                </span>
              </p>
              <ContactForm roomy tone="dark" />
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
        <Link href="/consultant" className="hover:text-[#111]">AI Consulting</Link>
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
