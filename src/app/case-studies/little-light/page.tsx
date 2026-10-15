import Image from "next/image";
import type { Metadata } from "next";
import { SitePage } from "@/components/SiteChrome";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import { Chapter, StoryMap } from "@/components/case-study/Chapter";
import NextCaseStudies from "@/components/case-study/NextCaseStudies";
import {
  HealthFlow,
  LittleLightHero,
  MoodPicker,
  MoodVideo,
  Principles,
  Process,
  Questions,
  SignalMap,
} from "@/components/case-study/LittleLight";

export const metadata: Metadata = {
  title: "A Little Light — Jeff Mariano",
  description: "A personal experiment in light, character and everyday wellbeing: a companion lamp that responds to the rhythms of your day.",
  // Draft while the project is in progress.
  robots: { index: false, follow: false },
};

export default function LittleLight() {
  return (
    <SitePage>
      <CaseStudyHero
        tag="SIDE PROJECT · CONNECTED OBJECT · CONCEPT"
        title="A Little Light for Your Day"
        summary="What if the rhythms of your day could give a little character its personality? A companion lamp connected to your health app that responds to sleep, movement and routine through color, light and facial expressions."
        meta="Role: Designer & maker · character, animation, hardware | Platform: Screen prototype inside a lamp · health data | Status: Concept exploration"
        media={<LittleLightHero />}
      />

      <StoryMap
        items={[
          { id: "questions", n: "01", title: "The questions", line: "What a glance can say." },
          { id: "signals", n: "02", title: "Connected to your health", line: "Your day becomes its mood." },
          { id: "day", n: "03", title: "Moods", line: "Pick one. Watch it change." },
          { id: "principles", n: "04", title: "Principles", line: "Encouraging, never judging." },
          { id: "process", n: "05", title: "Process", line: "From character to object." },
        ]}
      />

      <Chapter
        id="questions"
        n="01"
        kicker="The experiment"
        title="Personal data you feel, not read"
        takeaway="Instead of another chart, a small character on your nightstand shows how your day is going."
      >
        <Questions />
      </Chapter>

      <Chapter
        id="signals"
        n="02"
        kicker="Connected to your health app"
        title="Your day becomes its mood"
        takeaway="The lamp connects to your health app. It follows your sleep, movement and routine, and its mood shifts with your natural behavior."
      >
        <div className="mb-3 overflow-hidden rounded-[22px] bg-[#3a2416] md:rounded-[36px]">
          <Image
            src="/images/case-studies/little-light/app-connect.webp"
            alt="The cat lamp glowing on a bedside table next to a phone showing its companion app, connected"
            width={1672}
            height={941}
            sizes="(max-width: 1440px) 100vw, 1304px"
            className="h-auto w-full"
          />
        </div>
        <HealthFlow />
        <SignalMap />
      </Chapter>

      <Chapter
        id="day"
        n="03"
        kicker="Interactive prototype"
        title="One face, many moods"
        takeaway="Each mood comes from your day. Pick one to see how the lamp responds."
      >
        <MoodVideo />
        <MoodPicker />
      </Chapter>

      <Chapter
        id="principles"
        n="04"
        kicker="Design principles"
        title="Encouraging, never judging"
        takeaway="It should feel like company, especially on the days you need rest."
      >
        <Principles />
      </Chapter>

      <Chapter
        id="process"
        n="05"
        kicker="Process · in progress"
        title="From character to object"
        takeaway="Personality first, then behaviors on a screen, then the lamp, then real data."
      >
        <Process />
      </Chapter>

      <NextCaseStudies
        studies={[
          {
            company: "Side project",
            title: "Eli's Last Experiment",
            image: "/images/home/eli-card-bg.webp",
            href: "/case-studies/eli-last-experiment",
          },
          {
            company: "Verizon",
            title: "One AI Canvas for Every Way Reps Help Customers",
            image: "/images/case-studies/canvas/hero-bg.webp",
            href: "/case-studies/ai-conversational-canvas",
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
