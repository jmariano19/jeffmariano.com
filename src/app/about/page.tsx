import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Image from "next/image";
import FadeUp from "@/components/FadeUp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Jeff Mariano",
  description:
    "Designer, technologist, and founder. I design systems that learn — modular frameworks, experimentation loops, and AI-assisted experiences.",
};

export default function About() {
  return (
    <div className="min-h-screen bg-cream max-w-[1440px] mx-auto">
      <Nav />

      {/* Hero — portrait + intro */}
      <section className="px-4 md:px-24 pt-12 pb-0">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">

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

          {/* Intro text */}
          <div className="flex-1 pt-0 md:pt-6">
            <FadeUp>
              <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[36px] md:text-[45px] leading-[1.1] text-green-heading mb-6 md:mb-8">
                Designing Systems That Learn
              </h1>
            </FadeUp>

            <FadeUp>
              <div className="font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[35px] text-[#606060] space-y-0">
                <p>
                  Most modern products are no longer static interfaces — they are evolving
                  systems shaped by human behavior.
                </p>
                <p>
                  My work focuses on designing environments where signals of value can
                  emerge. By observing real behavior, products, AI systems, and human
                  workflows can continuously adapt and improve.
                </p>
                <p>
                  I specialize in{" "}
                  <span className="font-bold">designing modular systems</span>,{" "}
                  <span className="font-bold">experimentation frameworks</span>, and
                  AI-assisted experiences that allow products to evolve through real-world use.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Section 2 — Archetypes */}
      <section className="px-4 md:px-24 pt-[80px] pb-24">
        <div className="md:ml-[calc(400px+4rem)] lg:ml-[calc(465px+4rem)]">
          <FadeUp>
            <p className="font-[family-name:var(--font-roboto)] font-bold text-[18px] md:text-[20px] leading-[45px] text-[#606060] mb-3">
              Designing AI for Human Archetypes
            </p>
          </FadeUp>

          <div className="w-full h-px bg-[#606060] opacity-20 mb-2" />

          <FadeUp>
            <div className="font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[35px] text-[#606060] mt-6 space-y-6">
              <p>
                As AI becomes part of everyday workflows, designing the interface alone
                is not enough. Different people relate to intelligent systems in different
                ways — as advisors, tools, guides, or mirrors.
              </p>
              <p>
                When designing AI-assisted products, I often consider these human
                archetypes to ensure the system adapts to different mental models and
                decision styles.
              </p>
              <p>
                Recognizing these patterns helps create AI experiences that feel natural,
                trustworthy, and aligned with how people actually think.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
