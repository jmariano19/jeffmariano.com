"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import FadeUp from "@/components/FadeUp";

export interface Article {
  title: string;
  date: string;
  tag: string;
  image: string;
  href: string;
  featured?: boolean;
}

function ArticleImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
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

function ArticleOverlay({
  article,
  onClose,
}: {
  article: Article;
  onClose: () => void;
}) {
  const [content, setContent] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setContent(null);

    fetch(`/api/article?url=${encodeURIComponent(article.href)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setContent(data.content);
          setDescription(data.description);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [article.href]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-8"
        onClick={onClose}
      >
        <motion.div
          key="overlay-panel"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-3xl bg-white rounded-[18px] overflow-hidden shadow-2xl flex flex-col"
          style={{ height: "88vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-7 py-5 border-b border-black/10 shrink-0">
            <div className="pr-4">
              <p className="font-[family-name:var(--font-lato)] text-xs text-black/40 uppercase tracking-widest mb-1">
                {article.tag} · {article.date}
              </p>
              <p className="font-[family-name:var(--font-playfair)] text-lg md:text-xl font-bold text-green-heading leading-tight">
                {article.title}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 mt-1">
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-lato)] text-xs text-black/50 hover:text-black transition-colors underline underline-offset-2 whitespace-nowrap"
              >
                Open in Substack ↗
              </a>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/8 hover:bg-black/15 transition-colors text-black/60 hover:text-black text-base leading-none"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 px-7 md:px-10 py-8">
            {loading && (
              <div className="flex items-center justify-center h-40 text-black/30 text-sm font-[family-name:var(--font-roboto)]">
                Loading article…
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center h-40 gap-4 text-center">
                <p className="text-black/40 text-sm font-[family-name:var(--font-roboto)]">
                  Couldn&apos;t load the article inline.
                </p>
                <a
                  href={article.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-lato)] text-sm font-bold text-green-heading underline underline-offset-2"
                >
                  Read on Substack ↗
                </a>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Description / subtitle */}
                {description && (
                  <p className="font-[family-name:var(--font-playfair)] italic text-lg md:text-xl text-black/60 leading-relaxed mb-8 border-l-4 border-green-heading/20 pl-5">
                    {description}
                  </p>
                )}

                {/* Article body */}
                {content ? (
                  <div
                    className="prose prose-lg max-w-none font-[family-name:var(--font-roboto)] text-black/80 leading-relaxed
                      [&_h1]:font-[family-name:var(--font-playfair)] [&_h1]:text-green-heading [&_h1]:font-bold
                      [&_h2]:font-[family-name:var(--font-playfair)] [&_h2]:text-green-heading [&_h2]:font-bold
                      [&_h3]:font-[family-name:var(--font-playfair)] [&_h3]:text-green-heading
                      [&_a]:text-green-heading [&_a]:underline [&_img]:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 text-center py-8">
                    <p className="text-black/40 text-sm font-[family-name:var(--font-roboto)]">
                      Article preview not available.
                    </p>
                    <a
                      href={article.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[family-name:var(--font-lato)] text-sm font-bold text-green-heading underline underline-offset-2"
                    >
                      Read on Substack ↗
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  const [open, setOpen] = useState<Article | null>(null);
  const [featured, ...rest] = articles;

  function handleClick(article: Article) {
    if (article.href && article.href !== "#") {
      setOpen(article);
    }
  }

  return (
    <>
      {/* Featured article */}
      <section className="px-5 md:px-28 mb-6 md:mb-8">
        <FadeUp>
          <button
            onClick={() => handleClick(featured)}
            className="block w-full text-left group cursor-pointer"
          >
            <div className="relative w-full aspect-[1151/412] overflow-hidden rounded-[18px]">
              <ArticleImage src={featured.image} alt={featured.title} priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6 md:right-12">
                <p className="font-[family-name:var(--font-lato)] text-xs md:text-sm text-white/70 mb-2 uppercase tracking-widest">
                  {featured.tag} · {featured.date}
                </p>
                <h2 className="font-[family-name:var(--font-playfair)] text-[22px] md:text-[36px] font-normal leading-[1.15] text-white max-w-[560px] group-hover:opacity-90 transition-opacity line-clamp-3">
                  {featured.title}
                </h2>
              </div>
            </div>
          </button>
        </FadeUp>
      </section>

      {/* Article list */}
      <section className="px-5 md:px-28 pb-16 md:pb-24 flex flex-col gap-6 md:gap-8">
        {rest.map((article, i) => (
          <FadeUp key={article.title} delay={i * 0.05}>
            <button
              onClick={() => handleClick(article)}
              className={`block w-full text-left group ${article.href !== "#" ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className="relative w-full aspect-[1151/412] overflow-hidden rounded-[18px]">
                <ArticleImage src={article.image} alt={article.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 right-6 md:right-12">
                  <p className="font-[family-name:var(--font-lato)] text-xs md:text-sm text-white/70 mb-2 uppercase tracking-widest">
                    {article.tag} · {article.date}
                  </p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-[22px] md:text-[36px] font-normal leading-[1.15] text-white max-w-[560px] group-hover:opacity-90 transition-opacity line-clamp-2">
                    {article.title}
                  </h2>
                </div>
              </div>
            </button>
          </FadeUp>
        ))}
      </section>

      {/* Overlay */}
      {open && <ArticleOverlay article={open} onClose={() => setOpen(null)} />}
    </>
  );
}
