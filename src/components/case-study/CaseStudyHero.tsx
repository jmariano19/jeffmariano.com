import Image from "next/image";
import Reveal from "../Reveal";
import ScrollBlur from "../ScrollBlur";
import { Asterisk } from "../SiteChrome";

interface CaseStudyHeroProps {
  tag: string;
  title: string;
  meta: string;
  image: string;
  /** Optional one-line framing shown under the title. */
  summary?: string;
  imageAlt?: string;
}

export default function CaseStudyHero({ tag, title, meta, image, summary, imageAlt }: CaseStudyHeroProps) {
  return (
    <section className="pt-16 md:pt-[110px] pb-10 md:pb-14">
      {/* Text and image each blur and fade as they scroll away, as on the homepage hero. */}
      <ScrollBlur start="start">
      <Reveal onLoad delay={0.1}>
        <p className="flex items-center gap-2 text-[12px] md:text-[13px] uppercase tracking-[0.04em] text-[#555]">
          <Asterisk />
          {tag}
        </p>
      </Reveal>
      <Reveal onLoad delay={0.18}>
        <h1 className="mt-5 max-w-[16ch] text-[40px] md:text-[64px] xl:text-[72px] leading-[1.05] font-bold tracking-[-0.04em]">
          {title}
        </h1>
      </Reveal>
      {summary && (
        <Reveal onLoad delay={0.23}>
          <p className="mt-6 max-w-[38rem] text-[16px] md:text-[18px] leading-[1.7] tracking-[-0.01em] text-[#444]">{summary}</p>
        </Reveal>
      )}
      <Reveal onLoad delay={0.28}>
        <dl className="mt-8 md:mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-3 border-t border-[#c9c9c9] pt-4 max-w-[1000px]">
          {meta.split("|").map((item) => {
            const [label, ...rest] = item.trim().split(":");
            return (
              <div key={label}>
                <dt className="text-[12px] md:text-[13px] uppercase tracking-[0.02em] text-[#9a9a9a]">{label}</dt>
                <dd className="mt-1 text-[14px] md:text-[15px] leading-snug text-[#111]">{rest.join(":").trim()}</dd>
              </div>
            );
          })}
        </dl>
      </Reveal>
      </ScrollBlur>
      <ScrollBlur>
      <Reveal onLoad delay={0.35} blur y={60}>
        <div className="relative mt-10 md:mt-14 w-full h-[280px] md:h-[600px] overflow-hidden rounded-[14px] bg-[#e4e4e4]">
          <Image src={image} alt={imageAlt ?? title} fill sizes="(max-width: 1440px) 100vw, 1304px" className="object-cover" priority />
        </div>
      </Reveal>
      </ScrollBlur>
    </section>
  );
}
