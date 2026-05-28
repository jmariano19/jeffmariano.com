import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import ImageSlider from "@/components/case-study/ImageSlider";
import AnimatedEvidenceGraph from "@/components/case-study/AnimatedEvidenceGraph";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI Advisor — Jeff Mariano",
  description:
    "A Verizon AI case study on redesigning retail AI adoption around human conversation, trust, and representative control.",
};

const assetPath = "/images/case-studies/ai_advisor";

const evidenceSignals = [
  {
    label: "Support interruptions",
    value: 17,
    detail: "broke conversation momentum early",
  },
  {
    label: "Exploratory drift",
    value: 20,
    detail: "sent reps searching instead of deciding",
  },
  {
    label: "Decision complexity",
    value: 53,
    detail: "delayed confidence at key moments",
  },
  {
    label: "Any friction point",
    value: 96,
    detail: "appeared before a decision was reached",
  },
];

const impactHighlights = [
  {
    label: "Before",
    value: "Avoided AI",
    detail: "The tool was powerful, but reps treated it as an interruption.",
  },
  {
    label: "Shift",
    value: "Human control",
    detail: "AI moved from taking action to waiting for an invitation.",
  },
  {
    label: "After",
    value: "Voluntary use",
    detail: "Reps chose AI when it helped the customer conversation.",
  },
];

const outcomes = [
  {
    title: "Voluntary Adoption",
    description: "Reps chose to use AI features",
  },
  {
    title: "Faster Interactions",
    description: "Bill optimization time dropped significantly",
  },
  {
    title: "Framework Standard",
    description: "Adopted across the retail AI system",
  },
  {
    title: "Sentiment Shift",
    description: 'From "worst product" to actively requested',
  },
];

const relatedStudies = [
  {
    company: "Verizon",
    image: "/images/case-verizon-ecosystem.png",
    href: "/case-studies/verizon-design-systems",
  },
  {
    company: "Verizon",
    image: "/images/case-verizon-ai.png",
    href: "/case-studies/verizon-ai",
  },
  {
    company: "Plato Inteligente",
    image: "/images/case-vivebien.png",
    href: "/case-studies/vivebien",
  },
  {
    company: "TinyBeans",
    image: "/images/case-tinybeans.jpg",
    href: "/case-studies/tinybeans",
  },
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <>
      <p className="font-[family-name:var(--font-roboto)] font-bold text-sm md:text-[20px] leading-[30px] md:leading-[45px] text-gray-text uppercase">
        {children}
      </p>
      <div className="h-px w-full bg-gray-text/25 mt-3 md:mt-4" />
    </>
  );
}

function BodyCopy({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`font-[family-name:var(--font-roboto)] text-base md:text-[22px] leading-[30px] md:leading-[45px] text-gray-text ${className}`}>
      {children}
    </div>
  );
}

function OutcomeCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[18px] md:rounded-[28px] bg-[#def1d2] px-6 py-10 md:px-10 md:py-14 text-center">
      <h3 className="font-[family-name:var(--font-playfair)] font-bold text-[30px] md:text-[52px] leading-[38px] md:leading-[55px] text-[#535f4b]">
        {title}
      </h3>
      <p className="mt-2 font-[family-name:var(--font-roboto)] font-bold text-sm md:text-[22px] leading-[22px] md:leading-[35px] text-[#535f4b]">
        {description}
      </p>
    </div>
  );
}

export default function VerizonAI() {
  return (
    <div className="min-h-screen bg-cream max-w-[1440px] mx-auto">
      <Nav />

      <main>
        <section className="px-6 md:px-16 pt-6 md:pt-12 text-center">
          <FadeUp>
            <p className="font-[family-name:var(--font-roboto)] font-bold text-sm md:text-[20px] leading-[28px] md:leading-[45px] text-gray-text uppercase">
              AI + UX · Fortune 50 Telecom
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="mx-auto mt-4 font-[family-name:var(--font-playfair)] font-bold text-[42px] md:text-[56px] leading-[48px] md:leading-[65px] text-green-heading max-w-[820px]">
              What Happens When People Feel Seen by AI?
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mx-auto mt-8 max-w-[820px] font-[family-name:var(--font-roboto)] text-lg md:text-[24px] leading-[32px] md:leading-[42px] text-gray-text">
              Verizon&apos;s retail AI tool was technically powerful, but reps avoided it because it interrupted the human rhythm of sales conversations.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="mt-8 font-[family-name:var(--font-roboto)] text-base md:text-[22px] leading-[30px] md:leading-[45px] text-gray-text">
              <p><span className="font-bold">Role:</span> Project Lead</p>
              <p><span className="font-bold">Team:</span> 10 designers (US + India)</p>
              <p><span className="font-bold">Focus:</span> AI adoption in retail</p>
            </div>
          </FadeUp>
        </section>

        <FadeUp delay={0.25}>
          <div className="relative mt-16 md:mt-24 h-[300px] md:h-[720px] w-full overflow-hidden">
            <Image
              src={`${assetPath}/ai_advisor_top.png`}
              alt="Customer using a Verizon retail planning screen"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </FadeUp>

        <section className="px-6 md:px-14 py-12 md:py-16">
          <FadeUp>
            <div className="grid gap-5 md:grid-cols-3">
              {impactHighlights.map((item) => (
                <div key={item.label} className="rounded-[18px] bg-[#def1d2] px-6 py-7 md:px-8 md:py-9">
                  <p className="font-[family-name:var(--font-roboto)] font-bold text-xs md:text-sm uppercase tracking-[0.14em] text-[#535f4b]/80">
                    {item.label}
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-playfair)] font-bold text-[32px] md:text-[44px] leading-[38px] md:leading-[48px] text-[#535f4b]">
                    {item.value}
                  </h2>
                  <p className="mt-4 font-[family-name:var(--font-roboto)] text-base md:text-[18px] leading-7 text-[#535f4b]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp>
            <div className="mt-12 grid gap-8 rounded-[22px] border border-gray-text/20 px-6 py-8 md:grid-cols-[0.85fr_1.15fr] md:px-10 md:py-10">
              <div>
                <SectionLabel>My role</SectionLabel>
                <h2 className="mt-6 font-[family-name:var(--font-playfair)] font-bold text-[32px] md:text-[42px] leading-[40px] md:leading-[50px] text-green-heading">
                  I turned field signals into an AI interaction model reps could trust.
                </h2>
              </div>
              <BodyCopy className="md:pt-14">
                <p>
                  I led the design direction, coordinated a 10-person team across the US and India, translated store observations into interaction patterns, and helped turn the solution into a reusable AI UX framework for the retail system.
                </p>
              </BodyCopy>
            </div>
          </FadeUp>
        </section>

        <section className="px-6 md:px-14 py-14 md:py-20">
          <FadeUp>
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[32px] md:text-[42px] leading-[38px] md:leading-[50px] text-green-heading max-w-[720px]">
              The system assumes a linear journey. Real conversations are not.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <BodyCopy className="mt-6 max-w-[760px]">
              <p>
                The system optimized for workflow efficiency while representatives optimized for customer trust. We mapped live retail conversations and found that breakdowns were not isolated bugs. They were repeated loops, detours, and confidence gaps.
              </p>
            </BodyCopy>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="mt-12 md:mt-16">
              <h3 className="font-[family-name:var(--font-roboto)] font-bold text-xl md:text-[24px] text-center text-black mb-6">
                Friction Map
              </h3>
              <div className="relative w-full overflow-hidden rounded-[18px]">
                <Image
                  src={`${assetPath}/friction_map.png`}
                  alt="Friction map showing loops and detours in the retail workflow"
                  width={1853}
                  height={1043}
                  sizes="100vw"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="mt-12 md:mt-16">
              <div className="mb-6 max-w-[820px]">
                <SectionLabel>What the map revealed</SectionLabel>
                <BodyCopy className="mt-6">
                  <p>
                    The biggest issue wasn&apos;t a single broken feature. It was the amount of conversational effort reps spent recovering from interruptions, detours, and unclear decision points.
                  </p>
                </BodyCopy>
              </div>
              <AnimatedEvidenceGraph signals={evidenceSignals} />
            </div>
          </FadeUp>

          <FadeUp>
            <div className="mt-6 rounded-[16px] bg-[#f1d7d1] px-6 py-10 text-center">
              <p className="font-[family-name:var(--font-playfair)] italic font-bold text-[24px] md:text-[28px] leading-[34px] md:leading-[42px] text-[#6b332b]">
                &ldquo;96% of conversations hit at least one friction point before reaching a decision.&rdquo;
              </p>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="mt-12 grid md:grid-cols-2 gap-6 md:gap-12 font-[family-name:var(--font-roboto)] font-bold text-lg md:text-[22px] text-[#7b1410]">
              <p>Every loop = lost momentum</p>
              <p>Every detour = broken conversation</p>
            </div>
          </FadeUp>

          <FadeUp>
            <BodyCopy className="mt-8 max-w-[1020px]">
              <p>
                Every loop forced representatives to pause the conversation, leave the customer interaction, reconstruct context manually, and return with delayed answers.
              </p>
              <p className="mt-4">The friction wasn&apos;t just operational.</p>
              <p>It changed the emotional rhythm of the interaction.</p>
              <p>Confidence dropped. Momentum disappeared. The customer experience started to feel like waiting for the system instead of being guided by a person.</p>
            </BodyCopy>
          </FadeUp>
        </section>

        <section className="px-6 md:px-14 py-8 md:py-12">
          <FadeUp>
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[34px] md:text-[42px] leading-[42px] text-green-heading">
              Design Decisions
            </h2>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="mt-10">
              <h3 className="font-[family-name:var(--font-roboto)] font-bold text-xl md:text-[28px] text-[#172511] mb-10">
                From Push to Pull
              </h3>
              <SectionLabel>Before</SectionLabel>
              <BodyCopy className="mt-6 max-w-[1180px]">
                <p>
                  AI inserted recommendations into the cart before reps had built enough context or trust with the customer. Eight recommendations appeared at once, and the system told the rep what was in the quote. The rep became a passenger.
                </p>
              </BodyCopy>
              <div className="mt-12">
                <SectionLabel>After</SectionLabel>
                <BodyCopy className="mt-6 max-w-[1180px]">
                  <p>
                    Reps could invite AI into the conversation at the moment it became useful. Suggestion cards could be explored, ignored, or modified, and detail appeared only when needed. The rep built the cart with the customer, not behind the customer.
                  </p>
                </BodyCopy>
              </div>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="relative mt-12 h-[300px] md:h-[520px] overflow-hidden rounded-[10px]">
              <Image
                src={`${assetPath}/rep.png`}
                alt="Verizon representative helping a customer in store"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </FadeUp>

          <FadeUp>
            <div className="mt-12 rounded-[10px] bg-[#e6e2d6] p-5 md:p-8">
              <Image
                src={`${assetPath}/before_after.png`}
                alt="Before and after interface comparison from linear interface to AI Advisor"
                width={2010}
                height={1089}
                sizes="100vw"
                className="w-full h-auto rounded-[10px]"
              />
            </div>
          </FadeUp>
        </section>

        <section className="px-6 md:px-14 py-12 md:py-16">
          <FadeUp>
            <h2 className="font-[family-name:var(--font-roboto)] font-bold text-2xl md:text-[28px] text-[#172511]">
              Simplified Visual AI Outputs
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="mt-10">
              <SectionLabel>What changed</SectionLabel>
              <BodyCopy className="mt-6 max-w-[1180px]">
                <p>
                  Complex bill analysis and product matching became clear, actionable guidance. Instead of exposing every possible recommendation, the interface shaped AI output around customer inputs, conversational context, and the rep&apos;s next best decision.
                </p>
              </BodyCopy>
            </div>
          </FadeUp>
          <FadeUp>
            <div className="mt-12 rounded-[10px] overflow-hidden">
              <Image
                src={`${assetPath}/pattern.png`}
                alt="AI Advisor visual output patterns"
                width={1340}
                height={650}
                sizes="100vw"
                className="w-full h-auto"
              />
            </div>
          </FadeUp>

          <FadeUp>
            <div className="mt-14">
              <SectionLabel>Design principle</SectionLabel>
              <BodyCopy className="mt-6 max-w-[1180px]">
                <p>
                  &ldquo;AI assists, employee decides.&rdquo; Every pattern reinforced human control: delete, clear, change inputs, ask for more detail, or escalate to a supervisor. The AI could suggest, but the representative always kept authorship.
                </p>
              </BodyCopy>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="mt-12">
              <ImageSlider
                label="Progressive disclosure"
                images={[
                  "/images/case-studies/Images-slide/1.png",
                  "/images/case-studies/Images-slide/2.png",
                  "/images/case-studies/Images-slide/3.png",
                  "/images/case-studies/Images-slide/4.png",
                  "/images/case-studies/Images-slide/5.png",
                ]}
              />
            </div>
          </FadeUp>
        </section>

        <section className="px-6 md:px-14 py-12 md:py-16">
          <FadeUp>
            <h2 className="font-[family-name:var(--font-roboto)] font-bold text-2xl md:text-[28px] text-[#172511]">
              The AI UX Framework
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="mt-12 space-y-12">
              <div>
                <SectionLabel>What I built</SectionLabel>
                <BodyCopy className="mt-6 max-w-[1180px]">
                  <p>
                    Nearly 200 components, principles, and design patterns for AI interactions in retail: suggestion cards, override controls, contextual prompts, and progressive detail layers.
                  </p>
                </BodyCopy>
              </div>
              <div>
                <SectionLabel>Why it matters</SectionLabel>
                <BodyCopy className="mt-6 max-w-[1180px]">
                  <p>
                    New AI features no longer required a new interaction model every time. The framework gave teams a standard for introducing AI without removing judgment, context, or control from the representative.
                  </p>
                </BodyCopy>
              </div>
            </div>
          </FadeUp>
        </section>

        <section className="px-6 md:px-14 py-12 md:py-16">
          <FadeUp>
            <h2 className="font-[family-name:var(--font-roboto)] font-bold text-2xl md:text-[28px] text-[#172511] mb-8">
              The Tiger Team
            </h2>
          </FadeUp>
          <FadeUp>
            <div className="relative h-[280px] md:h-[520px] rounded-[20px] overflow-hidden border border-black/30">
              <Image
                src="/images/case-studies/4.tigerteam.png"
                alt="Illustration of the retail signal capturing tiger team"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </FadeUp>
          <FadeUp>
            <BodyCopy className="mt-12 max-w-[1100px]">
              <p>
                Designers wrote React components directly. Integrated with the retail component library. Deployed micro-flows to production. Selected specific stores for testing. I went to those stores personally to observe.
              </p>
              <p className="mt-4">
                We were looking for three signals: engagement lift, efficiency gains, and friction reduction. Solutions had to earn their right to exist through a live feedback loop.
              </p>
              <p className="mt-4">
                Bill optimization was our first sandbox project. We deployed it as a micro-flow, observed it in actual stores, and used those signals to determine what earned the right to scale.
              </p>
            </BodyCopy>
          </FadeUp>
        </section>

        <section className="px-6 md:px-14 py-12 md:py-16">
          <FadeUp>
            <h2 className="font-[family-name:var(--font-roboto)] font-bold text-2xl md:text-[28px] text-[#172511] mb-8">
              Outcomes
            </h2>
          </FadeUp>
          <div className="grid md:grid-cols-2 gap-6">
            {outcomes.map((outcome, index) => (
              <FadeUp key={outcome.title} delay={index * 0.08}>
                <OutcomeCard {...outcome} />
              </FadeUp>
            ))}
          </div>
        </section>

        <section className="px-6 md:px-14 py-12 md:py-20">
          <FadeUp>
            <blockquote className="border-l-8 border-[#e6e0cf] pl-6 md:pl-10 font-[family-name:var(--font-playfair)] italic text-[26px] md:text-[41px] leading-[36px] md:leading-[52px] text-gray-text max-w-[940px]">
              &ldquo;I feel that the Verizon team is finally understanding us and the way we work.&rdquo;
              <footer className="mt-6 font-[family-name:var(--font-roboto)] not-italic text-sm md:text-[18px] leading-[28px]">
                — Retail Representative
              </footer>
            </blockquote>
          </FadeUp>

          <FadeUp>
            <div className="mt-20 border-y border-gray-text/25 py-14 text-center">
              <p className="mx-auto font-[family-name:var(--font-playfair)] italic text-[26px] md:text-[41px] leading-[36px] md:leading-[52px] text-gray-text max-w-[940px]">
                &ldquo;Most AI products fail at the UX layer, not the ML layer. The fix isn&apos;t technical — it&apos;s philosophical. Give users control.&rdquo;
              </p>
              <p className="mx-auto mt-8 max-w-[820px] font-[family-name:var(--font-roboto)] text-base md:text-[22px] leading-[30px] md:leading-[40px] text-gray-text">
                This project changed AI from an automated decision-maker into a conversational support system, one that preserved rep judgment while making complex decisions easier to explain.
              </p>
            </div>
          </FadeUp>

          <FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {relatedStudies.map((study) => (
                <Link key={study.company + study.href} href={study.href} className="group">
                  <div className="relative h-[120px] md:h-[180px] rounded-[10px] overflow-hidden bg-[#e6e2d6]">
                    <Image
                      src={study.image}
                      alt={study.company}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 font-[family-name:var(--font-roboto)] font-bold text-sm md:text-[18px] text-gray-text">
                    {study.company}
                  </p>
                </Link>
              ))}
            </div>
          </FadeUp>
        </section>
      </main>

      <Footer />
    </div>
  );
}
