"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeUp from "./FadeUp";

interface CaseStudyCardProps {
  company: string;
  title: string;
  description: string;
  image: string;
  href?: string;
  large?: boolean;
}

function CaseStudyCard({
  company,
  title,
  description,
  image,
  href,
  large,
}: CaseStudyCardProps) {
  return (
    <FadeUp>
      <motion.a
        href={href || "#"}
        className={`group relative block rounded-[20px] overflow-hidden ${large ? "h-[420px] md:h-[620px]" : "h-[320px] md:h-[568px]"}`}
        whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(74,73,60,0.8)] via-[rgba(75,75,75,0.29)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white max-w-[534px]">
          <p className="font-[family-name:var(--font-playfair)] font-bold italic text-sm md:text-lg mb-1 md:mb-2">
            {company}
          </p>
          <h3
            className={`font-[family-name:var(--font-playfair)] font-bold ${
              large
                ? "text-[28px] md:text-[52px] leading-[34px] md:leading-[60px]"
                : "text-[28px] md:text-[42px] leading-[34px] md:leading-[50px]"
            }`}
          >
            {title}
          </h3>
          <p className="mt-2 md:mt-3 font-[family-name:var(--font-roboto)] text-sm md:text-lg leading-[22px] md:leading-[35px] max-w-[433px]">
            {description}
          </p>
          <p className="mt-3 md:mt-4 font-[family-name:var(--font-roboto)] font-bold text-sm md:text-lg">
            Read Case Study
          </p>
        </div>
      </motion.a>
    </FadeUp>
  );
}

interface TinybeansCardProps {
  company: string;
  title: string;
  description: string;
  image: string;
}

function TinybeansCard({
  company,
  title,
  description,
  image,
}: TinybeansCardProps) {
  return (
    <FadeUp>
      <motion.a
        href="/case-studies/tinybeans"
        className="group relative block overflow-hidden rounded-[20px]"
        whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="relative h-[320px] md:h-[590px] rounded-[20px] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={image}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-6 right-6 md:bottom-16 md:left-12 md:right-auto bg-cream-light/80 rounded-2xl p-6 md:p-10 md:max-w-[680px]">
          <p className="font-[family-name:var(--font-playfair)] font-bold italic text-sm md:text-lg text-green-accent mb-1 md:mb-2">
            {company}
          </p>
          <h3 className="font-[family-name:var(--font-playfair)] font-bold text-[24px] md:text-[45px] leading-[30px] md:leading-[45px] text-green-dark">
            {title}
          </h3>
          <p className="mt-2 md:mt-3 font-[family-name:var(--font-roboto)] text-sm md:text-lg leading-[22px] md:leading-[35px] text-green-dark">
            {description}
          </p>
          <p className="mt-3 md:mt-4 font-bold text-sm md:text-lg text-text-dark">
            Read Case Study
          </p>
        </div>
      </motion.a>
    </FadeUp>
  );
}

const caseStudies = [
  {
    company: "Verizon",
    title: "Retail Eco-Systems",
    description:
      "Unified design across 15+ teams and two continents at a Fortune 50 telecom company.",
    image: "/images/case-verizon-ecosystem.png",
    href: "/case-studies/verizon-design-systems",
  },
  {
    company: "Verizon",
    title: "The AI Was Smart. The UX Was Wrong.",
    description:
      "Redesigned an AI-powered retail POS from 2% adoption to voluntary use.",
    image: "/images/case-verizon-ai.png",
    href: "/case-studies/verizon-ai",
  },
  {
    company: "ViveBien",
    title: "63 Million People Ignored by Digital Health",
    description:
      "Designing a WhatsApp-based health product for the Hispanic community — from the inside.",
    image: "/images/case-vivebien.png",
    href: "/case-studies/vivebien",
  },
];

const tinybeansStudy = {
  company: "Tinybeans",
  title: "Rebranding a 20 Million-Family App Without Breaking Trust",
  description:
    "Led the full rebrand of Tinybeans — strategy, design system, and execution across every touchpoint.",
  image: "/images/case-tinybeans.png",
};

export default function CaseStudies() {
  return (
    <section className="px-4 md:px-24 pb-16">
      {/* Tabs */}
      <FadeUp>
        <div className="flex items-center gap-6 mb-6 md:mb-8 px-2 md:px-0">
          <button type="button" className="font-[family-name:var(--font-playfair)] text-lg md:text-xl text-green-dark relative">
            Case Stories
            <span className="absolute -bottom-1 left-0 h-1 w-full bg-green-accent" />
          </button>
          <button type="button" className="font-[family-name:var(--font-playfair)] text-lg md:text-xl text-gray-light cursor-default" aria-disabled="true">
            Articles
          </button>
        </div>
      </FadeUp>

      {/* Cards */}
      <div className="flex flex-col gap-6 md:gap-10">
        {caseStudies.map((study) => (
          <CaseStudyCard
            key={study.title}
            {...study}
            large={study.title.includes("63 Million")}
          />
        ))}
        <TinybeansCard {...tinybeansStudy} />
      </div>
    </section>
  );
}
