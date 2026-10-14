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
  TapVisual,
  TypeVisual,
} from "@/components/case-study/CanvasStory";
import { Consolidation } from "@/components/case-study/Consolidation";
import { ChannelAdapt } from "@/components/case-study/ChannelAdapt";
import { IntentComposer } from "@/components/case-study/IntentComposer";

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
        summary="Reps were switching between apps to help one customer. I designed how their intent, the customer’s context, and the channel shape one AI canvas—bringing the right tools into the workflow while keeping the rep in control."
        meta="Role: Associate Director, UX · Interaction model, UI composition rules & rep control | Channels: Retail stores · Customer service | Platform: AI canvas with generative UI"
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
        description="Helping one customer meant switching between account, credit, offer, and order tools. My challenge was to bring those tasks into one workflow that fits both a rep on the store floor and a rep on a headset."
      />

      <ContentSection
        visualFirst
        title="From a Stack of Apps to One Canvas"
        tag="THE CONSOLIDATION"
        description="Ask for the task. Get the customer context and tools to act in one place."
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
        visualFirst
        title="Same Canvas, Different Channel"
        tag="RESEARCH-LED ADAPTATION"
        description="One shared model, adapted to two ways of working: tap in stores, type in customer service."
        explanation="Research with reps informed the adaptation: store reps share a tablet with the customer; customer-service reps work on a desktop while managing a live conversation. I translated those differences into interaction, layout density, and how context stays visible."
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
        visualFirst
        title="The AI Builds the Tool, Not a Reply"
        tag="GENERATIVE UI · THE COMPOSITION LOGIC"
        description="I designed the rules that turn intent, customer context, and channel into the right interface."
        explanation="Intent determines which components appear. Customer context determines what leads. The channel determines density and interaction. A bill question leads with the change and its causes; an in-store upgrade leads with eligible offers and the current device. AI recommendations remain marked, and the rep makes the selections."
      >
        <IntentComposer />
      </ContentSection>

      <ContentSection
        visualFirst
        title="Designed Around the Barriers to Adoption"
        tag="KEY DESIGN DECISIONS"
        description="A capable AI tool still fails if reps don't trust it or don't want to use it in front of a customer. Each major decision answered one of the five behavioral barriers I design around."
      >
        <BarrierDecisions
          items={[
            {
              barrier: "Trust uncertainty",
              title: "Make AI suggestions recognizable",
              decision: "AI output is always marked with the sparkle and gradient, so reps can tell a suggestion from account data at a glance.",
            },
            {
              barrier: "Identity threat",
              title: "AI recommends. The rep decides.",
              decision: "The AI recommends but never selects. The rep makes every choice, and 'View all offers' is always one tap away.",
            },
            {
              barrier: "Cognitive load",
              title: "Keep the work in one guided flow",
              decision: "One guided flow replaces switching between systems, and steps the AI can complete arrive already filled in for review.",
            },
            {
              barrier: "Delayed reward",
              title: "Show the value immediately",
              decision: "Value shows up immediately: savings in the cart, and the new monthly bill next to the current one.",
            },
            {
              barrier: "Behavioral friction",
              title: "Make feedback part of the workflow",
              decision: "Thumbs up and down on every recommendation, so reps can give feedback within the workflow.",
            },
          ]}
        />
      </ContentSection>

      <Outcomes
        title="What the Design Enables"
        items={[
          { title: "One Entry Point", description: "A single canvas in place of separate apps for each task" },
          { title: "Channel-Native", description: "Tap-first in stores, type-first in customer service, one shared model" },
          { title: "Rep in Control", description: "AI recommends, the rep decides at every step" },
          { title: "Built to Learn", description: "Feedback controls built into the recommendation workflow" },
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
