import FadeUp from "./FadeUp";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="px-6 pt-[30px] pb-[94px] flex flex-col items-center text-center">
      <FadeUp>
        <Logo size={92} rotateOuter />
      </FadeUp>
      <FadeUp delay={0.2}>
        <h1 className="mt-10 md:mt-12 font-[family-name:var(--font-playfair)] font-bold text-[33px] md:text-[56px] leading-[40px] md:leading-[65px] text-green-heading max-w-[842px]">
          I turn ignored AI tools into systems people actually use.
        </h1>
      </FadeUp>
      <FadeUp delay={0.4}>
        <p className="mt-6 md:mt-8 font-[family-name:var(--font-roboto)] text-base md:text-[18px] leading-[28px] md:leading-[35px] text-gray-text max-w-[631px]">
          I help businesses implement AI that their teams and customers actually adopt — through behavioral design, micro-experimentation, and a methodology proven across retail, health, and digital ecosystems.
        </p>
      </FadeUp>
    </section>
  );
}
