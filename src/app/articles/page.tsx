import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import ArticlesClient from "@/components/ArticlesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles — Jeff Mariano",
  description:
    "Thoughts on AI design, human-centered technology, and the future of intelligent systems.",
};

const articles = [
  {
    title: "The Human-Centered Future of AI in Retail",
    date: "Aug 10, 2025",
    tag: "AI Design",
    image: "/images/1.Article.png",
    href: "https://jmariano19.substack.com/p/the-human-centered-future-of-ai-in?r=gv4h7&utm_campaign=post&utm_medium=web&triedRedirect=true",
    featured: true,
  },
  {
    title: "Designing for Trust: When AI Gets It Wrong",
    date: "Jul 2025",
    tag: "UX Research",
    image: "/images/2.Article.png",
    href: "#",
  },
  {
    title: "The Invisible Interface: Conversational AI and the End of Screens",
    date: "Jun 2025",
    tag: "Product Design",
    image: "/images/3.Article.png",
    href: "#",
  },
  {
    title: "Health AI and the Hispanic Community: What the Data Won't Tell You",
    date: "May 2025",
    tag: "AI + Health",
    image: "/images/4.Article.png",
    href: "#",
  },
  {
    title: "Modular Systems Thinking: Why Your Design Process Is Already an AI",
    date: "Apr 2025",
    tag: "Systems Design",
    image: "/images/5.Article.png",
    href: "#",
  },
];

export default function Articles() {
  return (
    <div className="min-h-screen bg-cream max-w-[1440px] mx-auto">
      <Nav />

      {/* Hero */}
      <section className="px-5 md:px-28 pt-8 md:pt-14 pb-10 md:pb-14">
        <FadeUp>
          <h1 className="font-[family-name:var(--font-playfair)] text-[28px] md:text-[45px] font-normal leading-[1.15] text-green-heading mb-6 md:mb-8 max-w-[900px]">
            <strong>Where empathy meets intelligence — putting the human in AI.</strong>
          </h1>
        </FadeUp>
        <FadeUp>
          <p className="font-[family-name:var(--font-roboto)] text-[17px] md:text-[22px] leading-[1.8] md:leading-[45px] text-black/50 max-w-[782px]">
            I design emotionally aware, human–AI experiences that amplify human
            potential, blending deep UX expertise with emerging technologies to
            create intuitive, trustworthy, and transformative products that
            improve millions of lives.
          </p>
        </FadeUp>
      </section>

      <ArticlesClient articles={articles} />

      <Footer />
    </div>
  );
}
