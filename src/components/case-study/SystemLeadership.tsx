import FadeUp from "../FadeUp";

const pillars = [
  {
    title: "Design system leadership",
    description:
      "Roadmaps, reusable patterns, quality standards, and governance models that helped teams ship with consistency.",
  },
  {
    title: "Cross-functional scale",
    description:
      "Partnered with Product, Engineering, Research, and global design teams to align libraries, workflows, and delivery.",
  },
  {
    title: "AI-ready adoption",
    description:
      "Created patterns that protected employee judgment, reduced decision friction, and made complex workflows easier to trust.",
  },
];

export default function SystemLeadership() {
  return (
    <section className="px-6 md:px-28 py-[40px]">
      <FadeUp>
        <div className="rounded-[28px] bg-cream-light px-6 py-8 md:px-12 md:py-12">
          <p className="font-[family-name:var(--font-roboto)] text-xs md:text-sm font-bold uppercase tracking-[0.22em] text-brown">
            Enterprise Experience Focus
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <h2 className="font-[family-name:var(--font-playfair)] text-[30px] font-bold leading-[38px] text-green-heading md:text-[48px] md:leading-[56px]">
              Systems that make quality easier to repeat.
            </h2>
            <p className="font-[family-name:var(--font-roboto)] text-base leading-[28px] text-gray-text md:text-[18px] md:leading-[34px]">
              The work was not only a component library. It was an operating model:
              defining patterns, creating contribution paths, coaching teams, and
              proving the system through adoption in real product workflows.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-[20px] border border-[#e6e0cf] bg-cream p-5 md:p-6"
              >
                <h3 className="font-[family-name:var(--font-roboto)] text-lg font-bold text-green-dark">
                  {pillar.title}
                </h3>
                <p className="mt-3 font-[family-name:var(--font-roboto)] text-sm leading-[24px] text-gray-text md:text-base md:leading-[28px]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
