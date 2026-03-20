import FadeUp from "../FadeUp";

interface Stat {
  number: string;
  label: string;
}

interface ChallengesProps {
  stats: Stat[];
  description: string;
}

export default function Challenges({ stats, description }: ChallengesProps) {
  return (
    <section className="px-6 md:px-28 py-[40px]">
      <FadeUp>
        <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[30px] md:text-[38px] leading-[36px] md:leading-[45px] text-green-heading mb-10">
          Challenges
        </h2>
      </FadeUp>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 mb-10">
        {stats.map((stat, i) => (
          <FadeUp key={stat.label} delay={i * 0.1}>
            <div className="bg-[#e6e0cf]/40 rounded-2xl p-6 md:p-8 text-center">
              <p className="font-[family-name:var(--font-playfair)] font-bold text-[36px] md:text-[52px] text-green-heading">
                {stat.number}
              </p>
              <p className="font-[family-name:var(--font-roboto)] text-xs md:text-sm text-gray-text mt-1">
                {stat.label}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp>
        <p className="font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[32px] text-gray-text max-w-[900px]">
          {description}
        </p>
      </FadeUp>
    </section>
  );
}
