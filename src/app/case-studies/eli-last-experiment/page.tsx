import Image from "next/image";
import type { Metadata } from "next";
import { SitePage } from "@/components/SiteChrome";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";

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
        media={
          <div className="relative flex h-[420px] items-end justify-center overflow-hidden rounded-[22px] bg-[#1d1910] md:h-[640px] md:rounded-[40px]">
            <div className="relative h-[92%] aspect-[434/660]">
              <Image
                src="/images/home/eli.jpg"
                alt="Eli, the boy at the center of the game"
                fill
                priority
                sizes="(max-width: 768px) 70vw, 420px"
                className="object-contain object-bottom [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]"
              />
            </div>
            {/* A warm glow behind Eli, echoing the light in his chest */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute mix-blend-screen left-1/2 top-[55%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(214,191,142,0.16),transparent)]"
            />
          </div>
        }
      />
    </SitePage>
  );
}
