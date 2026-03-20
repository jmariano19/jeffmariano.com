import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import Challenges from "@/components/case-study/Challenges";
import ContentSection from "@/components/case-study/ContentSection";
import Outcomes from "@/components/case-study/Outcomes";
import Quotes from "@/components/case-study/Quotes";
import NextCaseStudies from "@/components/case-study/NextCaseStudies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verizon Design Systems — Jeff Mariano",
  description:
    "From 7 inconsistent screens to one scalable retail design system at a Fortune 50 telecom company.",
};

export default function VerizonDesignSystems() {
  return (
    <div className="min-h-screen bg-cream max-w-[1440px] mx-auto">
      <Nav />

      <CaseStudyHero
        tag="DESIGN SYSTEMS · FORTUNE 50 TELECOM"
        title="From 7 Inconsistent Screens to One Scalable Retail Design System"
        meta="Role: Lead Designer → Associate Director | Team: 9 designers (US + India) | Scope: 15+ teams, 5-10 products"
        image="/images/case-verizon-ecosystem.png"
      />

      <Challenges
        stats={[
          { number: "7", label: "Screens with inconsistent designs" },
          { number: "15+", label: "Teams with no shared system" },
          { number: "2", label: "Continents, duplicating work" },
        ]}
        description="A Fortune 50 telecom company had a retail design problem that nobody had been able to solve. The enterprise design system existed, but retail was a fundamentally different environment: different screen resolutions, different usage behaviors, touch-based kiosks in busy stores. The fragmentation was visible everywhere — same buttons built differently by different teams, same navigation patterns with different implementations. Some stakeholders believed the fragmentation was too deep to unify. I needed to prove them wrong — but not by arguing. By showing."
      />

      <ContentSection
        title="Key Decisions"
        subtitle="The Deck of Cards"
        tag="WHAT I BUILT"
        description="A modular system where &quot;cards&quot; are containers for content. Representatives choose which card to use depending on the conversation. Everything powered by a scalable retail design system that adapts to kiosk sizes and screen orientations."
        explanation="The enterprise system couldn't simply scale down to retail. Instead of forcing adaptation, I created a theme layer — purpose-built for retail, drawing from the enterprise system. React components with retail themes. Micro front-ends for team independence."
        image="/images/card.png"
      />

      <ContentSection
        title="Earning the Right to Scale"
        tag="WHY THIS APPROACH"
        description="Started with the easiest screens — low risk, high visibility. Aligned system work with the product roadmap. Built priority features WITH the system, not separately."
        image="/images/retail.png"
      />

      <ContentSection
        title="Reorganizing Across Continents"
        tag="WHAT I CHANGED"
        description="Reorganized into domain pods — sales, unity, service. Each pod had a US lead and India lead. Work assigned by priority, not geography. Weekly lead syncs."
        beforeAfter={{
          before:
            "US designed, India executed. Duplication, miscommunication, no ownership.",
          after:
            "Shared ownership, integrated workflows, India team as co-creators, not executors.",
        }}
      />

      <ContentSection
        title="The Experimental Sandbox"
        tag="WHY IT WORKED"
        description="A structured process for validating design solutions before they become part of the official system. Not just prototyping — a cross-team coordination process involving business partners, product, research, and development."
        explanation="Bill optimization was our first sandbox project. We deployed it as a micro-flow, observed it in actual stores, and used those signals to determine what earned the right to scale."
        explanation2="Rejected both top-down mandates (teams resist) and pure grassroots (too slow). Orchestrated adoption: internal team first, then PMs, then senior leadership. By the time I presented up, everyone already knew."
        image="/images/Experimental sandbox.png"
      />

      <Outcomes
        items={[
          {
            title: "Promoted to AD",
            description: "On the strength of this work",
          },
          {
            title: "VP Design Award",
            description: "Company-wide recognition",
          },
          {
            title: "Voluntary Adoption",
            description: "Small Biz team adopted without being asked",
          },
          {
            title: "PM Method Shift",
            description: "Adopted modular delivery approach",
          },
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
