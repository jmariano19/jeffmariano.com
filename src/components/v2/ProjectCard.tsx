"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CaseStudy } from "@/content/work";

export default function ProjectCard({ study, priority = false }: { study: CaseStudy; priority?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        href={study.href}
        className="group block"
        data-ga-event="case_study_click"
        data-ga-category="case_studies"
        data-ga-label={study.title}
      >
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 md:px-6 py-4">
          <p className="text-[15px] md:text-[17px] font-medium text-ink leading-snug">
            {study.title}
            <span className="ml-2 text-ink-muted font-normal whitespace-nowrap">
              / {study.company}
            </span>
          </p>
          <span className="hidden sm:inline text-[13px] text-ink-muted whitespace-nowrap">{study.tag}</span>
        </div>

        <div className="relative mt-1.5 overflow-hidden rounded-2xl bg-white p-1.5">
          <div className="relative aspect-[16/10] md:aspect-[16/8] overflow-hidden rounded-xl">
            <Image
              src={study.image}
              alt=""
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3 px-1">
          <p className="text-[15px] md:text-[16px] leading-relaxed text-ink-muted max-w-[640px]">
            {study.result}
          </p>
          <span className="text-[14px] font-medium text-ink whitespace-nowrap group-hover:underline underline-offset-4">
            Read case study →
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
