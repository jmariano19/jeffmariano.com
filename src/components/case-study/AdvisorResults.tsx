import FadeUp from "../FadeUp";

/**
 * Field results for POS AI Advisor in Verizon sales channels.
 * Numbers as reported by Jeff for 8/20–10/29; keep the "directional" framing on the protection lift.
 */

const stats = [
  {
    value: "+38.5%",
    label: "Protection lift",
    detail: "When reps use AI Advisor's Ask Me Anything, sales results directionally improve.",
  },
  {
    value: "71%",
    label: "Fully or partially using it",
    detail: "AI Advisor for quote to checkout, with usage at 40.6% compared to Flex.",
  },
  {
    value: "17%",
    label: "Faster complex carts",
    detail: "3.8 minutes saved per cart when fully using AI Advisor, compared to Flex.",
  },
  {
    value: "6%",
    label: "Faster simple carts",
    detail: "0.8 minutes saved per cart, compared to Flex.",
  },
];

export default function AdvisorResults() {
  return (
    <section className="border-t border-[#d4d4d4] pt-10 pb-6 md:pt-14">
      <FadeUp>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
          <div>
            <h2 className="text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-[#111] md:text-[38px]">Results in the field</h2>
            <p className="mt-3 max-w-[34ch] text-[16px] leading-[1.55] text-[#666]">
              POS AI Advisor is now the primary conversational tool across Verizon sales channels: Direct, Indirect, Inside Sales and Door to
              Door, with strong volume and positive rep feedback.
            </p>
            <p className="mt-4 text-[13px] text-[#999]">Aug 20 – Oct 29, 2026</p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col justify-between rounded-[20px] bg-white p-6 md:p-7">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <p className="text-[48px] font-bold leading-none tracking-[-0.05em] text-[#111] md:text-[60px]">{s.value}</p>
                  <p className="mt-3 text-[18px] font-semibold tracking-[-0.02em] text-[#111] md:text-[20px]">{s.label}</p>
                  <p className="mt-1.5 text-[15px] leading-[1.5] text-[#666]">{s.detail}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-6 text-[13px] leading-[1.5] text-[#999]">
          Ask Me Anything isn&apos;t tied directly to the transaction flow, so the protection lift is directional, not causal. Time savings
          compare carts fully using AI Advisor with Flex.
        </p>
      </FadeUp>
    </section>
  );
}
