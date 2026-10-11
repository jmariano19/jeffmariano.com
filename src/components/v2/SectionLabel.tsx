export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-3 mb-8 md:mb-10 flex items-center gap-2 text-[12px] tracking-[0.08em] uppercase text-ink-muted">
      <span aria-hidden="true">✳</span>
      {children}
    </div>
  );
}
