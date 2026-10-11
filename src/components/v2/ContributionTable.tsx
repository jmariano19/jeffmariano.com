import { contributions } from "@/content/work";

export default function ContributionTable() {
  return (
    <div className="w-full">
      <div className="hidden md:grid grid-cols-[1fr_2fr_0.7fr] gap-8 pb-3 border-b border-line text-[13px] text-ink-muted">
        <span>Work</span>
        <span>Contribution</span>
        <span className="text-right">Context</span>
      </div>
      <ul>
        {contributions.map((row) => (
          <li
            key={row.work}
            className="grid grid-cols-1 md:grid-cols-[1fr_2fr_0.7fr] gap-1 md:gap-8 py-5 border-b border-line"
          >
            <span className="text-[15px] md:text-[16px] font-medium text-ink">{row.work}</span>
            <span className="text-[15px] md:text-[16px] leading-relaxed text-ink-muted">{row.contribution}</span>
            <span className="text-[13px] md:text-[14px] text-ink-muted md:text-right md:pt-0.5">{row.context}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
