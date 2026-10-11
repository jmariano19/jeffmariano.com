import type { Metadata } from "next";
import SiteHeader from "@/components/v2/SiteHeader";
import SiteFooter from "@/components/v2/SiteFooter";
import ProjectCard from "@/components/v2/ProjectCard";
import ContributionTable from "@/components/v2/ContributionTable";
import SectionLabel from "@/components/v2/SectionLabel";
import FadeUp from "@/components/FadeUp";
import { caseStudies } from "@/content/work";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work across AI adoption, customer service, health, and design systems.",
};

export default function Projects() {
  return (
    <div className="min-h-screen bg-paper text-ink font-[family-name:var(--font-roboto)]">
      <div className="max-w-[1440px] mx-auto">
        <SiteHeader />

        <section className="px-5 md:px-10 pt-20 md:pt-28 pb-14 md:pb-20">
          <FadeUp>
            <h1 className="text-[56px] md:text-[96px] leading-none font-bold tracking-[-0.03em]">Projects</h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-6 text-[16px] md:text-[18px] leading-relaxed text-ink-muted max-w-[520px]">
              Selected work across AI adoption, customer service, health, and design systems. Each one
              shows how I turn complex systems into tools people choose to use.
            </p>
          </FadeUp>
        </section>

        <section className="px-5 md:px-10 pb-24 md:pb-32">
          <div className="flex flex-col gap-16 md:gap-24">
            {caseStudies.map((study, i) => (
              <ProjectCard key={study.href} study={study} priority={i === 0} />
            ))}
          </div>
        </section>

        <section className="px-5 md:px-10 pb-24 md:pb-32">
          <SectionLabel>Beyond the case studies</SectionLabel>
          <p className="mb-10 text-[16px] leading-relaxed text-ink-muted max-w-[620px]">
            Not every contribution becomes a full case study. These are products, systems, and
            experiments I&apos;ve shaped across customer service, AI tooling, and my own work.
          </p>
          <ContributionTable />
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
