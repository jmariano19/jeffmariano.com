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
