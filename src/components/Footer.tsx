import FadeUp from "./FadeUp";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center pt-[15px] pb-[90px] gap-4">
      <FadeUp>
        <Logo size={85} />
      </FadeUp>
      <FadeUp delay={0.1}>
        <p className="font-[family-name:var(--font-cormorant)] font-bold text-xl md:text-2xl text-black text-center">
          Jeff Mariano&apos;s portfolio 2026
        </p>
      </FadeUp>
      <FadeUp delay={0.2}>
        <div className="flex gap-6 font-[family-name:var(--font-cormorant)] text-lg md:text-xl text-black">
          <a
            href="https://www.linkedin.com/in/jeffrey-mariano-0b28722a/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-70 transition-opacity"
            data-ga-event="outbound_link_click"
            data-ga-category="footer"
            data-ga-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="underline hover:opacity-70 transition-opacity"
            data-ga-event="resume_click"
            data-ga-category="footer"
            data-ga-label="Resume"
          >
            Resume
          </a>
          <a
            href="mailto:jmariano19@gmail.com"
            className="underline hover:opacity-70 transition-opacity"
            data-ga-event="contact_click"
            data-ga-category="footer"
            data-ga-label="Footer email"
          >
            Contact
          </a>
        </div>
      </FadeUp>
    </footer>
  );
}
