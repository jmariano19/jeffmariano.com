import Image from "next/image";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { SitePage } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "About — Jeff Mariano",
  description:
    "I design AI-assisted systems around the five behavioral barriers that decide whether people keep using them.",
};

const paragraphs = [
  "I design AI-assisted systems around the five behavioral barriers that decide whether people keep using them: trust uncertainty, cognitive load, identity threat, delayed reward, and behavioral friction.",
  "Identity threat is the one teams miss. When a tool implies someone’s expertise is now optional, they find reasons not to use it — and none of those reasons are about the interface.",
  "At Verizon, I lead AI-powered retail experiences at Fortune 50 scale, including a multi-agent rep platform routing across 13 specialized agents. An AI-assisted platform I redesigned inside the POS, with conversational and agentic flows that help reps close sales and resolve problems, went from 2% adoption to voluntary daily use. I run a micro-experimentation framework there on a sandbox-first principle: earn the right to scale.",
  "In health, I’m building a WhatsApp-first AI platform for Spanish-speaking users, designed around a 14-day arc that ends in users owning their own patterns rather than depending on the system.",
  "The method is the same in both: design for the behavior, then let the system improve as people use it.",
];

export default function About() {
  return (
    <SitePage active="about">

        <main className="pt-16 md:pt-[90px] pb-28 md:pb-[260px] grid gap-10 lg:grid-cols-[minmax(0,498px)_minmax(0,1fr)] lg:gap-[76px] items-start">
          <Reveal onLoad delay={0.1} blur>
            <div className="relative w-full max-w-[498px] aspect-[498/710] rounded-[26px] overflow-hidden bg-[#e4e4e4]">
              <Image
                src="/images/about_portrait.jpg"
                alt="Jeffrey Mariano"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 498px"
                className="object-cover object-top"
              />
            </div>
          </Reveal>

          <div className="max-w-[805px]">
            <Reveal onLoad delay={0.2}>
              <h1 className="text-[36px] md:text-[56px] leading-[1.16] font-bold tracking-[-0.04em]">
                Adoption is the hard part.
                <br className="hidden md:block" /> Features ship; habits don&apos;t.
              </h1>
            </Reveal>
            <Reveal onLoad delay={0.32}>
              <div className="mt-5 max-w-[629px] text-[16px] md:text-[18px] leading-[1.95] tracking-[-0.01em] text-[#141414]">
                {paragraphs.map((text) => (
                  <p key={text.slice(0, 24)}>{text}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </main>
    </SitePage>
  );
}
