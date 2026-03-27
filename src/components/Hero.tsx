import FadeUp from "./FadeUp";

export default function Hero() {
  return (
    <section className="px-6 md:px-28 pt-12 md:pt-20 pb-[94px]">
      <FadeUp delay={0.2}>
        <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[33px] md:text-[47px] leading-[40px] md:leading-[55px] text-green-heading max-w-[644px]">
          I turn ignored AI tools into systems people actually use.
        </h1>
      </FadeUp>
      <FadeUp delay={0.4}>
        <div className="mt-6 md:mt-8 font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[35px] text-gray-text max-w-[768px] flex flex-col gap-4">
          <p>Most teams are testing AI. Few are seeing real adoption.</p>
          <p>I focus on what happens in practice—how people behave, where systems break, and what it takes to make AI trustworthy.</p>
        </div>
      </FadeUp>
    </section>
  );
}
