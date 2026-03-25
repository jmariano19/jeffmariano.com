import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import Link from "next/link";
import Image from "next/image";
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
    image: "/images/articles/ai-retail.jpg",
    href: "#",
    featured: true,
  },
  {
    title: "Designing for Trust: When AI Gets It Wrong",
    date: "Jul 2025",
    tag: "UX Research",
    image: "/images/articles/ai-trust.jpg",
    href: "#",
  },
  {
    title: "The Invisible Interface: Conversational AI and the End of Screens",
    date: "Jun 2025",
    tag: "Product Design",
    image: "/images/articles/conversational-ai.jpg",
    href: "#",
  },
  {
    title: "Health AI and the Hispanic Community: What the Data Won't Tell You",
    date: "May 2025",
    tag: "AI + Health",
    image: "/images/articles/health-ai.jpg",
    href: "#",
  },
  {
    title: "Modular Systems Thinking: Why Your Design Process Is Already an AI",
    date: "Apr 2025",
    tag: "Systems Design",
    image: "/images/articles/modular-systems.jpg",
    href: "#",
  },
];

function ArticleImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  // Fallback bg shows when image file doesn't exist yet
  return (
    <div className="absolute inset-0 bg-[#2a2a2a]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        unoptimized
      />
    </div>
  );
}

export default function Articles() {
  const [featured, ...rest] = articles;

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


      {/* Featured article */}
      <section className="px-5 md:px-28 mb-6 md:mb-8">
        <FadeUp>
          <Link href={featured.href} className="block group">
            <div className="relative w-full aspect-[1151/412] overflow-hidden rounded-[6px]">
              <ArticleImage
                src={featured.image}
                alt={featured.title}
                priority
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Title overlay */}
              <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10 right-8 md:right-16">
                <p className="font-[family-name:var(--font-lato)] text-xs md:text-sm text-white/70 mb-2 uppercase tracking-widest">
                  {featured.tag} · {featured.date}
                </p>
                <h2 className="font-[family-name:var(--font-playfair)] text-[28px] md:text-[51px] font-normal leading-[1.1] text-white max-w-[600px] group-hover:opacity-90 transition-opacity">
                  {featured.title}
                </h2>
              </div>
            </div>
          </Link>
        </FadeUp>
      </section>

      {/* Article list */}
      <section className="px-5 md:px-28 pb-16 md:pb-24 flex flex-col gap-6 md:gap-8">
        {rest.map((article, i) => (
          <FadeUp key={article.title} delay={i * 0.05}>
            <Link href={article.href} className="block group">
              <div className="relative w-full aspect-[1151/412] overflow-hidden rounded-[6px]">
                <ArticleImage src={article.image} alt={article.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6 md:right-12">
                  <p className="font-[family-name:var(--font-lato)] text-xs md:text-sm text-white/70 mb-2 uppercase tracking-widest">
                    {article.tag} · {article.date}
                  </p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-[22px] md:text-[36px] font-normal leading-[1.15] text-white max-w-[560px] group-hover:opacity-90 transition-opacity">
                    {article.title}
                  </h2>
                </div>
              </div>
            </Link>
          </FadeUp>
        ))}
      </section>

      <Footer />
    </div>
  );
}
