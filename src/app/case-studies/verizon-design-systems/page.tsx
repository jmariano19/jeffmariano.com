import Image from "next/image";
import type { Metadata } from "next";
import { SitePage } from "@/components/SiteChrome";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import { Chapter, ChallengeOverview } from "@/components/case-study/Chapter";
import Outcomes from "@/components/case-study/Outcomes";
import Quotes from "@/components/case-study/Quotes";
import NextCaseStudies from "@/components/case-study/NextCaseStudies";

export const metadata: Metadata = {
  title: "Verizon Design Systems — Jeff Mariano",
  description:
    "A design systems case study on scaling reusable patterns, governance, and cross-functional delivery across a Fortune 50 retail ecosystem.",
};

/** A full-width illustration in the same rounded frame the other case studies use. */
function Figure({ src, alt, ratio, bg = "bg-[#e5e1d6]" }: { src: string; alt: string; ratio: string; bg?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[22px] md:rounded-[36px] ${bg}`} style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes="(max-width: 1440px) 100vw, 1304px" className="object-cover" />
    </div>
  );
}

export default function VerizonDesignSystems() {
  return (
    <SitePage>
      <CaseStudyHero
        tag="VERIZON · DESIGN SYSTEMS · RETAIL"
        title="Scaling a Retail Design System Across 15+ Teams"
        summary="Store reps worked on kiosks and tablets the enterprise design system was never built for, and every team rebuilt the same buttons its own way. I led nine designers across the US and India to build a retail theme on top of the enterprise system, and to get teams to adopt it by choice."
        meta="Role: Team leader, retail design system | Team: 9 designers · US + India | Scope: 15+ teams · 5–10 retail products"
        image="/images/case-studies/Design Systems-verizon.png"
      />

      <ChallengeOverview
        description="Retail is a different world from the enterprise apps: touch kiosks, tablets and busy store floors. Teams built the same buttons and navigation in different ways, and some leaders believed it was too fragmented to unify. I set out to prove otherwise by showing, not arguing."
        stats={[
          { number: "15+", label: "teams with no shared retail system" },
          { number: "7", label: "core screens designed inconsistently" },
          { number: "2", label: "continents duplicating the same work" },
        ]}
        items={[
          { id: "cards", n: "01", title: "A deck of cards", line: "A retail theme on the enterprise system." },
          { id: "scale", n: "02", title: "Earning the right to scale", line: "Easy screens first, built with the roadmap." },
          { id: "team", n: "03", title: "One team, two continents", line: "Pods by domain, not by geography." },
          { id: "sandbox", n: "04", title: "Prove it in the store", line: "Test in real stores before it joins the system." },
        ]}
      />

      <Chapter
        id="cards"
        n="01"
        kicker="System strategy"
        title="A deck of cards for every conversation"
        takeaway="Reps pick the card that fits the conversation. Every card is built from the same retail components."
        body="The enterprise system couldn't simply shrink to fit a kiosk. So I added a retail theme layer on top of it: React components with retail themes that adapt to each screen size and orientation, shipped as micro front-ends so each team could move on its own."
      >
        <Figure src="/images/card.png" alt="Lego-like components plus a card container make the front-end cards reps use in store" ratio="1340 / 606" />
      </Chapter>

      <Chapter
        id="scale"
        n="02"
        kicker="Adoption strategy"
        title="Earning the right to scale"
        takeaway="I started with the easiest, most visible screens, and built roadmap features with the system instead of beside it."
      >
        <Figure src="/images/retail.png" alt="A store floor map showing where the system's screens appear across the store" ratio="1342 / 607" />
      </Chapter>

      <Chapter
        id="team"
        n="03"
        kicker="Operating model"
        title="One team across two continents"
        takeaway="Domain pods for sales, unity and service, each with a US lead and an India lead. Work assigned by priority, not geography."
      >
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          <div className="rounded-[22px] bg-white p-6 md:rounded-[28px] md:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#999]">Before</p>
            <p className="mt-3 text-[22px] font-bold leading-[1.2] tracking-[-0.025em] text-[#999] md:text-[26px]">US designed, India executed.</p>
            <p className="mt-2 text-[16px] leading-[1.55] text-[#777]">Duplicated work, miscommunication, no clear owner.</p>
          </div>
          <div className="rounded-[22px] bg-[#111] p-6 text-white md:rounded-[28px] md:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">After</p>
            <p className="mt-3 text-[22px] font-bold leading-[1.2] tracking-[-0.025em] md:text-[26px]">One team, shared ownership.</p>
            <p className="mt-2 text-[16px] leading-[1.55] text-white/70">Integrated workflows, weekly lead syncs, and the India team as co-creators.</p>
          </div>
        </div>
      </Chapter>

      <Chapter
        id="sandbox"
        n="04"
        kicker="Governance"
        title="Prove it in the store first"
        takeaway="New patterns ship as small micro-flows, get watched in real stores, and only then join the system."
        body="Bill optimization was the first sandbox. For adoption I skipped both mandates and pure grassroots: my team first, then PMs, then senior leadership. By the time I presented up, everyone already knew."
      >
        <Figure src="/images/Experimental sandbox.png" alt="A rep helping a customer at a Verizon store counter" ratio="1340 / 606" bg="bg-[#ddd]" />
      </Chapter>

      <Outcomes
        items={[
          { title: "Promoted to AD", description: "On the strength of this work" },
          { title: "VP Design Award", description: "Company-wide recognition" },
          { title: "Voluntary adoption", description: "Small Biz adopted it without being asked" },
          { title: "PM method shift", description: "Product moved to modular delivery" },
        ]}
      />

      <Quotes
        quotes={[
          {
            text: "I am very impressed with your work, Jeff.",
            author: "Senior Director of Retail Innovation",
          },
          {
            text: "Design systems fail when they're treated as infrastructure projects. They succeed when they're treated as adoption problems.",
            author: null,
            lines: true,
          },
        ]}
      />

      <NextCaseStudies
        studies={[
          {
            company: "Verizon",
            title: "One AI Canvas for Every Way Reps Help Customers",
            image: "/images/case-studies/canvas/hero-bg.webp",
            href: "/case-studies/ai-conversational-canvas",
          },
          {
            company: "Verizon",
            title: "The AI Was Smart. The UX Was Wrong.",
            image: "/images/case-verizon-ai.png",
            href: "/case-studies/verizon-ai",
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
