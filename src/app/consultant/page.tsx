import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { ContactForm } from "@/components/ContactPill";
import { Asterisk, OnlineAsterisk } from "@/components/SiteChrome";
import Simplify from "@/components/consultant/Simplify";
import BeforeAfter from "@/components/consultant/BeforeAfter";
import TimeCalculator from "@/components/consultant/TimeCalculator";

// The business-facing side of jeffmariano.com, linked quietly from the portfolio as "AI Consulting".

const description =
  "I help service businesses cut repetitive work by connecting the tools they already use and adding AI where it actually helps.";

export const metadata: Metadata = {
  title: "Practical AI for service businesses",
  description,
  alternates: { canonical: "/consultant" },
  openGraph: {
    title: "Your team has better things to do than repetitive work · Jeff Mariano",
    description,
    url: "https://jeffmariano.com/consultant",
    siteName: "Jeff Mariano",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your team has better things to do than repetitive work · Jeff Mariano",
    description,
  },
};

/* ---------- Small building blocks ---------- */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[14px] uppercase tracking-[0.02em] text-[#555] md:text-[15px]">
      <Asterisk />
      {children}
    </p>
  );
}

function Heading({ dark, light }: { dark: string; light?: string }) {
  return (
    <h2 className="mt-5 max-w-[17ch] text-[38px] font-bold leading-[1.02] tracking-[-0.045em] sm:text-[52px] xl:text-[68px]">
      {dark} {light && <span className="text-[#b0b0b0]">{light}</span>}
    </h2>
  );
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-8 border-t border-[#d4d4d4] pt-8 pb-24 md:pt-10 md:pb-36 ${className}`}>
      {children}
    </section>
  );
}

const CTA_PRIMARY =
  "inline-flex items-center gap-2 rounded-full bg-[#111] px-6 py-3.5 text-[16px] font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111] md:text-[17px]";
const CTA_SECONDARY =
  "inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[16px] font-semibold text-[#111] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111] md:text-[17px]";

/* ---------- Content ---------- */

const problems = [
  {
    title: "Information is everywhere",
    body: "Customer details live in the inbox, the booking tool, a spreadsheet and someone's head. Every answer starts with a search.",
  },
  {
    title: "The same tasks, every day",
    body: "Re-typing, copy-pasting and chasing follow-ups quietly eat hours your team could spend with customers.",
  },
  {
    title: "Customers wait",
    body: "When one request needs four tools and a handful of manual steps, replies slow down and things slip through the cracks.",
  },
  {
    title: "AI that nobody uses",
    body: "A chatbot or AI feature gets switched on, the team works around it, and the old way quietly wins.",
  },
];

const steps = [
  {
    n: "1",
    title: "Discover",
    body: "We walk through one existing workflow together, talk to the people doing it, and find the repetitive tasks that cost the most time.",
  },
  {
    n: "2",
    title: "Prioritize",
    body: "We pick one realistic opportunity, weighing business impact, what's technically feasible with your tools, and what your team will actually adopt.",
  },
  {
    n: "3",
    title: "Pilot",
    body: "I design and build a focused prototype or working solution within an agreed scope, using the systems you already have where possible.",
  },
  {
    n: "4",
    title: "Measure",
    body: "We look at the results and how your team experienced it, then decide together whether going further makes sense.",
  },
];

const deliverables = [
  "A clear map of how the workflow runs today",
  "One prioritized opportunity, with the reasoning behind it",
  "A focused AI-assisted prototype or working solution",
  "Feedback from the people who used it",
  "Honest recommendations for what to do next",
];

const credentials = [
  { k: "15+ years", v: "designing digital products and the everyday tools teams rely on." },
  { k: "Frontline teams", v: "complex workflows for retail and customer service staff at Fortune 50 scale." },
  { k: "Hands-on", v: "I design, prototype and build working tools myself, not just slides." },
  { k: "Adoption first", v: "I check whether people actually use what's built, not just whether it shipped." },
];

export default function Consultant() {
  return (
    <div id="top" className="min-h-screen bg-[#f2f2f2] text-[#111] font-[family-name:var(--font-inter)] tracking-[-0.02em]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-[68px]">
        {/* Header: a lighter version of the portfolio header, with one action */}
        <Reveal onLoad delay={0} y={-20} className="relative z-30">
          <header className="flex items-start justify-between pt-7 md:pt-9">
            <Link href="/consultant" className="flex flex-col gap-4" aria-label="Jeffrey Mariano, practical AI for service businesses">
              <Image src="/images/Logo/logo-center.svg" alt="" width={36} height={36} priority />
              <span className="text-[15px] leading-[1.4] tracking-[-0.03em] md:text-[16px]">
                <span className="font-semibold">Jeffrey Mariano</span>
                <br />
                <span className="text-[#6b6b6b]">Practical AI for service businesses</span>
              </span>
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-white py-2 pl-3 pr-4 text-[14px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-opacity hover:opacity-80 md:text-[15px]"
              data-ga-event="consulting_cta"
              data-ga-category="consulting"
              data-ga-label="Header"
            >
              <OnlineAsterisk />
              Let&apos;s talk
            </a>
          </header>
        </Reveal>

        <main>
          {/* 1. Hero */}
          <section className="pt-20 pb-20 md:pt-28 md:pb-28">
            <Reveal onLoad delay={0.1}>
              <Label>AI workflow consulting for service businesses</Label>
              <h1 className="mt-6 max-w-[15ch] text-[46px] font-bold leading-[1.0] tracking-[-0.05em] sm:text-[64px] xl:text-[88px]">
                <span className="text-[#b0b0b0]">Your team has better things to do</span> than repetitive work.
              </h1>
            </Reveal>
            <Reveal onLoad delay={0.25}>
              <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <p className="max-w-[640px] text-[18px] leading-[1.6] text-[#141414] md:text-[20px]">
                  I help service businesses cut repetitive work by connecting the tools they already use and adding AI where it actually
                  helps, so your people spend their time on customers, not copy-paste.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="#contact" className={CTA_PRIMARY} data-ga-event="consulting_cta" data-ga-category="consulting" data-ga-label="Hero">
                    Let&apos;s discuss your workflow <span aria-hidden="true">→</span>
                  </a>
                  <a href="#how" className={CTA_SECONDARY}>
                    See how it works
                  </a>
                  <p className="w-full text-[14px] text-[#6b6b6b] md:text-[15px]">
                    No complicated AI strategy required. Let&apos;s start with one problem worth solving.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal onLoad delay={0.4} y={60}>
              <div className="mt-12 md:mt-16">
                <Simplify />
              </div>
            </Reveal>
          </section>

          {/* 2. The problem */}
          <Section>
            <Reveal y={50}>
              <Label>The problem</Label>
              <Heading dark="Your tools should make work easier." light="Not create more of it." />
            </Reveal>
            <div className="mt-12 grid gap-x-10 sm:grid-cols-2 md:mt-16">
              {problems.map((p, i) => (
                <Reveal key={p.title} y={30} delay={(i % 2) * 0.08}>
                  <div className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-[#d4d4d4] py-6 md:py-8">
                    <span className="pt-1 font-mono text-[13px] text-[#9a9a9a]">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-[22px] font-semibold tracking-[-0.03em] md:text-[26px]">{p.title}</h3>
                      <p className="mt-2 max-w-[44ch] text-[16px] leading-[1.55] text-[#5f5f5f] md:text-[17px]">{p.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* 3. The transformation */}
          <Section id="how">
            <Reveal y={50}>
              <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,380px)] md:items-end">
                <div>
                  <Label>What changes</Label>
                  <Heading dark="From disconnected steps" light="to one clear flow." />
                </div>
                <p className="text-[16px] leading-[1.55] text-[#5f5f5f] md:pb-2 md:text-[17px]">
                  One request almost every service business gets, handled two ways. Switch between them to see what changes for your team
                  and your customer.
                </p>
              </div>
            </Reveal>
            <Reveal y={60}>
              <div className="mt-10 md:mt-14">
                <BeforeAfter />
              </div>
            </Reveal>

            {/* Trust and human control */}
            <Reveal y={40}>
              <div className="mt-3 grid gap-6 rounded-[22px] bg-white p-6 md:mt-4 md:rounded-[32px] md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
                <div>
                  <h3 className="max-w-[18ch] text-[26px] font-bold leading-[1.1] tracking-[-0.035em] md:text-[34px]">
                    AI should support your team, <span className="text-[#9a9a9a]">not take control away from it.</span>
                  </h3>
                  <p className="mt-4 max-w-[44ch] text-[16px] leading-[1.55] text-[#5f5f5f] md:text-[17px]">
                    Solutions are designed around your existing workflows, appropriate data access, and human review wherever a decision
                    matters.
                  </p>
                </div>
                <ul className="grid gap-0 self-end">
                  {[
                    ["Works with what you have", "Built around the tools your team already uses, not a new system to learn."],
                    ["Only what the task needs", "Each workflow gets access to the information it needs, and nothing more is assumed."],
                    ["A person approves what matters", "Replies, changes to bookings and customer records wait for someone on your team."],
                  ].map(([t, d]) => (
                    <li key={t} className="grid gap-1 border-t border-[#e6e6e6] py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
                      <span className="text-[16px] font-semibold tracking-[-0.02em] md:text-[17px]">{t}</span>
                      <span className="text-[15px] leading-[1.5] text-[#5f5f5f] md:text-[16px]">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </Section>

          {/* 4. Calculator */}
          <Section id="estimate">
            <Reveal y={50}>
              <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,380px)] md:items-end">
                <div>
                  <Label>A quick estimate</Label>
                  <Heading dark="How much time does repetitive work" light="cost your team?" />
                </div>
                <p className="text-[16px] leading-[1.55] text-[#5f5f5f] md:pb-2 md:text-[17px]">
                  Move the sliders to match your team. The starting numbers are only an example.
                </p>
              </div>
            </Reveal>
            <Reveal y={60}>
              <div className="mt-10 md:mt-14">
                <TimeCalculator />
              </div>
            </Reveal>
            <Reveal y={30}>
              <div className="mt-10 flex flex-col gap-5 md:mt-14 md:flex-row md:items-center md:justify-between">
                <p className="max-w-[28ch] text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] md:text-[32px]">
                  Let&apos;s identify what&apos;s actually worth automating.
                </p>
                <a href="#contact" className={CTA_PRIMARY} data-ga-event="consulting_cta" data-ga-category="consulting" data-ga-label="Calculator">
                  Let&apos;s discuss your workflow <span aria-hidden="true">→</span>
                </a>
              </div>
            </Reveal>
          </Section>

          {/* 5. How we work together */}
          <Section>
            <Reveal y={50}>
              <Label>How we work together</Label>
              <Heading dark="Start with one workflow." light="Then decide what's next." />
              <p className="mt-6 max-w-[620px] text-[17px] leading-[1.6] text-[#333] md:text-[18px]">
                A small first engagement you can see working with your own team before you commit to anything bigger.
              </p>
            </Reveal>
            <ol className="mt-12 grid gap-0 md:mt-16 md:grid-cols-4 md:gap-4">
              {steps.map((s, i) => (
                <li key={s.title} className="relative border-t-2 border-[#111] pb-8 pt-5 md:pb-0">
                  <Reveal y={30} delay={i * 0.08}>
                    <span className="absolute -top-[7px] left-0 h-3 w-3 rounded-full bg-[#111]" aria-hidden="true" />
                    <p className="text-[14px] font-medium text-[#9a9a9a]">Step {s.n}</p>
                    <h3 className="mt-1 text-[24px] font-semibold tracking-[-0.035em] md:text-[26px]">{s.title}</h3>
                    <p className="mt-2 max-w-[34ch] text-[16px] leading-[1.55] text-[#5f5f5f]">{s.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal y={40}>
              <div className="mt-12 grid gap-6 rounded-[22px] bg-white p-6 md:mt-16 md:rounded-[32px] md:p-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">What a pilot can include</p>
                  <p className="mt-3 max-w-[30ch] text-[20px] font-semibold leading-[1.3] tracking-[-0.03em] md:text-[24px]">
                    Technology alone doesn&apos;t fix a workflow. <span className="text-[#9a9a9a]">If your team won&apos;t use it, it doesn&apos;t work.</span>
                  </p>
                  <p className="mt-4 text-[15px] leading-[1.5] text-[#777]">Scope and cost are agreed with you up front, based on the workflow.</p>
                </div>
                <ul className="self-end">
                  {deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 border-t border-[#e6e6e6] py-3.5 text-[16px] leading-[1.45] md:text-[17px]">
                      <span aria-hidden="true" className="mt-[3px] text-[#111]"><Asterisk size={12} /></span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </Section>

          {/* 6. Why work with me */}
          <Section>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              <Reveal y={50}>
                <Label>Why work with me</Label>
                <Heading dark="Big-company experience," light="for small teams." />
                <p className="mt-6 max-w-[540px] text-[17px] leading-[1.65] text-[#333] md:text-[18px]">
                  I&apos;ve spent more than 15 years designing digital products and the tools behind them, much of it for frontline retail and
                  customer service teams, where software only succeeds if busy people choose to use it. One example: I led a point-of-sale
                  redesign that went from 2% adoption to voluntary daily use.
                </p>
                <p className="mt-4 max-w-[540px] text-[17px] leading-[1.65] text-[#333] md:text-[18px]">
                  I also build. On my own, I designed and built ViveBien, an AI health companion on WhatsApp, and tested it with real users.
                  So I know what it takes to make AI work outside a slide deck.
                </p>
                <Link
                  href="/"
                  className="mt-7 inline-flex items-center gap-2 text-[16px] font-semibold underline underline-offset-4 hover:opacity-60"
                >
                  See my design portfolio <span aria-hidden="true">→</span>
                </Link>
              </Reveal>
              <dl className="self-end">
                {credentials.map((c, i) => (
                  <Reveal key={c.k} y={30} delay={i * 0.06} className="grid gap-1 border-t border-[#d4d4d4] py-5 sm:grid-cols-[180px_1fr] sm:gap-6 md:py-6">
                    <dt className="text-[20px] font-semibold tracking-[-0.03em] md:text-[22px]">{c.k}</dt>
                    <dd className="text-[16px] leading-[1.5] text-[#5f5f5f] md:text-[17px]">{c.v}</dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </Section>

          {/* 7. Final CTA */}
          <section id="contact" className="scroll-mt-8 pb-10 md:pb-14">
            <Reveal y={60}>
              <div className="relative overflow-hidden rounded-[28px] bg-[#161616] p-4 text-white md:p-6 lg:rounded-[46px] lg:p-[46px] lg:pl-[80px]">
                <div className="relative grid gap-10 lg:min-h-[480px] lg:grid-cols-[minmax(0,1fr)_389px] lg:gap-16">
                  <div className="flex flex-col justify-end px-2 pt-8 md:px-6 md:pt-10 lg:px-0 lg:pb-[30px] lg:pt-0">
                    <p className="flex items-center gap-2.5 text-[17px] text-white/50 md:text-[19px]">
                      <OnlineAsterisk />
                      Open to a few pilot projects
                    </p>
                    <h2 className="mt-3 max-w-[13ch] text-[48px] font-bold leading-[0.98] tracking-[-0.05em] sm:text-[72px] xl:text-[88px]">
                      Let&apos;s find one workflow worth improving.
                    </h2>
                    <p className="mt-5 max-w-[30rem] text-[18px] leading-[1.4] tracking-[-0.02em] text-white/55 md:text-[20px]">
                      No complicated AI strategy required. Let&apos;s start with one problem worth solving.
                    </p>
                    <div className="mt-8 flex max-w-[593px] flex-wrap gap-x-8 gap-y-2 border-t border-white/15 pt-5 text-[14px] text-white/50">
                      <a href="mailto:jmariano19@gmail.com?subject=Workflow%20conversation" className="hover:text-white">
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
                  <div className="flex flex-col justify-center rounded-[22px] bg-[#262626] p-5 md:p-7 lg:rounded-[27px] lg:px-[28px] lg:py-[40px]">
                    <p className="mb-2 px-1 text-[22px] font-bold tracking-[-0.03em] md:text-[27px]">Let&apos;s discuss your workflow</p>
                    <p className="mb-6 px-1 text-[15px] leading-[1.45] text-white/55">
                      Tell me a little about your team and the task that eats the most time. I&apos;ll get back to you personally.
                    </p>
                    <ContactForm
                      roomy
                      tone="dark"
                      source="consulting"
                      placeholder="What does your team do every day that feels repetitive?"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="flex flex-col gap-3 border-t border-[#d4d4d4] py-8 text-[14px] tracking-[-0.02em] text-[#6b6b6b] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Jeffrey Mariano · Independent practice, not affiliated with or endorsed by any current or past employer.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-[#111]">Design portfolio</Link>
            <a href="#top" className="hover:text-[#111]">Back to top ↑</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
