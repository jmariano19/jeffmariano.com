import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import Challenges from "@/components/case-study/Challenges";
import ContentSection from "@/components/case-study/ContentSection";
import Outcomes from "@/components/case-study/Outcomes";
import Quotes from "@/components/case-study/Quotes";
import NextCaseStudies from "@/components/case-study/NextCaseStudies";
import FadeUp from "@/components/FadeUp";
import ImageSlider from "@/components/case-study/ImageSlider";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Verizon AI POS — Jeff Mariano",
  description:
    "Redesigned an AI-powered retail POS from 2% adoption to voluntary use at a Fortune 50 telecom company.",
};

export default function VerizonAI() {
  return (
    <div className="min-h-screen bg-cream max-w-[1440px] mx-auto">
      <Nav />

      <CaseStudyHero
        tag="AI PRODUCT DESIGN · FORTUNE 50 TELECOM"
        title="The AI Was Smart. The UX Was Wrong."
        meta="Role: Lead Designer | Team: 9 designers (3 on AI POS) | Scope: Retail Point-of-Sale System"
        image="/images/case-studies/1.top.png"
      />

      <Challenges
        stats={[
          { number: "2%", label: "Adoption rate on AI features" },
          { number: "200+", label: "AI UI components built" },
          { number: "0", label: "Representatives using it voluntarily" },
        ]}
        description="Two percent. That's how many retail employees were actually using the AI-powered features in a Fortune 50 company's point-of-sale system. Not because the AI didn't work — the AI was technically excellent. The problem was that nobody wanted to use it. Representatives hated the tool. When adoption stayed near zero, leadership made it mandatory. Representatives responded by opening the tool to satisfy the requirement, then immediately closing it. My job was to fix that — not by building better AI, but by designing an experience that respected how these people actually worked."
      />

      <ContentSection
        title="From Push to Pull"
        tag="THE CORE SHIFT"
        description="The old model pushed AI at representatives. Recommendations appeared unsolicited. The system auto-added items to customer carts. The representative was a passenger. We flipped this entirely — the new model let representatives pull AI assistance when they needed it."
        explanation="We used progressive disclosure throughout. The first layer was a contextual suggestion the rep could tap to explore, ignore, or modify. If they wanted more detail, they could go deeper. If they didn't, the suggestion stayed out of the way — reducing cognitive overload during fast-paced customer interactions."
        image="/images/case-studies/2.beforeandafter.png"
        imageFit="contain"
        beforeAfter={{
          before:
            "System builds the cart for the rep. AI auto-adds items. Representative has no control over the flow.",
          after:
            "System says: let's build this together. Rep chooses which AI tools to use, and when.",
        }}
      />

      {/* Simplified AI Outputs */}
      <section className="px-6 md:px-28 py-10 md:py-16">
        <FadeUp>
          <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[26px] md:text-[34px] leading-[32px] md:leading-[42px] text-green-heading mb-8">
            Simplified AI Outputs
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="font-[family-name:var(--font-roboto)] font-bold text-xs tracking-[2px] text-brown uppercase mb-2">
            WHAT CHANGED
          </p>
          <div className="w-full h-px bg-gray-text opacity-20 mb-4" />
          <p className="font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[32px] text-gray-text max-w-[900px]">
            Complex bill analysis and product matching turned into clear, actionable guidance. Outputs defined by customer inputs. Contextual agentic prompts based on each unique customer.
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <p className="font-[family-name:var(--font-roboto)] font-bold text-xs tracking-[2px] text-brown uppercase mb-2 mt-10">
            DESIGN PRINCIPLE
          </p>
          <div className="w-full h-px bg-gray-text opacity-20 mb-4" />
          <p className="font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[32px] text-gray-text max-w-[900px]">
            &ldquo;AI assists, employee decides.&rdquo; Every pattern reinforced human control. Override by deleting, clearing, changing inputs. Supervisor escalation built into the flow.
          </p>
        </FadeUp>

        {/* Progressive Disclosure slider */}
        <FadeUp delay={0.2}>
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
        </FadeUp>
      </section>

      <ContentSection
        title="The AI UX Framework"
        tag="WHAT I BUILT"
        description="I didn't just redesign one product. I built a framework — principles, design patterns, and approximately 200 UI components — specifically for AI interactions in retail. The core principle: AI assists, employee decides."
        explanation="Every pattern reinforced human control. Recommendation cards could be dismissed. Suggestions could be overridden. The AI never took an action the representative didn't explicitly approve. All standardized and reusable across any AI feature in the POS system — so when new AI capabilities were added, the team had a playbook."
      />

      <ContentSection
        title="The Tiger Team: Testing in the Real World"
        tag="HOW WE VALIDATED"
        description="We didn't trust lab testing. I coordinated a Signal Capturing Tiger Team — designers collaborating directly on front-end React components, deploying micro-flows to production and observing how they performed in actual stores."
        explanation="Bill optimization was our proving ground. It's one of the top reasons customers visit stores — high stakes, high visibility. We deployed it first, observed it, iterated, and used its success to earn permission for the next feature. Each micro-win built the case for the next expansion."
        image="/images/case-studies/4.tigerteam.png"
      />

      <Outcomes
        items={[
          {
            title: "Voluntary Adoption",
            description: "Reps went from closing the tool to actively using it during customer conversations",
          },
          {
            title: "200+ Components",
            description: "AI UX framework standardized across the entire retail system",
          },
          {
            title: "Sentiment Shift",
            description: "\"I feel like the Verizon team is finally understanding how we work\"",
          },
          {
            title: "PM Method Shift",
            description: "Micro-experiment approach adopted across product for scoping new features",
          },
        ]}
      />

      <Quotes
        quotes={[
          {
            text: "I feel like the Verizon team is finally understanding us and the way we work.",
            author: "Retail Representative",
          },
          {
            text: "AI adoption fails at the UX layer, not the ML layer. Give users control. Let them pull, not push.",
            author: null,
            lines: true,
          },
        ]}
      />

      <NextCaseStudies
        studies={[
          {
            company: "Verizon",
            title: "From 7 Inconsistent Screens to One Scalable Retail Design System",
            image: "/images/case-verizon-ecosystem.png",
            href: "/case-studies/verizon-design-systems",
          },
          {
            company: "ViveBien",
            title: "63 Million People Ignored by Digital Health",
            image: "/images/case-vivebien.png",
            href: "/case-studies/vivebien",
          },
          {
            company: "Tinybeans",
            title: "Rebranding a 20 Million-Family App",
            image: "/images/case-tinybeans.png",
            href: "/case-studies/tinybeans",
          },
        ]}
      />

      <Footer />
    </div>
  );
}
