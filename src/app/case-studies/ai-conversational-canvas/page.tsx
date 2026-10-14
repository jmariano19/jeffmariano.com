import Image from "next/image";
import type { Metadata } from "next";
import { SitePage } from "@/components/SiteChrome";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CanvasLoop from "@/components/case-study/CanvasLoop";
import Challenges from "@/components/case-study/Challenges";
import { Chapter, StoryMap } from "@/components/case-study/Chapter";
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
import { AgentWorkflow } from "@/components/case-study/AgentWorkflow";

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
        summary="Reps juggled a stack of separate apps to help one customer. I led the design of one AI canvas that replaces them: it builds the right interface for each request, adapts to the channel, and lets an agent do the follow-through while the rep stays in control."
        meta="Role: Associate Director, UX · owner of the agent interaction model | Channels: Retail stores · Contact centers | Platform: AI canvas with generative UI"
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
          { number: "1", label: "canvas in place of a stack of separate rep apps" },
          { number: "2", label: "channels served: tap in stores, type in contact centers" },
          { number: "1", label: "approval instead of six manual steps for an upgrade" },
        ]}
        description="Every customer conversation sent reps across a different set of tools, and each switch cost time while the customer waited. New AI features risked becoming one more tool to open. The goal was to replace the stack with one place to work that fits both the rep on a store floor and the rep on a headset."
      />

      <StoryMap
        items={[
          { id: "consolidate", n: "01", title: "One canvas", line: "A stack of separate apps becomes one place to ask." },
          { id: "channels", n: "02", title: "Built for each channel", line: "Tap-first in stores, type-first in contact centers." },
          { id: "generative-ui", n: "03", title: "Generative UI", line: "The answer is an interface, composed for the intent." },
          { id: "agentic", n: "04", title: "Agentic workflows", line: "The agent does the follow-through. The rep approves." },
        ]}
      />

      <Chapter
        id="consolidate"
        n="01"
        kicker="The consolidation"
        title="From a stack of apps to one canvas"
        takeaway="Reps stopped hunting for the right app. They ask once, and the canvas brings the tool to them."
        body="Instead of a home screen of app icons, the canvas opens with one question: how can I help you today? The rep taps a suggested action or asks in their own words, and the canvas pulls in the customer's context and assembles the tool for that task."
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
      </Chapter>

      <Chapter
        id="channels"
        n="02"
        kicker="Research-led adaptation"
        title="Same canvas, different channel"
        takeaway="Research showed store reps and contact center reps work in opposite ways, so the canvas changes how it's driven, not what it is."
        body="In a store, the rep stands beside the customer with a tablet, often sharing the screen. In a contact center, the rep is on a headset or in chat, typing fast across several windows. Both use the same model and components."
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
              name: "Contact centers",
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
      </Chapter>

      <Chapter
        id="generative-ui"
        n="03"
        kicker="Generative UI · the composition logic I designed"
        title="The AI builds the tool, not a reply"
        takeaway="Most AI tools answer with a paragraph. The canvas answers with an interface, composed for the request and the channel."
        body="For every request it reads the rep's intent, the customer's situation and the channel, then picks components from a shared library and arranges them. Insights explain the answer in a line, and AI recommendations are always marked. Try a request below."
      >
        <IntentComposer />
      </Chapter>

      <Chapter
        id="agentic"
        n="04"
        kicker="Agentic workflows"
        title="From answers to actions"
        takeaway="The agent carries out the work across systems. The rep stays with the customer and approves anything that touches the bill."
        body="Reps used to finish every answer by hand: build the quote, apply credits, place the order, write the notes. Now the rep says what needs to happen, the agent plans and runs the steps, and the notes are written when the call ends."
      >
        <AgentWorkflow />
      </Chapter>

      <Chapter
        id="adoption"
        n="05"
        kicker="Key design decisions"
        title="Designed around the barriers to adoption"
        takeaway="A capable AI tool still fails if reps don't trust it. Each decision answers one of the five behavioral barriers I design around."
      >
        <BarrierDecisions
          items={[
            {
              barrier: "Trust uncertainty",
              decision: "AI output is always marked with the sparkle and gradient, so reps can tell a suggestion from account data at a glance.",
            },
            {
              barrier: "Identity threat",
              decision: "The AI recommends and the agent proposes, but the rep makes every call that matters, and every option stays one tap away.",
            },
            {
              barrier: "Cognitive load",
              decision: "One canvas replaces switching between systems, and steps the AI can complete arrive already filled in for review.",
            },
            {
              barrier: "Delayed reward",
              decision: "Value shows up immediately: a one-line insight with the answer, and savings next to the current bill.",
            },
            {
              barrier: "Behavioral friction",
              decision: "The agent writes the notes and follow-ups, and feedback on every recommendation takes a single tap.",
            },
          ]}
        />
      </Chapter>

      <Outcomes
        items={[
          { title: "One Entry Point", description: "A single canvas in place of separate apps for each task" },
          { title: "Channel-Native", description: "Tap-first in stores, type-first in contact centers, one shared model" },
          { title: "Answers as Interfaces", description: "Generative UI composed for each intent and channel" },
          { title: "Rep in Control", description: "The agent does the work, the rep approves what matters" },
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
