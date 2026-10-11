import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/v2/SiteHeader";
import SiteFooter from "@/components/v2/SiteFooter";
import ProjectCard from "@/components/v2/ProjectCard";
import ContributionTable from "@/components/v2/ContributionTable";
import SectionLabel from "@/components/v2/SectionLabel";
import FadeUp from "@/components/FadeUp";
import { caseStudies, contactHref, experience } from "@/content/work";

const offers = [
  {
    name: "AI adoption diagnostic",
    meta: "2–3 weeks · fixed scope",
    body: "Find out why people aren't using the AI you already built. I map where trust, habits, and workflow break down, test small fixes in real conditions, and hand back a prioritized plan your team can act on.",
  },
  {
    name: "Fractional AI experience lead",
    meta: "A few days a month · ongoing",
    body: "Design and guide the rollout: agent interaction models, assisted workflows, and the experiments that show what's worth scaling.",
  },
];

const steps = [
  { title: "Find what to solve", body: "Research and observation reveal the real reason people aren't adopting.", image: "/images/method-3.png" },
  { title: "Run a micro experiment", body: "Test small changes in real conditions, not in a deck.", image: "/images/method-2.png" },
  { title: "Read the signal", body: "Look for behavior that shows value, not opinions about it.", image: "/images/method-1.png" },
  { title: "Earn the right to scale", body: "Scale only what proves itself.", image: "/images/method-4.png" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink font-[family-name:var(--font-roboto)]">
      <div className="max-w-[1440px] mx-auto">
        <SiteHeader />

        {/* Hero */}
        <section className="px-5 md:px-10 pt-24 md:pt-40 pb-24 md:pb-36 md:pl-[30%]">
          <FadeUp>
            <h1 className="text-[34px] md:text-[52px] leading-[1.12] font-bold tracking-[-0.01em] max-w-[880px]">
              <span className="text-[#a9a9a5]">I design intelligent systems that connect </span>
              people, workflows and AI.
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-6 text-[16px] md:text-[17px] leading-relaxed text-ink-muted max-w-[560px]">
              I help organizations implement AI that their teams and customers actually adopt, through
              behavioral design, micro-experimentation, and a method built across retail, customer
              service, and health.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3 text-[14px]">
              <a
                href={contactHref}
                className="rounded-full bg-ink text-white px-5 py-2.5 hover:opacity-85 transition-opacity"
                data-ga-event="contact_click"
                data-ga-category="contact"
                data-ga-label="Hero book a call"
              >
                Book a 20-minute call ↗
              </a>
              <a href="#work-with-me" className="rounded-full bg-white px-5 py-2.5 hover:bg-ink hover:text-white transition-colors">
                How I work with teams
              </a>
            </div>
          </FadeUp>
        </section>

        {/* Selected work */}
        <section className="px-5 md:px-10 pb-24">
          <SectionLabel>Selected work</SectionLabel>
          <div className="flex flex-col gap-16 md:gap-24">
            {caseStudies.slice(0, 2).map((study, i) => (
              <ProjectCard key={study.href} study={study} priority={i === 0} />
            ))}
          </div>
          <div className="mt-12">
            <Link href="/projects" className="text-[15px] font-medium underline underline-offset-4 hover:opacity-60">
              See all projects →
            </Link>
          </div>
        </section>

        {/* Beyond the case studies */}
        <section className="px-5 md:px-10 pb-24 md:pb-32">
          <SectionLabel>Beyond the case studies</SectionLabel>
          <ContributionTable />
        </section>

        {/* Work with me */}
        <section id="work-with-me" className="px-5 md:px-10 pb-24 md:pb-32 scroll-mt-8">
          <SectionLabel>Work with me</SectionLabel>
          <h2 className="text-[28px] md:text-[40px] leading-[1.15] font-bold max-w-[760px]">
            Your AI works. People aren&apos;t using it. That&apos;s the part I fix.
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-4">
            {offers.map((o) => (
              <div key={o.name} className="rounded-2xl bg-white p-6 md:p-8 flex flex-col">
                <p className="text-[13px] text-ink-muted">{o.meta}</p>
                <h3 className="mt-2 text-[22px] font-bold">{o.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{o.body}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-16 mb-6 text-[18px] font-bold">How the diagnostic works</h3>
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <li key={s.title}>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white">
                  <Image src={s.image} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                </div>
                <p className="mt-3 text-[15px] font-bold">
                  {i + 1}. {s.title}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Experience */}
        <section className="px-5 md:px-10 pb-24 md:pb-32">
          <SectionLabel>Experience</SectionLabel>
          <ul>
            {experience.map((company) => (
              <li key={company} className="py-4 border-b border-line text-[15px] md:text-[16px]">
                {company}
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="px-5 md:px-10 pb-20">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="text-[34px] md:text-[52px] leading-[1.1] font-bold">
            Have an AI rollout that isn&apos;t landing?
            <br />
            <span className="text-[#a9a9a5]">Let&apos;s talk for 20 minutes.</span>
          </h2>
          <a
            href={contactHref}
            className="mt-8 inline-flex rounded-full bg-ink text-white px-5 py-2.5 text-[14px] hover:opacity-85 transition-opacity"
            data-ga-event="contact_click"
            data-ga-category="contact"
            data-ga-label="Contact book a call"
          >
            Book a call ↗
          </a>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
