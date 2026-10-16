import type { Metadata } from "next";
import { SitePage } from "@/components/SiteChrome";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import { Chapter, StoryMap } from "@/components/case-study/Chapter";
import NextCaseStudies from "@/components/case-study/NextCaseStudies";
import { EliStory } from "@/components/case-study/EliStory";
import { EliRiveConsole } from "@/components/case-study/EliRiveConsole";
import {
  EditorAnatomy,
  GiveRitual,
  PlayPrototype,
  PlayedBridge,
  SceneTypes,
  SystemLoops,
} from "@/components/case-study/EliSections";

export const metadata: Metadata = {
  title: "Eli's Last Experiment — Jeff Mariano",
  description:
    "A mobile narrative game where a fragile boy is built from the player's own words. An experiment in how people form trust and attachment with an AI character.",
  // Draft while the story is being built.
  robots: { index: false, follow: false },
};

export default function EliLastExperiment() {
  return (
    <SitePage>
      <CaseStudyHero
        tag="SIDE PROJECT · NARRATIVE GAME · PROTOTYPE"
        title="A Boy Built From Your Own Words"
        summary="Eli's Last Experiment is a mobile narrative game about a fragile boy who slowly becomes real through what the player shares with him. I'm designing and building it to explore how people form trust and attachment with an AI character, and what it means when that character gives your words back."
        meta="Role: Designer & builder · narrative, interaction, animation, tools | Platform: Mobile web · Rive · Claude API | Status: Prototype 10, in progress"
        media={<EliStory />}
      />

      {/* What the visitor just played, mapped to the system behind it */}
      <section id="eli-design" className="scroll-mt-8 pb-12 md:pb-16">
        <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.12em] text-[#555]">Behind the story</p>
        <PlayedBridge />
      </section>

      <StoryMap
        items={[
          { id: "system", n: "01", title: "The system", line: "Two loops, seven memories." },
          { id: "rive", n: "02", title: "Eli in Rive", line: "A character the code can drive." },
          { id: "editor", n: "03", title: "The editor", line: "A tool for writing many stories." },
          { id: "ritual", n: "04", title: "Rituals", line: "Care you feel in your hands." },
          { id: "prototype", n: "05", title: "The prototype", line: "Nine scenes. Play them." },
        ]}
      />

      <Chapter
        id="system"
        n="01"
        kicker="Narrative design"
        title="Two loops, seven memories"
        takeaway="Players care for Eli and share their own memories. Each one unlocks one of his, from stranger to mirror."
      >
        <SystemLoops />
      </Chapter>

      <Chapter
        id="rive"
        n="02"
        kicker="Rive · the State Grammar"
        title="Eli is a state machine"
        takeaway="One Rive file, four channels the game drives: emotion, heart, body and head. Pose him, or play a real line from the game."
      >
        <EliRiveConsole />
      </Chapter>

      <Chapter
        id="editor"
        n="03"
        kicker="Tools · the Elia editor"
        title="One editor, many stories"
        takeaway="I built the tool before the story, so a new scene takes minutes and no code. Hover the pins."
      >
        <EditorAnatomy />
        <div className="mt-8">
          <SceneTypes />
        </div>
      </Chapter>

      <Chapter
        id="ritual"
        n="04"
        kicker="Interaction design"
        title="Rituals, not rewards"
        takeaway="Care you feel in your hands. Hold to give Eli a memory."
      >
        <GiveRitual />
      </Chapter>

      <Chapter
        id="prototype"
        n="05"
        kicker="The prototype"
        title="Play prototype 10"
        takeaway="Nine scenes and five scene types, all made in the editor. Jump in anywhere."
      >
        <PlayPrototype />
      </Chapter>

      <NextCaseStudies
        studies={[
          {
            company: "Verizon",
            title: "One AI Canvas for Every Way Reps Help Customers",
            image: "/images/case-studies/canvas/hero-bg.webp",
            href: "/case-studies/ai-conversational-canvas",
          },
          {
            company: "Verizon",
            title: "Scaling a Retail Design System Across 15+ Teams",
            image: "/images/case-verizon-ecosystem.png",
            href: "/case-studies/verizon-design-systems",
          },
          {
            company: "ViveBien",
            title: "63 Million People Ignored by Digital Health",
            image: "/images/case-vivebien.png",
            href: "/case-studies/vivebien",
          },
        ]}
      />
    </SitePage>
  );
}
