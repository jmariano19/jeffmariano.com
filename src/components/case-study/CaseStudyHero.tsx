import Image from "next/image";
import FadeUp from "../FadeUp";

interface CaseStudyHeroProps {
  tag: string;
  title: string;
  meta: string;
  image: string;
}

export default function CaseStudyHero({
  tag,
  title,
  meta,
  image,
}: CaseStudyHeroProps) {
  return (
    <section>
      {/* Title block */}
      <div className="max-w-[768px] mx-auto text-center mt-10 md:mt-14 px-6 mb-10 md:mb-14">
        <FadeUp>
          <p className="font-[family-name:var(--font-roboto)] text-sm md:text-base tracking-[2px] text-brown uppercase mb-4">
            {tag}
          </p>
        </FadeUp>
        <FadeUp delay={0.15}>
          <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[28px] md:text-[42px] leading-[34px] md:leading-[50px] text-green-heading">
            {title}
          </h1>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div className="mt-6 font-[family-name:var(--font-roboto)] text-sm md:text-base leading-[28px] text-gray-text flex flex-col items-center gap-1">
            {meta.split("|").map((item, i) => {
              const parts = item.trim().split(":");
              return (
                <p key={i}>
                  <span className="font-bold">{parts[0]}:</span>
                  {parts.slice(1).join(":")}
                </p>
              );
            })}
          </div>
        </FadeUp>
      </div>

      {/* Full-width hero image */}
      <FadeUp delay={0.2}>
        <div className="relative w-full h-[300px] md:h-[600px] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </FadeUp>
    </section>
  );
}
