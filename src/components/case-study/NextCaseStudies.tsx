"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeUp from "../FadeUp";

interface NextStudy {
  company: string;
  title: string;
  image: string;
  href: string;
}

interface NextCaseStudiesProps {
  studies: NextStudy[];
}

export default function NextCaseStudies({ studies }: NextCaseStudiesProps) {
  return (
    <section className="px-6 md:px-28 py-[40px]">
      <FadeUp>
        <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[24px] md:text-[30px] text-green-heading mb-8">
          More Case Studies
        </h2>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {studies.map((study, i) => (
          <FadeUp key={study.title} delay={i * 0.1}>
            <motion.a
              href={study.href}
              className="group relative block h-[200px] md:h-[280px] rounded-[20px] overflow-hidden"
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.7 }}
              >
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 md:p-6 text-white">
                <p className="font-[family-name:var(--font-playfair)] font-bold italic text-sm mb-1">
                  {study.company}
                </p>
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-[18px] md:text-[22px] leading-[22px] md:leading-[28px]">
                  {study.title}
                </h3>
              </div>
            </motion.a>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
