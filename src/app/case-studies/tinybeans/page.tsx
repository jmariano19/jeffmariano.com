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
  title: "Tinybeans — Jeff Mariano",
  description:
    "Led the full rebrand of Tinybeans — strategy, design system, and execution across every touchpoint for a 20 million-family app.",
};

export default function Tinybeans() {
  return (
    <div className="min-h-screen bg-cream max-w-[1440px] mx-auto">
      <Nav />

      <CaseStudyHero
        tag="BRAND DESIGN · DESIGN SYSTEMS · ART DIRECTION"
        title="Rebranding a 20 Million-Family App Without Breaking Trust"
        meta="Role: Art Director | Scope: Full rebrand — app, web, social, email, app store | Company: Tinybeans"
        image="/images/case-studies/1.tb_top.png"
      />

      <Challenges
        stats={[
          { number: "20M", label: "Families trusting the product" },
          { number: "5.5%", label: "Increase in website conversion rate" },
          { number: "3.5%", label: "Increase in app store downloads" },
        ]}
        description="In 2018, Tinybeans hired me as Art Director to rebrand the company. The product was a family milestone app — parents documenting their children's moments, sharing with grandparents, building a private family archive. Twenty million families trusted it with their most personal content. The challenge wasn't making Tinybeans look better. It was making it feel modern without breaking the trust that made people share their family's life there in the first place."
      />

      <ContentSection
        title="Start With the User, Not the Brand"
        tag="KEY DECISION"
        description="The instinct in a rebrand is to start with the logo, the colors, the typography — the brand artifacts. I started somewhere else: understanding the demographic and psychographic profile of our users. Millennial moms. What inspires them. What delights them. What makes them trust a product with photos of their kids."
        explanation="This research shaped everything that followed. By understanding the market attributes first, we shaped the brand personality, product strategies, and marketing efforts around what these users actually find valuable and trusting — not what looked good in a mood board."
        image="/images/case-studies/2.tb_second.png"
      />

      <ContentSection
        title="Build a System, Not Just a Look"
        tag="HOW I SCALED IT"
        description="A rebrand that produces beautiful one-off designs is a rebrand that dies in six months. I built a complete design system — style guide, photo guidelines, typographic system, and a media library where every team could access the new assets."
        explanation="Illustrations, banner ads, icons, photos, typography — all governed by a system designed for easy sharing and collaboration. This meant any team could produce on-brand work without running everything through me. The system scaled the rebrand beyond what any single art director could manually control."
        beforeAfter={{
          before:
            "Visual identity felt dated and inconsistent. No unified design system. App, website, social, and email felt like disconnected products.",
          after:
            "Cohesive brand across every touchpoint. Any team can produce on-brand work from the system. No bottleneck.",
        }}
        image="/images/case-studies/3.tb.png"
        imageFit="contain"
      />

      <ContentSection
        title="Design for Every Touchpoint Simultaneously"
        tag="THE EXECUTION"
        description="Most rebrands roll out in phases — app first, then website, then marketing. I designed across all channels at once: the app experience, branded landing pages, social media templates, email templates, app store screenshots, content websites, and promotional campaigns."
        explanation="The WordPress content site was a key touchpoint. I partnered with the editorial team to create a content experience with dynamic layout options that was easy to navigate — because for millennial parents, the content (parenting guides, milestone tracking) was often the entry point to the product."
        image="/images/case-studies/4.tb.png"
      />

      <Outcomes
        items={[
          {
            title: "5.5% Conversion Lift",
            description: "Website conversion rate increase post-rebrand",
          },
          {
            title: "3.5% Downloads Up",
            description: "App store downloads increase",
          },
          {
            title: "2.3% Social CR",
            description: "Conversion rate on social media campaigns",
          },
          {
            title: "One Brand",
            description: "Cohesive experience across app, web, social, email, and app store — for the first time",
          },
        ]}
      />

      <Quotes
        quotes={[
          {
            text: "Millennial moms could move from an Instagram ad to the website to the app and feel like they were in the same place — a place designed for them.",
            author: null,
          },
          {
            text: "A rebrand isn't a design project — it's a systems project. Build the system first. The beauty follows.",
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
            company: "ViveBien",
            title: "63 Million People Ignored by Digital Health",
            image: "/images/case-vivebien.png",
            href: "/case-studies/vivebien",
          },
        ]}
      />

      <Footer />
    </div>
  );
}
