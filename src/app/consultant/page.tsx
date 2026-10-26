import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { ContactForm } from "@/components/ContactPill";
import { Asterisk, OnlineAsterisk } from "@/components/SiteChrome";
import Simplify from "@/components/consultant/Simplify";
import BeforeAfter from "@/components/consultant/BeforeAfter";

// The business-facing side of jeffmariano.com. Reached only by its URL (/consultant):
// it isn't in the portfolio navigation or the sitemap, so recruiters see the portfolio as before.

const description =
  "I help service businesses cut repetitive work by connecting the tools they already use and adding AI where it actually helps.";

export const metadata: Metadata = {
  title: "Practical AI for service businesses",
  description,
  alternates: { canonical: "/consultant" },
  // Kept out of search for now; switch to true when you're ready for people to find it.
  robots: { index: false, follow: false },
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

const help = [
  {
    n: "01",
    title: "Find the opportunities",
    body: "I look at how work actually gets done, find the friction that costs you the most time, and help you pick what's worth fixing first.",
  },
  {
    n: "02",
    title: "Design and build the solution",
    body: "I connect the systems you already have, add AI where it genuinely helps, and build practical tools for one specific problem at a time.",
  },
  {
    n: "03",
    title: "Make it stick",
    body: "I test with the people who'll use it, refine until it fits their day, and measure whether it's actually saving time.",
  },
];

const steps = [
  { n: "1", title: "Discover", body: "We talk through your business, your tools, your team and the requests that keep repeating." },
  { n: "2", title: "Pick one workflow", body: "Together we choose one process where a fix would make a real difference." },
  { n: "3", title: "Pilot", body: "I build and test a focused solution with your team, with clear measures of success agreed up front." },
  { n: "4", title: "Improve", body: "We look at the results, refine what needs it, and decide together whether it's worth going further." },
];

const credentials = [
  { k: "15+ years", v: "designing digital products and the tools teams use every day." },
  { k: "Complex workflows", v: "for retail and customer service teams at Fortune 50 scale." },
  { k: "Hands-on", v: "I design, prototype and build working tools myself, including an AI product I launched." },
  { k: "Adoption first", v: "I measure whether people actually use it, not just whether it shipped." },
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
                  Here&apos;s a request almost every service business gets. Switch between the two to see the difference.
                </p>
              </div>
            </Reveal>
            <Reveal y={60}>
              <div className="mt-10 md:mt-14">
                <BeforeAfter />
              </div>
            </Reveal>
          </Section>

          {/* 4. What I help with */}
          <Section>
            <Reveal y={50}>
              <Label>How I help</Label>
              <Heading dark="Practical help," light="from first look to working tool." />
            </Reveal>
            <div className="mt-12 grid gap-3 md:mt-16 lg:grid-cols-3 lg:gap-4">
              {help.map((h, i) => (
                <Reveal key={h.title} y={40} delay={i * 0.08} className="h-full">
                  <div className="flex h-full min-h-[240px] flex-col justify-between rounded-[16px] bg-white p-6 md:p-7">
                    <span className="font-mono text-[13px] text-[#9a9a9a]">{h.n}</span>
                    <div>
                      <h3 className="text-[24px] font-semibold tracking-[-0.035em] md:text-[28px]">{h.title}</h3>
                      <p className="mt-3 text-[16px] leading-[1.55] text-[#5f5f5f]">{h.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal y={30}>
              <p className="mt-10 max-w-[760px] text-[22px] font-semibold leading-[1.35] tracking-[-0.03em] md:mt-14 md:text-[28px]">
                Technology alone doesn&apos;t fix a workflow. <span className="text-[#9a9a9a]">If your team won&apos;t use it, it doesn&apos;t work. So
                I design around the people doing the work, then build.</span>
              </p>
            </Reveal>
          </Section>

          {/* 5. How we work together */}
          <Section>
            <Reveal y={50}>
              <Label>How we work together</Label>
              <Heading dark="Start with one workflow." light="Then decide what's next." />
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
            <Reveal y={30}>
              <p className="mt-10 max-w-[620px] rounded-[16px] bg-white p-5 text-[16px] leading-[1.55] text-[#333] md:mt-14 md:p-6 md:text-[17px]">
                No big transformation program. A focused pilot you can see working, with your own team, before you decide on anything more.
              </p>
            </Reveal>
          </Section>

          {/* 6. Why work with me */}
          <Section>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              <Reveal y={50}>
                <Label>Why work with me</Label>
                <Heading dark="Big-company experience," light="for small teams." />
                <p className="mt-6 max-w-[540px] text-[17px] leading-[1.65] text-[#333] md:text-[18px]">
                  I&apos;ve spent more than 15 years designing digital products and the tools behind them. Much of that has been for frontline
                  retail and customer service teams, where software only succeeds if busy people choose to use it. In that work I helped turn
                  an AI tool that almost nobody used, around 2%, into something people reached for every day.
                </p>
                <p className="mt-4 max-w-[540px] text-[17px] leading-[1.65] text-[#333] md:text-[18px]">
                  I also build. I designed and launched my own AI product from scratch, so I know what it takes to make AI work outside a
                  slide deck.
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
                      You don&apos;t need an AI strategy for everything. You need a clear place to start.
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
                    <p className="mb-2 px-1 text-[22px] font-bold tracking-[-0.03em] md:text-[27px]">Let&apos;s talk about your business</p>
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
