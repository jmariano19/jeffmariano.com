import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Image from "next/image";
import FadeUp from "@/components/FadeUp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Jeff Mariano",
  description:
    "I design AI-assisted systems that evolve through real-world human behavior, focusing on trust, adoption, and everyday workflows.",
};

export default function About() {
  return (
    <div className="about-page min-h-screen bg-cream max-w-[1440px] mx-auto md:h-screen md:flex md:flex-col md:overflow-hidden">
      <Nav />

      {/* Hero — portrait + intro */}
      <main className="px-4 md:px-24 pt-12 pb-24 md:flex-1 md:min-h-0 md:pb-12 md:overflow-hidden">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start md:h-full">

          {/* Portrait */}
          <FadeUp className="w-full md:w-[400px] lg:w-[465px] flex-shrink-0">
            <div className="relative w-full h-[420px] md:h-[514px] rounded-[25px] overflow-hidden">
              <Image
                src="/images/about_portrait.jpg"
                alt="Jeff Mariano"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </FadeUp>

          {/* Right column — intro text + archetypes */}
          <div className="about-scroll-pane flex-1 min-w-0 pt-0 md:pt-6 md:h-full md:overflow-y-auto md:pr-4">
            <FadeUp delay={0.2}>
              <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[33px] md:text-[45px] leading-[40px] md:leading-[52px] text-green-heading mb-6 md:mb-8">
                Designing Systems That Learn
              </h1>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[35px] text-[#606060] space-y-5">
                <p>
                  Most products no longer fail because of missing features. They fail
                  because people never fully adopt them.
                </p>
                <p>
                  I design AI-assisted systems that evolve through real-world human behavior
                  — focusing on how people trust, resist, adapt to, and integrate intelligent
                  systems into everyday workflows.
                </p>
                <p>
                  At Verizon, I&apos;ve led AI-powered retail experiences used at Fortune 50
                  scale, helping transform fragmented tools into systems people voluntarily
                  use daily.
                </p>
                <p>
                  My work combines behavioral design, systems thinking, experimentation
                  frameworks, and AI-assisted product development to create products that
                  improve through real-world use.
                </p>
              </div>
            </FadeUp>

            {/* Archetypes — 80px below intro text */}
            <div className="mt-[80px]">
              <FadeUp>
                <p className="font-[family-name:var(--font-roboto)] font-bold text-[18px] md:text-[20px] leading-[45px] text-[#606060] mb-3">
                  Designing AI for Human Behavior
                </p>
              </FadeUp>

              <div className="w-full h-px bg-[#606060] opacity-20 mb-2" />

              <FadeUp>
                <div className="font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[35px] text-[#606060] mt-6 space-y-6">
                  <p>
                    As AI becomes part of everyday work, designing the interface alone is no
                    longer enough.
                  </p>
                  <p>
                    Different people interact with intelligent systems in fundamentally
                    different ways — some seek guidance, some seek control, and others resist
                    automation altogether.
                  </p>
                  <p>
                    My work focuses on identifying the behavioral patterns that shape
                    adoption:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>trust,</li>
                    <li>cognitive load,</li>
                    <li>identity threat,</li>
                    <li>perceived usefulness,</li>
                    <li>and emotional resistance to AI systems.</li>
                  </ul>
                  <p>
                    By designing around these human dynamics, AI products become more
                    natural, trustworthy, and operationally effective in practice — not just
                    in demos.
                  </p>
                </div>
              </FadeUp>
            </div>

            <div className="mt-20">
              <Footer />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
