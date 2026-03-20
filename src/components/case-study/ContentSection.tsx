import Image from "next/image";
import FadeUp from "../FadeUp";

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  tag?: string;
  description: string;
  explanation?: string;
  explanation2?: string;
  image?: string;
  imageFit?: "cover" | "contain";
  imagePlaceholder?: boolean;
  beforeAfter?: {
    before: string;
    after: string;
  };
}

export default function ContentSection({
  title,
  subtitle,
  tag,
  description,
  explanation,
  explanation2,
  image,
  imageFit = "cover",
  imagePlaceholder,
  beforeAfter,
}: ContentSectionProps) {
  return (
    <section className="px-6 md:px-28 py-[40px]">
      <FadeUp>
        <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[26px] md:text-[34px] leading-[32px] md:leading-[42px] text-green-heading">
          {title}
        </h2>
        {subtitle && (
          <h3 className="font-[family-name:var(--font-playfair)] italic text-[20px] md:text-[24px] text-gray-text mt-2">
            {subtitle}
          </h3>
        )}
      </FadeUp>

      {tag && (
        <FadeUp delay={0.1}>
          <p className="font-[family-name:var(--font-roboto)] font-bold text-xs tracking-[2px] text-brown uppercase mt-6 mb-3">
            {tag}
          </p>
          <div className="w-full h-px bg-gray-text opacity-20 mb-4" />
        </FadeUp>
      )}

      <FadeUp delay={0.15}>
        <p className="font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[32px] text-gray-text max-w-[900px]">
          {description}
        </p>
      </FadeUp>

      {explanation && (
        <FadeUp delay={0.2}>
          <p className="mt-6 font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[32px] text-gray-text max-w-[900px]">
            {explanation}
          </p>
        </FadeUp>
      )}

      {explanation2 && (
        <FadeUp delay={0.25}>
          <p className="mt-6 font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[32px] text-gray-text max-w-[900px]">
            {explanation2}
          </p>
        </FadeUp>
      )}

      {/* Image or placeholder */}
      {image && (
        <FadeUp delay={0.2}>
          {imageFit === "contain" ? (
            <div className="relative mt-8">
              <Image src={image} alt={title} width={1400} height={800} className="w-full h-auto object-contain" />
            </div>
          ) : (
            <div className="relative h-[240px] md:h-[400px] rounded-[20px] overflow-hidden mt-8">
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
          )}
        </FadeUp>
      )}

      {imagePlaceholder && (
        <FadeUp delay={0.2}>
          <div className="h-[240px] md:h-[400px] rounded-[20px] bg-[#d9d3c4]/30 mt-8 flex items-center justify-center">
            <p className="font-[family-name:var(--font-roboto)] text-gray-light text-sm">
              Image placeholder
            </p>
          </div>
        </FadeUp>
      )}

      {/* Before/After */}
      {beforeAfter && (
        <FadeUp delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
            <div className="bg-[#e6e0cf]/30 rounded-2xl p-6 md:p-8">
              <p className="font-[family-name:var(--font-roboto)] font-bold text-xs tracking-[2px] text-brown uppercase mb-3">
                BEFORE
              </p>
              <p className="font-[family-name:var(--font-roboto)] text-base leading-[28px] text-gray-text">
                {beforeAfter.before}
              </p>
            </div>
            <div className="bg-[#d4e8c4]/30 rounded-2xl p-6 md:p-8">
              <p className="font-[family-name:var(--font-roboto)] font-bold text-xs tracking-[2px] text-green-accent uppercase mb-3">
                AFTER
              </p>
              <p className="font-[family-name:var(--font-roboto)] text-base leading-[28px] text-gray-text">
                {beforeAfter.after}
              </p>
            </div>
          </div>
        </FadeUp>
      )}
    </section>
  );
}
