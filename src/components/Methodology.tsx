"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeUp from "./FadeUp";
import GrowLine from "./GrowLine";

const steps = [
  {
    number: 1,
    title: "What to Solve",
    description: "Research and observation reveal the real problem worth solving.",
    image: "/images/method-3.png",
  },
  {
    number: 2,
    title: "Micro Experiment",
    description: "Start small. Test ideas in real conditions.",
    image: "/images/method-2.png",
  },
  {
    number: 3,
    title: "Signal of Value",
    description: "Look for behavioral signals, not opinions.",
    image: "/images/method-1.png",
  },
  {
    number: 4,
    title: "Earn the Right to Scale",
    description: "Only scale what proves real value.",
    image: "/images/method-4.png",
  },
];

export default function Methodology() {
  return (
    <section className="px-8 md:px-28 py-12 md:py-20">
      <FadeUp>
        <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[30px] md:text-[45px] leading-[36px] md:leading-[45px] text-green-heading mb-4">
          My methodology
        </h2>
      </FadeUp>
      <FadeUp delay={0.15}>
        <p className="font-[family-name:var(--font-roboto)] text-base md:text-[19px] leading-[26px] md:leading-[30px] text-black max-w-[891px] mb-8 md:mb-12">
          Meaningful experiences rarely begin with perfect clarity. I focus on
          putting ideas in front of real people early and letting solutions evolve
          by capturing real signals of value. Innovation happens when we&apos;re
          comfortable working with nuance, uncertainty, and incomplete information.
        </p>
      </FadeUp>

      {/* Steps grid — staggered reveal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
        {steps.map((step, i) => (
          <FadeUp key={step.number} delay={i * 0.15}>
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[180px] md:h-[302px] rounded-[20px] border border-black overflow-hidden mb-3 md:mb-4">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-[family-name:var(--font-roboto)] font-bold text-base md:text-[21px] leading-[24px] md:leading-[30px] text-brown text-center">
                {step.number}. {step.title}
              </p>
              <p className="font-[family-name:var(--font-roboto)] text-sm md:text-[19px] leading-[20px] md:leading-[30px] text-black text-center mt-1 max-w-[228px]">
                {step.description}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Philosophy quote */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="mt-[150px] flex gap-4 md:gap-6"
      >
        <GrowLine className="w-2 md:w-3 bg-[#e6e0cf] rounded-sm shrink-0 self-stretch" />
        <FadeUp delay={0.3}>
          <p className="font-[family-name:var(--font-playfair)] italic text-[24px] md:text-[31px] leading-[32px] md:leading-[40px] text-gray-text max-w-[914px]">
            This approach allows complex systems — including AI-assisted
            experiences — to evolve through real human behavior rather than
            assumptions.
          </p>
        </FadeUp>
      </motion.div>
    </section>
  );
}
