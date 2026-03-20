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
  title: "ViveBien — Jeff Mariano",
  description:
    "Designing a WhatsApp-based health product for the Hispanic community — from the inside.",
};

export default function ViveBien() {
  return (
    <div className="min-h-screen bg-cream max-w-[1440px] mx-auto">
      <Nav />

      <CaseStudyHero
        tag="HEALTH TECH · AI PRODUCT DESIGN · FOUNDER"
        title="63 Million People Ignored by Digital Health"
        meta="Role: Founder & Designer | Research: 10 cultural interviews + 11,000 community comments | Product: WhatsApp-native AI"
        image="/images/case-studies/1.community.png"
      />

      <Challenges
        stats={[
          { number: "63M", label: "Hispanic people underserved by digital health" },
          { number: "80%+", label: "Use WhatsApp as primary communication tool" },
          { number: "11K", label: "Community comments analyzed ethnographically" },
        ]}
        description="There are over 63 million Hispanic people in the United States. Digital health adoption in this community lags significantly behind the general population. Every major health app has a Spanish language option. And almost none of them work — because translation is not design. You can translate every word perfectly and still build something that violates how this community communicates, builds trust, and makes health decisions. Plato Inteligente is my answer to that — designed from the inside, by someone from this community, for the people I grew up with."
      />

      <ContentSection
        title="What Every Digital Health Product Gets Wrong"
        tag="THE CORE INSIGHT"
        description="Three things are failing simultaneously, and fixing just one doesn't help. Language isn't enough — apps translate to Spanish but don't understand the cultural context. Trust works differently — it's built through relationship and consistency, not credentials and privacy policies. And the delivery model is wrong — designing for WhatsApp means designing for conversation, not interfaces."
        beforeAfter={{
          before:
            "Apps translate to Spanish. Assume individual smartphone user. Build trust through clinical credentials.",
          after:
            "Design for cultural context. WhatsApp as infrastructure. Build trust by showing value before asking for anything.",
        }}
        image="/images/case-studies/2.experience_map.png"
        imageFit="contain"
      />

      <ContentSection
        title="Value Before Effort"
        tag="THE DESIGN PRINCIPLE"
        description="The community I'm designing for is especially skeptical of products that ask for effort upfront — onboarding flows, data entry, tracking habits — before delivering any value. They've been burned before. So the product must give something useful first."
        explanation="This principle drives every design decision in Plato Inteligente. The first interaction isn't an onboarding form. It's the product showing you something about yourself you hadn't articulated. Once someone feels understood, they'll invest their trust."
        image="/images/case-studies/3.conversation.png"
        imageFit="contain"
      />

      <ContentSection
        title="Archetype-Based Retention"
        tag="THE 14-DAY FRAMEWORK"
        description="Not everyone is in the same place. I designed a 14-day retention framework built around three behavioral readiness archetypes — each experiencing the arc differently, all moving toward the same destination: Pride of Discovery."
        explanation="The Optimizer wants structure — clear progress, measurable signals, concrete insights. The Caregiver responds to emotional tone — they're managing health for others and need the system to acknowledge that. The Navigator wants useful, non-repetitive information — they get frustrated by redundancy and respond to fresh daily insights."
        explanation2="Pride of Discovery is the moment when a user sees something about themselves they didn't see before — and it clicks. That's when the product earns the right to keep going."
        image="/images/case-studies/5.metho.png"
        imageFit="contain"
      />

      <Outcomes
        items={[
          {
            title: "Live Experiments",
            description: "Behavioral testing with real users on WhatsApp — not lab simulations",
          },
          {
            title: "Strong Early Signal",
            description: "User called to say they love the system and feel genuinely understood",
          },
          {
            title: "Archetype Framework",
            description: "14-day retention loop built for cultural fit, not generic engagement",
          },
          {
            title: "Methodology Transfer",
            description: "Value-before-effort and live signal loops applicable to any underserved community",
          },
        ]}
      />

      <Quotes
        quotes={[
          {
            text: "Now I know why I feel this way.",
            author: "Plato Inteligente user",
          },
          {
            text: "Designing for underserved communities isn't about translation. It's about redesigning every assumption — delivery model, trust mechanics, engagement patterns, success metrics — from the user's cultural reality.",
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
            company: "Verizon",
            title: "The AI Was Smart. The UX Was Wrong.",
            image: "/images/case-verizon-ai.png",
            href: "/case-studies/verizon-ai",
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
