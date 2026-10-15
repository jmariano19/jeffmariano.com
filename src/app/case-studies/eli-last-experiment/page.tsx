import type { Metadata } from "next";
import { SitePage } from "@/components/SiteChrome";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import { EliStory } from "@/components/case-study/EliStory";

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
        meta="Role: Designer & builder · narrative, interaction, animation | Platform: Mobile · Rive · Claude API | Status: Prototype 4, in progress"
        media={<EliStory />}
      />

      {/* Where the story continues: the design sections are added here next */}
      <div id="eli-design" className="scroll-mt-8" />
    </SitePage>
  );
}
