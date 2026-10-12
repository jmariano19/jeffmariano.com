import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { ContactSection, SectionLabel, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import ScrollBlur from "@/components/ScrollBlur";

// Placeholder images were cropped from the design mockup; swap in the full-resolution originals.
const projects = [
  {
    name: "Cortex",
    description: "An AI platform that unifies every assisted customer service channel.",
    image: "/images/home/cortex.jpg",
    href: null,
  },
  {
    name: "Systems",
    description: "A retail design system scaled across 15+ teams at Verizon.",
    image: "/images/home/systems.jpg",
    href: "/case-studies/verizon-design-systems",
  },
  {
    name: "Plato Inteligente",
    description: "A WhatsApp-first AI health platform for the Hispanic community.",
    image: "/images/home/plato.jpg",
    href: "/case-studies/vivebien",
  },
  {
    name: "Tinybeans",
    description: "A rebrand for a 20 million-family app, without breaking trust.",
    image: "/images/home/tinybeans.jpg",
    href: "/case-studies/tinybeans",
  },
];

const experience = [
  "Verizon",
  "ViveBien Health Technologies",
  "Tinybeans / Red Tricycle",
  "New York Daily News / U.S. News & World Report",
  "Quidsi / Amazon",
  "Shutterfly",
  "Etag Technologies",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#111] font-[family-name:var(--font-inter)] tracking-[-0.02em]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[68px]">
        <SiteHeader />

        {/* Hero */}
        <section className="pt-28 md:pt-[200px] pb-28 md:pb-[230px]">
          <ScrollBlur>
          <Reveal onLoad delay={0.1}>
            <h1 className="text-[40px] md:text-[64px] xl:text-[80px] 2xl:text-[88px] leading-[1.05] font-bold tracking-[-0.04em]">
              <span className="text-[#a8a8a8]">
                <span className="xl:block">I design intelligent</span> systems that connect{" "}
              </span>
              <span className="xl:block">people, workflows and AI.</span>
            </h1>
          </Reveal>
          <Reveal onLoad delay={0.25}>
            <p className="mt-8 md:mt-10 text-[16px] md:text-[18px] leading-[1.7] tracking-[-0.01em] max-w-[38rem]">
              I help organizations build AI that their teams and customers actually adopt, using
              behavioral design and rapid experiments shaped by years in retail, customer service,
              and health.
            </p>
          </Reveal>
          </ScrollBlur>
        </section>

        {/* Projects */}
        <section className="pb-16 md:pb-20">
          <SectionLabel>Projects</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-x-5 gap-y-12 md:gap-y-[70px]">
            {projects.map((p, i) => {
              const card = (
                <>
                  <div className="relative aspect-[4/3] rounded-[14px] overflow-hidden bg-[#e4e4e4]">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="mt-4 text-[18px] md:text-[22px] uppercase leading-tight font-medium tracking-[-0.03em]">{p.name}</h3>
                  <p className="mt-1 text-[16px] md:text-[20px] text-[#9a9a9a] leading-snug tracking-[-0.03em]">{p.description}</p>
                </>
              );
              return (
                <Reveal key={p.name} blur y={60} delay={(i % 2) * 0.12}>
                {p.href ? (
                <Link
                  href={p.href}
                  className="group block"
                  data-ga-event="case_study_click"
                  data-ga-category="case_studies"
                  data-ga-label={p.name}
                >
                  {card}
                </Link>
              ) : (
                <div className="group">{card}</div>
              )}
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Side projects */}
        <section className="pb-20 md:pb-24">
          <SectionLabel id="side-projects">Side projects</SectionLabel>
          <Reveal blur y={60}>
          <div className="overflow-hidden rounded-[14px] bg-[#1d1810] grid grid-cols-[1fr_auto] items-center gap-4 md:gap-10 pl-6 md:pl-[10%] pr-4 md:pr-[8%]">
            <div className="py-10 md:py-0 max-w-[460px]">
              <p className="text-[12px] md:text-[13px] uppercase tracking-[0.04em] text-[#8a7a5c]">
                Narrative game · Prototype
              </p>
              <h3 className="mt-3 md:mt-4 text-[28px] md:text-[52px] leading-[1.05] font-semibold tracking-[-0.04em] text-[#d6bf8e]">
                Eli&apos;s Last Experiment
              </h3>
              <p className="mt-3 md:mt-5 text-[14px] md:text-[17px] leading-relaxed text-[#a39880]">
                A boy built from the player&apos;s own words. An experiment in how people form trust and attachment with an AI character.
              </p>
            </div>
            <div className="relative h-[260px] sm:h-[360px] md:h-[520px] aspect-[434/660] self-end">
              <Image src="/images/home/eli.jpg" alt="" fill sizes="(max-width: 768px) 40vw, 30vw" className="object-contain object-bottom [mask-image:linear-gradient(to_right,transparent,black_18%,black_88%,transparent)]" />
            </div>
          </div>
          </Reveal>
        </section>

        {/* Experience */}
        <section className="pb-20 md:pb-24">
          <SectionLabel>Experience</SectionLabel>
          <ul className="mt-10 border-t border-[#c9c9c9]">
            {experience.map((company, i) => (
              <li key={company} className="border-b border-[#c9c9c9]">
                <Reveal y={20} delay={i * 0.05} className="py-3.5 text-[12px] md:text-[13px] font-medium">
                  {company}
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <ContactSection />

        <SiteFooter />
      </div>
    </div>
  );
}
