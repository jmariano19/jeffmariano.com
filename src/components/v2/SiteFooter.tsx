import { contactHref } from "@/content/work";

export default function SiteFooter() {
  return (
    <footer className="px-5 md:px-10 pt-10 pb-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-[13px] text-ink-muted">
      <div className="flex gap-6">
        <a
          href="https://www.linkedin.com/in/jeffrey-mariano-0b28722a/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-ink transition-colors"
          data-ga-event="outbound_link_click"
          data-ga-category="footer"
          data-ga-label="LinkedIn"
        >
          LinkedIn
        </a>
        <a href={contactHref} className="hover:text-ink transition-colors">
          Email
        </a>
      </div>
      <p>Portfolio built with Codex and Claude · © 2026 Jeffrey Mariano</p>
    </footer>
  );
}
