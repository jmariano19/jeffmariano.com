import type { ReactNode } from "react";
import FadeUp from "../FadeUp";

/**
 * A numbered chapter of the case study. Built for scanning: the number and
 * kicker say where you are, the title says what changed, and the takeaway
 * says why it matters in one line. The body is optional detail.
 */
export function Chapter({
  id,
  n,
  kicker,
  title,
  takeaway,
  body,
  children,
}: {
  id: string;
  n: string;
  kicker: string;
  title: string;
  takeaway: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 border-t border-[#d4d4d4] pt-10 pb-14 md:pt-14 md:pb-20">
      <FadeUp>
        <p className="flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.12em] text-[#555]">
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#111] text-[12px] tracking-normal text-white">
            {n}
          </span>
          {kicker}
        </p>
        <h2 className="mt-5 max-w-[22ch] text-[30px] font-bold leading-[1.1] tracking-[-0.035em] text-[#111] md:text-[44px]">{title}</h2>
      </FadeUp>
      <FadeUp delay={0.1}>
        <div className="mt-5 grid gap-4 md:mt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <p className="text-[19px] font-medium leading-[1.45] tracking-[-0.015em] text-[#111] md:text-[22px]">{takeaway}</p>
          {body && <p className="text-[16px] leading-[1.7] text-[#555] md:text-[17px]">{body}</p>}
        </div>
      </FadeUp>
      {children && (
        <FadeUp delay={0.2}>
          <div className="mt-8 md:mt-10">{children}</div>
        </FadeUp>
      )}
    </section>
  );
}

/**
 * The challenge and the story at a glance in one calm section: the problem in
 * a sentence or two, three numbers on hairlines, then the chapters as quiet
 * text links. No cards, so it reads as one block instead of seven.
 */
export function ChallengeOverview({
  description,
  stats,
  items,
}: {
  description: string;
  stats: { number: string; label: string }[];
  items: { id: string; n: string; title: string; line: string }[];
}) {
  return (
    <section className="py-10 md:py-14">
      <FadeUp>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
          <h2 className="text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-[#111] md:text-[38px]">Challenges</h2>
          <p className="text-[19px] leading-[1.55] tracking-[-0.01em] text-[#333] md:text-[22px]">{description}</p>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <dl className="mt-10 grid border-t border-[#d4d4d4] sm:grid-cols-3 md:mt-14">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-baseline gap-4 py-5 sm:flex-col sm:gap-1 sm:py-7 ${
                i > 0 ? "border-t border-[#d4d4d4] sm:border-t-0 sm:border-l sm:pl-8" : ""
              } ${i < stats.length - 1 ? "sm:pr-8" : ""}`}
            >
              <dt className="min-w-[32px] text-[40px] font-bold leading-none tracking-[-0.04em] text-[#111] md:text-[52px]">{s.number}</dt>
              <dd className="text-[15px] leading-[1.45] text-[#666]">{s.label}</dd>
            </div>
          ))}
        </dl>
      </FadeUp>

      <FadeUp delay={0.15}>
        <nav aria-label="The story at a glance" className="mt-10 md:mt-14">
          <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.12em] text-[#888]">The story in four parts</p>
          <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it) => (
              <li key={it.id}>
                <a href={`#${it.id}`} className="group block border-t-2 border-[#d4d4d4] pt-4 pb-6 transition-colors hover:border-[#111]">
                  <span className="text-[13px] font-semibold tabular-nums text-[#999] transition-colors group-hover:text-[#111]">{it.n}</span>
                  <span className="mt-2 block text-[18px] font-bold leading-[1.25] tracking-[-0.02em] text-[#111]">{it.title}</span>
                  <span className="mt-1 block text-[15px] leading-[1.5] text-[#666]">{it.line}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </FadeUp>
    </section>
  );
}

/** The story at a glance: each chapter in one line, linking down the page. */
export function StoryMap({ items }: { items: { id: string; n: string; title: string; line: string }[] }) {
  return (
    <section className="pb-12 md:pb-16" aria-label="The story at a glance">
      <FadeUp>
        <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.12em] text-[#555]">The story at a glance</p>
      </FadeUp>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <FadeUp key={it.id} delay={i * 0.08} className="h-full">
            <li className="h-full">
              <a
                href={`#${it.id}`}
                className="group flex h-full flex-col rounded-[18px] bg-white p-5 transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:p-6"
              >
                <span className="flex items-center justify-between">
                  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#111] text-[12px] font-bold text-white">
                    {it.n}
                  </span>
                  <span className="text-[18px] text-[#999] transition-transform group-hover:translate-y-0.5" aria-hidden="true">
                    ↓
                  </span>
                </span>
                <span className="mt-4 text-[18px] font-bold leading-[1.25] tracking-[-0.02em] text-[#111]">{it.title}</span>
                <span className="mt-1.5 text-[14.5px] leading-[1.5] text-[#555]">{it.line}</span>
              </a>
            </li>
          </FadeUp>
        ))}
      </ol>
    </section>
  );
}
