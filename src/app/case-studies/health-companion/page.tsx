import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel, SitePage } from "@/components/SiteChrome";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";

export const metadata: Metadata = {
  title: "A Little Light, A Little Life — Jeff Mariano",
  description: "A personal concept exploring how sleep and movement could become light, expression, and a small daily companion.",
  robots: { index: false, follow: false },
};

const moments = [
  { time: "Morning", title: "Waking up together.", signal: "Last night's sleep", behavior: "A soft glow gradually appears. The character wakes with a slow blink. After a short night, its expression is gentle and sleepy.", intent: "A quiet moment to notice how I rested." },
  { time: "During the day", title: "A little celebration.", signal: "Daily movement", behavior: "As movement builds, the light becomes warmer and the character more animated. Reaching a personal goal brings a brief, happy expression.", intent: "A small acknowledgment of the effort." },
  { time: "Evening", title: "Slowing down together.", signal: "A chosen wind-down time", behavior: "The glow dims to amber. Movement slows, eyelids soften, and the character settles into a calm rhythm.", intent: "A familiar cue to ease into the evening." },
];

export default function HealthCompanion() {
  return (
    <SitePage active="experiments">
      <CaseStudyHero
        tag="PERSONAL EXPERIMENT · CONNECTED OBJECT · CONCEPT"
        title="A Little Light, A Little Life"
        summary="What if my health data became a little character I could live with? I'm exploring a companion lamp that translates sleep and daily movement into color, expression, and small moments of personality."
        meta="Role: Concept & interaction design | Medium: Character, light & motion | Status: Early concept; hardware and integration planned"
      />

      <section className="pb-16 md:pb-24">
        <div className="rounded-[24px] bg-[#e8e3dc] px-6 py-12 md:px-12 md:py-20">
          <p className="text-[13px] uppercase tracking-[0.08em] text-[#655e55]">The starting question</p>
          <p className="mt-6 max-w-[23ch] text-[34px] leading-[1.1] tracking-[-0.045em] md:text-[58px]">
            Could a small object make my daily rhythms feel more personal?
          </p>
          <p className="mt-8 max-w-[40rem] text-[17px] leading-relaxed text-[#655e55]">
            This starts with curiosity and the pleasure of making something. A character on my desk.
            A little light in the morning. A face that changes as the day unfolds.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <SectionLabel>A day with the companion</SectionLabel>
        <p className="mb-8 max-w-[40rem] text-[17px] leading-relaxed text-[#6b6b6b]">
          Three imagined moments guide the first version. These are proposed behaviors;
          the health connection and physical lamp have yet to be built.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {moments.map((moment, index) => (
            <article key={moment.time} className="rounded-[20px] bg-white p-6 md:p-8">
              <p className="text-[13px] uppercase tracking-[0.05em] text-[#777]">0{index + 1} / {moment.time}</p>
              <h2 className="mt-8 text-[30px] leading-tight tracking-[-0.04em]">{moment.title}</h2>
              <p className="mt-5 text-[14px] font-medium">{moment.signal}</p>
              <p className="mt-3 text-[16px] leading-relaxed text-[#666]">{moment.behavior}</p>
              <p className="mt-6 border-t border-[#e4e4e4] pt-4 text-[16px] leading-relaxed">{moment.intent}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 pb-16 md:grid-cols-2 md:gap-16 md:pb-24">
        <div>
          <SectionLabel>Finding its personality</SectionLabel>
          <h2 className="max-w-[18ch] text-[36px] leading-[1.1] tracking-[-0.04em] md:text-[48px]">The smallest movements carry the character.</h2>
        </div>
        <div className="space-y-5 text-[17px] leading-relaxed text-[#666]">
          <p>A blink, a pause, a curious glance. I want to explore how simple expressions and a changing glow can make a physical object feel like company.</p>
          <p>Its personality should feel caring. A low-activity day might invite a gentle stretch; a rough night might bring a softer morning. The character should leave room for how I actually feel.</p>
          <p>The first design question is whether I enjoy its presence over time. Its reactions need to be quiet enough to live with and expressive enough to notice.</p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <SectionLabel>From concept to something I can hold</SectionLabel>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            ["01 / Explore", "Character & expressions", "Develop the character direction, a small expression set, and a motion study using sample states."],
            ["02 / Connect", "One real signal", "Choose a health app, confirm data access, and connect last night's sleep to one morning reaction."],
            ["03 / Make", "The physical companion", "Prototype the enclosure, face display, and diffused light. Live with it and keep a record of what feels delightful or distracting."],
          ].map(([label, title, body]) => (
            <div key={label} className="border-t border-[#d4d4d4] pt-5">
              <p className="text-[13px] uppercase tracking-[0.04em] text-[#777]">{label}</p>
              <h3 className="mt-4 text-[23px] font-medium">{title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-[#666]">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-[44rem] text-[15px] leading-relaxed text-[#777]">
          An open studio project, begun October 2026. I'll document the character studies, prototypes,
          and lessons here as I build. No working hardware or live health integration is claimed at this stage.
        </p>
        <Link href="/#side-projects" className="mt-8 inline-block text-[16px] underline underline-offset-4">← Back to experiments</Link>
      </section>
    </SitePage>
  );
}
