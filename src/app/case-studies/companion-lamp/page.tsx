import type { Metadata } from "next";
import Link from "next/link";
import { SitePage } from "@/components/SiteChrome";
import LampExperience from "@/components/LampExperience";

export const metadata: Metadata = {
  title: "A Little Light for Your Day — Jeff Mariano",
  description: "A personal design experiment exploring a companion lamp that expresses sleep, movement, and daily rhythms through light and character.",
};

export default function LampExperiment() {
  return (
    <SitePage>
      <section className="pb-12 pt-20 md:pt-28">
        <Link href="/#side-projects" className="text-sm text-[#666] underline underline-offset-4">Back to experiments</Link>
        <p className="mt-12 text-xs uppercase tracking-[.14em] text-[#666]">Personal experiment · Ambient interaction · Concept in progress</p>
        <h1 className="mt-5 max-w-4xl text-[44px] font-semibold leading-[1.04] tracking-[-.055em] md:text-[76px]">A little light<br />for your day.</h1>
        <p className="mt-7 max-w-2xl text-xl leading-relaxed text-[#666]">What if my health data became a little companion? I’m exploring a character lamp that responds to sleep, movement, and daily rhythms through light and expression.</p>
        <p className="mt-6 text-sm text-[#666]">My role: concept, character & interaction design · Stage: digital exploration, physical build next</p>
      </section>
      <LampExperience />
      <div className="grid gap-12 py-20 md:grid-cols-2 md:gap-20">
        <section>
          <p className="text-xs uppercase tracking-[.14em] text-[#777]">01 / The spark</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em]">Making something just for the joy of it.</h2>
          <p className="mt-5 text-lg leading-relaxed text-[#666]">This started with a simple wish: to make a playful object that lives on my desk and feels a little alive. A character lamp became the starting point for exploring how my daily routines might show up in its personality.</p>
        </section>
        <section>
          <p className="text-xs uppercase tracking-[.14em] text-[#777]">02 / The question</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em]">Can a glance tell a small story?</h2>
          <p className="mt-5 text-lg leading-relaxed text-[#666]">I want to explore how much a glow, a blink, or a change in expression can communicate. Sleep and activity would shape its behavior, while the character gives those signals a warmer, more personal form.</p>
        </section>
      </div>
      <section className="rounded-[24px] bg-white p-7 md:p-12">
        <p className="text-xs uppercase tracking-[.14em] text-[#777]">03 / Designing its personality</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-.04em]">Gentle company throughout the day.</h2>
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {[
            ["Expressive", "A small face, soft colors, and subtle movement give the character room to feel alive."],
            ["Supportive", "A restless night invites a gentler morning. An active day earns a little celebration. Quiet days are welcome too."],
            ["Unhurried", "The lamp stays calm most of the time, with small changes that are easy to notice when I look over."],
          ].map(([title, text]) => <div key={title}><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-base leading-relaxed text-[#666]">{text}</p></div>)}
        </div>
      </section>
      <section className="py-20">
        <p className="text-xs uppercase tracking-[.14em] text-[#777]">04 / Building toward the real thing</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em]">The story will grow with the experiment.</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["Now", "Explore the character", "Try expressions, colors, and daily moments in a digital prototype."],
            ["Next", "Make it physical", "Prototype the glowing body and a way to display changing expressions."],
            ["Then", "Connect one signal", "Choose a health app and test a single sleep or activity connection with permission."],
          ].map(([when, title, text]) => <li key={when} className="border-t border-[#ccc] pt-5"><p className="text-sm text-[#777]">{when}</p><h3 className="mt-3 text-xl font-semibold">{title}</h3><p className="mt-3 leading-relaxed text-[#666]">{text}</p></li>)}
        </ol>
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-[#777]">The character shown here is a digital interpretation inspired by a reference lamp. Hardware, changing facial expressions on the physical object, and health-app integration are still to be explored.</p>
      </section>
    </SitePage>
  );
}
