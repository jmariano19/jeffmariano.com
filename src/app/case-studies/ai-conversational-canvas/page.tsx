import Image from "next/image";
import type { Metadata } from "next";
import { SitePage } from "@/components/SiteChrome";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CanvasLoop from "@/components/case-study/CanvasLoop";
import Challenges from "@/components/case-study/Challenges";
import ContentSection from "@/components/case-study/ContentSection";
import Outcomes from "@/components/case-study/Outcomes";
import Quotes from "@/components/case-study/Quotes";
import NextCaseStudies from "@/components/case-study/NextCaseStudies";
import {
  BarrierDecisions,
  ChannelAdapt,
  ScreenShot,
  TapVisual,
  TypeVisual,
} from "@/components/case-study/CanvasStory";
import { Consolidation } from "@/components/case-study/Consolidation";

export const metadata: Metadata = {
  title: "AI Conversational Canvas — Jeff Mariano",
  description:
    "Consolidating the separate apps reps used into one AI canvas that assembles the right tool on request, and adapts to how each channel works.",
  // Draft while the story is being refined.
  robots: { index: false, follow: false },
};

export default function AiConversationalCanvas() {
  return (
    <SitePage>
      <CaseStudyHero
        tag="VERIZON · AI CONVERSATIONAL CANVAS · OMNICHANNEL"
        title="One AI Canvas for Every Way Reps Help Customers"
        summary="Reps were jumping between separate apps to help a single customer. We consolidated them into one AI canvas that assembles the right tool when a rep asks, and adapts to how each channel works: tapping in retail stores, typing in customer service."
        meta="Role: Associate Director, UX · owner of the agent interaction model | Channels: Retail stores · Customer service | Platform: AI canvas with generative UI"
        media={
          <div className="relative overflow-hidden rounded-[22px] md:rounded-[40px] bg-[#b99a90] px-[4%] py-[8%] md:px-[17.25%] md:py-[6.45%]">
            {/* Zoomed toward the right so the teal crescent peeks out beside the tablet */}
            <Image
              src="/images/case-studies/canvas/hero-bg.webp"
              alt=""
              fill
              priority
              unoptimized
              className="object-cover scale-[1.4] origin-[100%_50%]"
            />
            {/* A light tablet resting on the gradient */}
            <div className="relative rounded-[20px] md:rounded-[38px] bg-white p-[5px] md:p-[11px] shadow-[0_30px_90px_rgba(20,35,80,0.35)]">
              <CanvasLoop />
            </div>
          </div>
        }
      />

      <Challenges
        stats={[
          { number: "1", label: "canvas replacing a stack of separate rep apps" },
          { number: "2", label: "channels with different ways of working: tap and type" },
          { number: "6", label: "quote steps assembled in a single guided flow" },
        ]}
        description="Every customer conversation pulled reps across a different set of tools: one to look up the account, another to check credit, another for offers, another to build the order. Each switch cost time and attention while the customer waited, and the AI capabilities we were adding risked becoming one more tool to open. The goal wasn't to add AI to the stack. It was to replace the stack with one place to work, and to make that place fit both the rep on a store floor and the rep on a headset."
      />

      <ContentSection
        title="From a Stack of Apps to One Canvas"
        tag="THE CONSOLIDATION"
        description="Instead of a home screen of app icons, the canvas opens with a single question: how can I help you today? The rep can tap a suggested action or ask in their own words. The canvas brings in the customer's context and assembles the tool for that task, so the rep never has to remember which system does what."
      >
        <Consolidation
          tools={[
            "Customer profile",
            "Credit check",
            "Offers & promotions",
            "Device catalog",
            "Trade-in",
            "Plan builder",
            "Cart & checkout",
            "Knowledge base",
          ]}
        />
      </ContentSection>

      <ContentSection
        title="Same Canvas, Different Channel"
        tag="RESEARCH-LED ADAPTATION"
        description="One canvas didn't mean one experience. Research with reps in both channels showed they work in fundamentally different ways. In a store, the rep is standing next to the customer with a tablet, often sharing the screen. In customer service, the rep is on a headset or in a chat, typing fast and juggling several windows. So the canvas keeps the same model and components, but changes how the rep drives it."
      >
        <ChannelAdapt
          channels={[
            {
              name: "Retail stores",
              mode: "Tap-first",
              setting: "Tablet in hand, customer beside the rep",
              visual: <TapVisual />,
              points: [
                "Suggested actions up front, with large tap targets for working on the move",
                "Flows the rep can turn toward the customer, like reviewing the cart together",
                "Context stays visible but steps aside once a flow starts",
              ],
            },
            {
              name: "Customer service",
              mode: "Type-first",
              setting: "Desktop, headset or chat, several windows open",
              visual: <TypeVisual />,
              points: [
                "A command bar the rep can drive from the keyboard without breaking the conversation",
                "The live conversation feeds context, so the rep types less",
                "Denser layouts and shorter answers, tuned for speed over show",
              ],
            },
          ]}
        />
      </ContentSection>

      <ContentSection
        title="The AI Builds the Tool, Not a Reply"
        tag="THE INTERACTION MODEL"
        description="When a rep asks to build a quote, the canvas doesn't answer with a paragraph. It assembles a working quote flow, from offers to perks, with the steps it can complete from the account already checked. The rep reviews and decides at every step. AI recommendations are always marked, and nothing is selected on the rep's behalf."
        explanation="The flow ends in a cart grouped by line and a cost breakdown that compares the current and new monthly bill. A 'View together' mode lets the rep turn the tablet and walk the customer through it, so the trust the tool builds extends to the customer too."
      >
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <ScreenShot
            src="/images/case-studies/canvas/quote-offers.webp"
            alt="Quote configuration with AI-recommended offers, the best one highlighted"
            caption="Recommended offers, marked as AI suggestions. The rep makes the choice."
          />
          <ScreenShot
            src="/images/case-studies/canvas/cost-breakdown.webp"
            alt="Cost breakdown comparing current and estimated new monthly costs"
            caption="A cost breakdown designed to be reviewed with the customer."
          />
        </div>
      </ContentSection>

      <ContentSection
        title="Designed Around the Barriers to Adoption"
        tag="KEY DESIGN DECISIONS"
        description="A capable AI tool still fails if reps don't trust it or don't want to use it in front of a customer. Each major decision answered one of the five behavioral barriers I design around."
      >
        <BarrierDecisions
          items={[
            {
              barrier: "Trust uncertainty",
              decision: "AI output is always marked with the sparkle and gradient, so reps can tell a suggestion from account data at a glance.",
            },
            {
              barrier: "Identity threat",
              decision: "The AI recommends but never selects. The rep makes every choice, and 'View all offers' is always one tap away.",
            },
            {
              barrier: "Cognitive load",
              decision: "One guided flow replaces switching between systems, and steps the AI can complete arrive already filled in for review.",
            },
            {
              barrier: "Delayed reward",
              decision: "Value shows up immediately: savings in the cart, and the new monthly bill next to the current one.",
            },
            {
              barrier: "Behavioral friction",
              decision: "Thumbs up and down on every recommendation, so the system learns from reps without adding steps to their work.",
            },
          ]}
        />
      </ContentSection>

      <Outcomes
        items={[
          { title: "One Entry Point", description: "A single canvas in place of separate apps for each task" },
          { title: "Channel-Native", description: "Tap-first in stores, type-first in customer service, one shared model" },
          { title: "Rep in Control", description: "AI recommends, the rep decides at every step" },
          { title: "Built to Learn", description: "Feedback on every recommendation feeds the system" },
        ]}
      />

      <Quotes
        quotes={[
          {
            text: "The AI shouldn't answer with a paragraph. It should hand the rep the tool they need, already set up, and then get out of the way.",
            author: null,
            lines: true,
          },
        ]}
      />

      <NextCaseStudies
        studies={[
          {
            company: "Verizon",
            title: "The AI Was Smart. The UX Was Wrong.",
            image: "/images/case-verizon-ai.png",
            href: "/case-studies/verizon-ai",
          },
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
        ]}
      />
    </SitePage>
  );
}
