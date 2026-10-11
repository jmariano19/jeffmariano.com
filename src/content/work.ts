// Single source for project content shown on the homepage and /projects.

export interface CaseStudy {
  title: string;
  company: string;
  tag: string;
  result: string;
  image: string;
  href: string;
}

export interface Contribution {
  work: string;
  contribution: string;
  context: string;
}

export const caseStudies: CaseStudy[] = [
  {
    title: "The AI Was Smart. The UX Was Wrong.",
    company: "Verizon",
    tag: "Retail AI",
    result:
      "Redesigned an AI-powered retail point-of-sale tool from 2% adoption to voluntary daily use by solving the trust and behavior problems the technology couldn't fix on its own.",
    image: "/images/case-verizon-ai.png",
    href: "/case-studies/verizon-ai",
  },
  {
    title: "63 Million People Ignored by Digital Health",
    company: "ViveBien",
    tag: "Health AI",
    result:
      "Designing a WhatsApp-first AI health platform for the Hispanic community, in active beta with real users.",
    image: "/images/case-vivebien.png",
    href: "/case-studies/vivebien",
  },
  {
    title: "Scaling a Retail Design System Across 15+ Teams",
    company: "Verizon",
    tag: "Design systems",
    result:
      "Built the operating model, reusable patterns, and cross-continent design workflow for a Fortune 50 retail ecosystem.",
    image: "/images/case-verizon-ecosystem.png",
    href: "/case-studies/verizon-design-systems",
  },
  {
    title: "Rebranding a 20 Million-Family App Without Breaking Trust",
    company: "Tinybeans",
    tag: "Brand",
    result:
      "Led the full rebrand across strategy, design system, and rollout, raising conversion 5.5% and app store downloads 3.5%.",
    image: "/images/case-tinybeans.jpg",
    href: "/case-studies/tinybeans",
  },
];

export const contributions: Contribution[] = [
  {
    work: "Cortex",
    contribution:
      "An AI platform that unifies every assisted customer service channel, so service teams work from one experience instead of many.",
    context: "Customer service",
  },
  {
    work: "Micro-experimentation framework",
    contribution:
      "Introduced a sandbox-first way to test AI ideas in real conditions and scale only what earns it.",
    context: "Verizon",
  },
  {
    work: "MCP UI server",
    contribution:
      "An MCP server that returns interface components to LLMs, so answers arrive as usable UI instead of text.",
    context: "Side project",
  },
  {
    work: "Eli's Last Experiment",
    contribution:
      "A mobile narrative game built with Rive and an LLM backend, where the character is shaped by what the player shares.",
    context: "Side project",
  },
];

export const experience = [
  "Verizon",
  "ViveBien Health Technologies",
  "Tinybeans / Red Tricycle",
  "New York Daily News / U.S. News & World Report",
  "Quidsi / Amazon",
  "Shutterfly",
  "Etag Technologies",
];

export const contactHref =
  "mailto:jmariano19@gmail.com?subject=Intro%20call";
