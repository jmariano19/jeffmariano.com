import FadeUp from "../FadeUp";

interface OutcomeItem {
  title: string;
  description: string;
}

interface OutcomesProps {
  items: OutcomeItem[];
  title?: string;
}

export default function Outcomes({ items, title = "Outcomes" }: OutcomesProps) {
  return (
    <section className="py-[40px]">
      <FadeUp>
        <h2 className="font-[family-name:var(--font-inter)] tracking-[-0.03em] font-bold text-[30px] md:text-[38px] leading-[36px] md:leading-[45px] text-green-heading mb-8">
          {title}
        </h2>
      </FadeUp>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map((item, i) => (
          <FadeUp key={item.title} delay={i * 0.1}>
            <div className="bg-white rounded-2xl p-6 md:p-8 text-center h-full">
              <p className="font-[family-name:var(--font-inter)] tracking-[-0.03em] font-bold text-[20px] md:text-[24px] leading-[26px] md:leading-[30px] text-green-heading">
                {item.title}
              </p>
              <p className="font-[family-name:var(--font-inter)] text-[14px] md:text-sm text-gray-text mt-2">
                {item.description}
              </p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
