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
    title: "I've been using AI heavily at work and in my personal projects — and honestly, it's been confusing.",
    date: "Mar 27, 2026",
    tag: "AI + UX",
    image: "/images/1.Article.png",
    href: "https://jmariano19.substack.com/p/ive-been-using-ai-heavily-at-work",
    featured: true,
  },
  {
    title: "The Human-Centered Future of AI in Retail",
    date: "Aug 10, 2025",
    tag: "AI Design",
    image: "/images/2.Article.png",
    href: "https://jmariano19.substack.com/p/the-human-centered-future-of-ai-in?r=gv4h7&utm_campaign=post&utm_medium=web&triedRedirect=true",
  },
  {
    title: "Designing for Trust: When AI Gets It Wrong",
    date: "Jul 2025",
    tag: "UX Research",
    image: "/images/3.Article.png",
    href: "#",
  },
  {
    title: "The Invisible Interface: Conversational AI and the End of Screens",
    date: "Jun 2025",
    tag: "Product Design",
    image: "/images/4.Article.png",
    href: "#",
  },
  {
    title: "Health AI and the Hispanic Community: What the Data Won't Tell You",
    date: "May 2025",
    tag: "AI + Health",
    image: "/images/5.Article.png",
    href: "#",
  },
  {
    title: "Modular Systems Thinking: Why Your Design Process Is Already an AI",
    date: "Apr 2025",
    tag: "Systems Design",
    image: "/images/1.Article.png",
    href: "#",
  },
];

export default function Articles() {
  return (
    <div className="min-h-screen bg-cream max-w-[1440px] mx-auto">
      <Nav />

      {/* Hero */}
      <section className="px-5 md:px-28 pt-8 md:pt-14 pb-10 md:pb-14">
        <FadeUp delay={0.2}>
          <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[33px] md:text-[45px] leading-[40px] md:leading-[52px] text-green-heading mb-6 md:mb-8 max-w-[900px]">
            <strong>Designing AI systems people trust — from experimentation to real-world adoption.</strong>
          </h1>
        </FadeUp>
        <FadeUp delay={0.4}>
          <div className="font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[35px] text-black/50 max-w-[782px] flex flex-col gap-4">
            <p>I design and test AI-powered experiences at both enterprise scale and from scratch—focused on what actually works, what breaks, and how people respond in real use.</p>
            <p>Through hands-on experiments, I&apos;m learning what it takes to make AI systems not just functional, but trustworthy.</p>
          </div>
        </FadeUp>
      </section>

      <ArticlesClient articles={articles} />

      <Footer />
    </div>
  );
}
