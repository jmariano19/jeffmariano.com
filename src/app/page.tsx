import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { ContactSection, SectionTitle, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import ScrollBlur from "@/components/ScrollBlur";

// Placeholder images were cropped from the design mockup; swap in the full-resolution originals.
const projects = [
  {
    name: "Cortex",
    context: "Verizon",
    logo: { src: "/images/logos/verizon.svg", alt: "Verizon", width: 101, height: 23 },
    description: "An AI platform that unifies every assisted customer service channel.",
    image: "/images/home/cortex.jpg",
    href: null,
  },
  {
    name: "Systems",
    context: "Verizon",
    logo: { src: "/images/logos/verizon.svg", alt: "Verizon", width: 101, height: 23 },
    description: "A retail design system scaled across 15+ teams at Verizon.",
    image: "/images/home/systems.jpg",
    href: "/case-studies/verizon-design-systems",
  },
  {
    name: "Plato Inteligente",
    context: "ViveBien",
    description: "A WhatsApp-first AI health platform for the Hispanic community.",
    image: "/images/home/plato.jpg",
    href: "/case-studies/vivebien",
  },
  {
    name: "Tinybeans",
    context: "Tinybeans",
    description: "A rebrand for a 20 million-family app, without breaking trust.",
    image: "/images/home/tinybeans.jpg",
    href: "/case-studies/tinybeans",
  },
];

// Figures drawn from the case studies and About page.
const stats = [
  { value: "15+", unit: "yrs", label: "Designing products", note: "Across retail, media, e-commerce, customer service and health." },
  { value: "15+", unit: "teams", label: "On one design system", note: "Verizon's retail design system, shared across product teams." },
  { value: "2%", unit: "→ daily", label: "Adoption turnaround", note: "A POS redesign that went from 2% adoption to voluntary daily use." },
  { value: "13", unit: "agents", label: "In one rep platform", note: "A multi-agent platform for Verizon retail representatives." },
];

const experience = [
  { company: "Verizon", role: "Associate Director, UX", field: "Telecom · Retail AI" },
  { company: "ViveBien Health Technologies", role: "Founder & Designer", field: "Health tech" },
  { company: "Tinybeans / Red Tricycle", role: "Art Director", field: "Family & consumer apps" },
  { company: "New York Daily News / U.S. News & World Report", role: "", field: "Media" },
  { company: "Quidsi / Amazon", role: "", field: "E-commerce" },
  { company: "Shutterfly", role: "", field: "E-commerce" },
  { company: "Etag Technologies", role: "", field: "Technology" },
];

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[16px] transition-transform duration-300 group-hover:-rotate-45"
    >
      →
    </span>
  );
}

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-[#f2f2f2] text-[#111] font-[family-name:var(--font-inter)] tracking-[-0.02em]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[68px]">
        <SiteHeader />

        {/* Hero */}
        <section className="pt-24 md:pt-[180px] pb-14 md:pb-20">
          <ScrollBlur>
            <Reveal onLoad delay={0.1}>
              <h1 className="text-[44px] md:text-[64px] xl:text-[80px] 2xl:text-[88px] leading-[1.02] font-semibold tracking-[-0.055em]">
                <span className="text-[#a8a8a8]">
                  <span className="xl:block">I design intelligent</span> systems that connect{" "}
                </span>
                <span className="xl:block">people, workflows and AI.</span>
              </h1>
            </Reveal>
            <Reveal onLoad delay={0.25}>
              <p className="mt-8 md:mt-10 text-[18px] md:text-[22px] leading-[1.45] tracking-[-0.03em] max-w-[40rem] text-[#3a3a3a]">
                I help organizations build AI that their teams and customers actually adopt, using behavioral design
                and rapid experiments shaped by years in retail, customer service, and health.
              </p>
            </Reveal>
          </ScrollBlur>
        </section>

        {/* Proof */}
        <section aria-label="At a glance" className="pb-24 md:pb-36">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
            {stats.map((s, i) => (
              <Reveal key={s.label} y={40} delay={i * 0.07} className="h-full">
                <div className="flex h-full min-h-[210px] md:min-h-[260px] flex-col justify-between rounded-[16px] bg-white p-5 md:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[40px] md:text-[52px] leading-none font-semibold tracking-[-0.07em]">
                      {s.value}
                      <span className="ml-1 text-[18px] md:text-[22px] tracking-[-0.04em] text-[#9a9a9a]">{s.unit}</span>
                    </p>
                    <span className="text-[14px] tabular-nums text-[#9a9a9a]">0{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-[16px] md:text-[18px] font-medium tracking-[-0.03em]">{s.label}</p>
                    <p className="mt-1.5 text-[15px] leading-[1.45] text-[#6b6b6b]">{s.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="pb-24 md:pb-36">
          <SectionTitle
            title="Projects"
            kicker="Selected work"
            aside="AI platforms, design systems and consumer products, designed so complex tools feel clear, useful and human."
          />
          <div className="grid sm:grid-cols-2 gap-x-3 md:gap-x-4 gap-y-12 md:gap-y-16">
            {projects.map((p, i) => {
              const card = (
                <>
                  <div className="mb-3 flex items-baseline justify-between gap-4 text-[17px] md:text-[20px] tracking-[-0.04em]">
                    <h3 className="font-semibold">{p.name}</h3>
                    <span className="text-[#9a9a9a]">{p.context}</span>
                  </div>
                  <div className="relative aspect-[4/3] rounded-[16px] overflow-hidden bg-[#e4e4e4]">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className={`object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03] ${
                        p.logo ? "group-hover:blur-[18px] group-focus-visible:blur-[18px]" : ""
                      }`}
                    />
                    {p.logo && (
                      <>
                        {/* On hover the photo softens and the client logo comes forward. */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/30 group-focus-visible:bg-black/30"
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <Image
                            src={p.logo.src}
                            alt={p.logo.alt}
                            width={p.logo.width}
                            height={p.logo.height}
                            className="w-[27%] max-w-[168px] h-auto opacity-0 scale-[0.94] transition-[opacity,transform] duration-500 ease-out group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100"
                          />
                        </div>
                      </>
                    )}
                    <div className="absolute bottom-4 right-4">
                      {p.href ? (
                        <Arrow />
                      ) : (
                        <span className="inline-flex rounded-full bg-white/90 px-3.5 py-2 text-[14px] font-medium backdrop-blur">
                          Case study coming soon
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 max-w-[34rem] text-[16px] md:text-[18px] leading-[1.4] text-[#6b6b6b] tracking-[-0.03em]">
                    {p.description}
                  </p>
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
        <section className="pb-24 md:pb-36">
          <SectionTitle
            id="side-projects"
            title="Experiments"
            kicker="Side projects"
            aside="Where I test how people form trust with AI, outside of client work."
          />
          <Reveal blur y={60}>
            <div className="overflow-hidden rounded-[16px] bg-[#1d1810] grid grid-cols-[1fr_auto] items-center gap-4 md:gap-10 pl-6 md:pl-[10%] pr-4 md:pr-[8%]">
              <div className="py-10 md:py-0 max-w-[460px]">
                <p className="text-[14px] md:text-[14px] uppercase tracking-[0.04em] text-[#8a7a5c]">
                  Narrative game · Prototype
                </p>
                <h3 className="mt-3 md:mt-4 text-[30px] md:text-[56px] leading-[1.02] font-semibold tracking-[-0.05em] text-[#d6bf8e]">
                  Eli&apos;s Last Experiment
                </h3>
                <p className="mt-3 md:mt-5 text-[15px] md:text-[18px] leading-relaxed text-[#a39880]">
                  A boy built from the player&apos;s own words. An experiment in how people form trust and attachment with
                  an AI character.
                </p>
              </div>
              <div className="relative h-[260px] sm:h-[360px] md:h-[520px] aspect-[434/660] self-end">
                <Image
                  src="/images/home/eli.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 40vw, 30vw"
                  className="object-contain object-bottom [mask-image:linear-gradient(to_right,transparent,black_18%,black_88%,transparent)]"
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* Experience */}
        <section className="pb-24 md:pb-36">
          <SectionTitle
            title="Experience"
            kicker="15+ years"
            aside="In-house leadership at Fortune 50 scale, startup founding, and consumer brands."
          />
          <div role="table" aria-label="Experience" className="text-[16px] md:text-[18px] tracking-[-0.03em]">
            <div
              role="row"
              className="hidden md:grid grid-cols-[1.4fr_1fr_0.8fr] gap-6 pb-3 text-[14px] uppercase tracking-[0.02em] text-[#9a9a9a]"
            >
              <span role="columnheader">Company</span>
              <span role="columnheader">Role</span>
              <span role="columnheader" className="text-right">Industry</span>
            </div>
            {experience.map((e, i) => (
              <Reveal key={e.company} y={20} delay={i * 0.04}>
                <div
                  role="row"
                  className="grid grid-cols-[1fr_auto] md:grid-cols-[1.4fr_1fr_0.8fr] gap-x-6 gap-y-1 border-t border-[#d4d4d4] py-4 md:py-5"
                >
                  <span role="cell" className="font-medium">{e.company}</span>
                  <span role="cell" className="order-3 col-span-2 text-[#6b6b6b] empty:hidden md:order-none md:col-span-1 md:empty:block">
                    {e.role}
                  </span>
                  <span role="cell" className="text-right text-[#9a9a9a]">{e.field}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <ContactSection />
        <SiteFooter />
      </div>
    </div>
  );
}
