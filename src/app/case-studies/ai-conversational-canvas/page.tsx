import Image from "next/image";
import type { Metadata } from "next";
import { SitePage } from "@/components/SiteChrome";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CanvasLoop from "@/components/case-study/CanvasLoop";
import { Chapter, ChallengeOverview } from "@/components/case-study/Chapter";
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
import AnimatedEvidenceGraph from "@/components/case-study/AnimatedEvidenceGraph";

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

      <ChallengeOverview
        description="Every customer conversation sent reps across a different set of tools while the customer waited, and new AI features risked becoming one more tool to open. The goal: one place to work, for the rep on a store floor and the rep on a headset."
        stats={[
          { number: "1", label: "canvas in place of a stack of rep apps" },
          { number: "2", label: "channels: tap in stores, type in contact centers" },
          { number: "1", label: "approval instead of six manual steps" },
        ]}
        items={[
          { id: "where-it-started", n: "01", title: "Where it started", line: "The first AI tool reps avoided." },
          { id: "consolidate", n: "02", title: "One canvas", line: "Separate apps become one place to ask." },
          { id: "channels", n: "03", title: "Built for each channel", line: "Tap in stores, type in contact centers." },
          { id: "generative-ui", n: "04", title: "Generative UI", line: "The answer is an interface, not a paragraph." },
          { id: "agentic", n: "05", title: "Agentic workflows", line: "The agent does the work. The rep approves." },
        ]}
      />

      <Chapter
        id="where-it-started"
        n="01"
        kicker="Where it started · AI Advisor"
        title="The first AI tool reps avoided"
        takeaway="Verizon's first retail AI tool was powerful, but it interrupted the human rhythm of the sales conversation, so reps avoided it."
        body="We mapped live store conversations. The breakdowns weren't isolated bugs: they were loops, detours and confidence gaps that sent reps away from the customer to rebuild context by hand. Everything the canvas does starts from this."
      >
        <div className="overflow-hidden rounded-[22px] bg-white p-3 md:rounded-[32px] md:p-6">
          <Image
            src="/images/case-studies/ai_advisor/friction_map.png"
            alt="Friction map showing loops and detours in live retail conversations"
            width={1853}
            height={1043}
            sizes="(max-width: 1440px) 100vw, 1304px"
            className="h-auto w-full"
          />
        </div>
        <div className="mt-8 md:mt-12">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">What the map revealed</p>
          <p className="max-w-[30ch] text-[24px] font-bold leading-[1.2] tracking-[-0.03em] text-[#111] md:text-[30px]">
            96% of conversations hit at least one friction point before a decision.
          </p>
          <div className="mt-6">
            <AnimatedEvidenceGraph
              signals={[
                { label: "Support interruptions", value: 17, detail: "broke conversation momentum early" },
                { label: "Exploratory drift", value: 20, detail: "sent reps searching instead of deciding" },
                { label: "Decision complexity", value: 53, detail: "delayed confidence at key moments" },
                { label: "Any friction point", value: 96, detail: "appeared before a decision was reached" },
              ]}
            />
          </div>
        </div>
        <div className="mt-12 border-t border-[#d4d4d4] pt-10 md:mt-16 md:pt-14">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">The fix · from push to pull</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-4">
            <div className="rounded-[22px] bg-white p-6 md:rounded-[28px] md:p-8">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">Before · push</p>
              <p className="mt-3 text-[22px] font-bold leading-[1.2] tracking-[-0.025em] text-[#999] md:text-[26px]">The AI told the rep what was in the quote.</p>
              <p className="mt-2 text-[16px] leading-[1.55] text-[#777]">Eight recommendations landed in the cart at once, before the rep had built trust with the customer.</p>
            </div>
            <div className="rounded-[22px] bg-[#111] p-6 text-white md:rounded-[28px] md:p-8">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">After · pull</p>
              <p className="mt-3 text-[22px] font-bold leading-[1.2] tracking-[-0.025em] md:text-[26px]">The rep invites the AI in.</p>
              <p className="mt-2 text-[16px] leading-[1.55] text-white/70">Suggestions can be explored, ignored or changed. AI assists, the employee decides.</p>
            </div>
          </div>
          <Image
            src="/images/case-studies/ai_advisor/before_after.png"
            alt="Before and after: from a linear interface to AI suggestions the rep invites in"
            width={2010}
            height={1089}
            sizes="(max-width: 1440px) 100vw, 1304px"
            className="mt-4 h-auto w-full rounded-[22px] md:rounded-[28px]"
          />
        </div>
      </Chapter>

      <Chapter
        id="consolidate"
        n="02"
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
        n="03"
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
        n="04"
        kicker="Generative UI · the composition logic I designed"
        title="The AI builds the tool, not a reply"
        takeaway="Most AI tools answer with a paragraph. The canvas answers with an interface, composed for the request and the channel."
        body="For every request it reads the rep's intent, the customer's situation and the channel, then picks components from a shared library and arranges them. Insights explain the answer in a line, and AI recommendations are always marked. Try a request below."
      >
        <IntentComposer />
        <div className="mt-6 grid gap-4 rounded-[22px] bg-white p-6 md:mt-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-10 md:rounded-[28px] md:p-8">
          <p className="text-[52px] font-bold leading-none tracking-[-0.04em] text-[#111] md:text-[64px]">~200</p>
          <div>
            <p className="text-[19px] font-bold tracking-[-0.02em] text-[#111]">The AI UX framework behind it</p>
            <p className="mt-1 text-[16px] leading-[1.55] text-[#555]">
              Components, principles and patterns for AI in retail, built on the AI Advisor work: suggestion cards, override controls, contextual prompts and progressive detail. New AI features stopped needing a new interaction model every time.
            </p>
          </div>
        </div>
      </Chapter>

      <Chapter
        id="agentic"
        n="05"
        kicker="Agentic workflows"
        title="From answers to actions"
        takeaway="The agent carries out the work across systems. The rep stays with the customer and approves anything that touches the bill."
        body="Reps used to finish every answer by hand: build the quote, apply credits, place the order, write the notes. Now the rep says what needs to happen, the agent plans and runs the steps, and the notes are written when the call ends."
      >
        <AgentWorkflow />
      </Chapter>

      <Chapter
        id="adoption"
        n="06"
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
        <div className="mt-6 rounded-[22px] bg-[#111] p-6 text-white md:mt-8 md:rounded-[28px] md:p-8">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">Proven in stores</p>
          <p className="mt-3 max-w-[60ch] text-[17px] leading-[1.6] text-white/85 md:text-[19px]">
            A tiger team of designers wrote React components, shipped micro-flows to selected stores, and I went to those stores to watch. Each solution had to earn its place through three signals: engagement, efficiency and less friction.
          </p>
        </div>
      </Chapter>

      <Outcomes
        title="Results from the first AI tool"
        items={[
          { title: "Voluntary Adoption", description: "Reps chose to use the AI features" },
          { title: "Faster Interactions", description: "Bill optimization time dropped significantly" },
          { title: "Framework Standard", description: "Adopted across the retail AI system" },
          { title: "Sentiment Shift", description: 'From "worst product" to actively requested' },
        ]}
      />

      <Quotes
        quotes={[
          {
            text: "I feel that the Verizon team is finally understanding us and the way we work.",
            author: "Retail representative",
          },
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
            company: "Side project",
            title: "A Boy Built From Your Own Words",
            image: "/images/home/eli-card-bg.webp",
            href: "/case-studies/eli-last-experiment",
          },
          {
            company: "Verizon",
            title: "From 7 Inconsistent Screens to One Scalable Retail Design System",
            image: "/images/case-verizon-ecosystem.png",
            href: "/case-studies/retail-design-system",
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
