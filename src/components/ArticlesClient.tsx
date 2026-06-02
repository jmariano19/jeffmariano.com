"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import FadeUp from "@/components/FadeUp";

export interface Article {
  title: string;
  date: string;
  tag: string;
  topic: string;
  summary: string;
  image: string;
  href: string;
  featured?: boolean;
  content?: string[];
}

function isPublished(article: Article) {
  return Boolean(article.content?.length || (article.href && article.href !== "#"));
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
        className="object-cover transition-transform duration-700 group-hover:scale-105"
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
  const hasLocalContent = Boolean(article.content?.length);
  const displayDescription = hasLocalContent ? article.summary : description;

  useEffect(() => {
    if (hasLocalContent) {
      return;
    }

    const controller = new AbortController();

    fetch(`/api/article?url=${encodeURIComponent(article.href)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setContent(data.content);
          setDescription(data.description);
        }
      })
      .catch((fetchError: unknown) => {
        if (!(fetchError instanceof DOMException && fetchError.name === "AbortError")) {
          setError(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [article.href, hasLocalContent]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      key="overlay-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:p-8"
      onClick={onClose}
    >
      <motion.div
        key="overlay-panel"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-cream shadow-2xl"
        style={{ height: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-5 border-b border-black/10 bg-cream-light px-6 py-5 md:px-8">
          <div>
            <p className="font-[family-name:var(--font-roboto)] text-xs font-bold uppercase tracking-[0.18em] text-gray-text/60">
              {article.tag} · {article.date}
            </p>
            <h2 className="mt-2 max-w-[680px] font-[family-name:var(--font-playfair)] text-xl font-bold leading-tight text-green-heading md:text-[30px]">
              {article.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close article preview"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/8 text-lg leading-none text-black/60 transition-colors hover:bg-black/15 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          {!hasLocalContent && loading && (
            <div className="flex h-48 items-center justify-center rounded-2xl bg-white/50 font-[family-name:var(--font-roboto)] text-sm text-black/40">
              Loading article preview...
            </div>
          )}

          {!hasLocalContent && error && (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-5 rounded-2xl bg-white/55 px-6 text-center">
              <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-green-heading">
                The inline preview is being shy.
              </p>
              <p className="max-w-[520px] font-[family-name:var(--font-roboto)] text-base leading-7 text-gray-text">
                Substack sometimes blocks previews, but the full article is available in a new tab.
              </p>
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-green-heading px-6 py-3 font-[family-name:var(--font-roboto)] text-sm font-bold text-white transition-opacity hover:opacity-85"
              >
                Read on Substack ↗
              </a>
            </div>
          )}

          {(hasLocalContent || (!loading && !error)) && (
            <>
              {(displayDescription || article.summary) && (
                <p className="mb-8 border-l-4 border-green-heading/25 pl-5 font-[family-name:var(--font-playfair)] text-lg italic leading-relaxed text-black/60 md:text-xl">
                  {displayDescription || article.summary}
                </p>
              )}

              {article.content?.length ? (
                <article className="mx-auto max-w-[720px] font-[family-name:var(--font-roboto)] text-[18px] leading-9 text-gray-text">
                  {article.content.map((paragraph) => {
                    const isStandaloneLine = [
                      "Amplify me. Don't replace me.",
                      "The foundation you build before the crisis determines what the crisis becomes.",
                      "The month before the crisis is the product.",
                      "AI doesn’t replace thinking. It exposes whether you did any.",
                      "Don’t bring a prompt. Bring a point of view.",
                      "That conversation broke my product.",
                      "Not the features—the assumptions.",
                      "Not ideal choices. Real ones.",
                      "Who are you actually building for?",
                    ].includes(paragraph);

                    return isStandaloneLine ? (
                      <p
                        key={paragraph}
                        className="my-10 border-y border-gray-text/20 py-8 text-center font-[family-name:var(--font-playfair)] text-[34px] font-bold italic leading-[42px] text-green-heading md:text-[46px] md:leading-[54px]"
                      >
                        {paragraph}
                      </p>
                    ) : (
                      <p key={paragraph} className="mb-6">
                        {paragraph}
                      </p>
                    );
                  })}
                </article>
              ) : content ? (
                <div
                  className="prose prose-lg max-w-none font-[family-name:var(--font-roboto)] leading-relaxed text-black/80
                    [&_a]:text-green-heading [&_a]:underline [&_h1]:font-[family-name:var(--font-playfair)] [&_h1]:font-bold [&_h1]:text-green-heading
                    [&_h2]:font-[family-name:var(--font-playfair)] [&_h2]:font-bold [&_h2]:text-green-heading
                    [&_h3]:font-[family-name:var(--font-playfair)] [&_h3]:text-green-heading [&_img]:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center gap-5 rounded-2xl bg-white/55 px-6 text-center">
                  <p className="font-[family-name:var(--font-roboto)] text-base text-gray-text">
                    Article preview not available here.
                  </p>
                  <a
                    href={article.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-roboto)] text-sm font-bold text-green-heading underline underline-offset-4"
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
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      data-ga-event="article_filter_click"
      data-ga-category="articles"
      data-ga-label={label}
      className={`rounded-full border px-5 py-2 font-[family-name:var(--font-roboto)] text-sm font-bold transition-colors ${
        active
          ? "border-green-heading bg-green-heading text-white"
          : "border-gray-text/25 text-gray-text hover:border-green-heading hover:text-green-heading"
      }`}
    >
      {label}
    </button>
  );
}

function ArticleCard({
  article,
  onClick,
}: {
  article: Article;
  onClick: () => void;
}) {
  const published = isPublished(article);

  return (
    <motion.button
      onClick={published ? onClick : undefined}
      data-ga-event={published ? "article_open" : "article_draft_click"}
      data-ga-category="articles"
      data-ga-label={article.title}
      className={`group flex h-full flex-col overflow-hidden rounded-[22px] bg-cream-light text-left shadow-[0_18px_45px_rgba(0,0,0,0.06)] transition-shadow ${
        published ? "cursor-pointer hover:shadow-[0_22px_55px_rgba(0,0,0,0.1)]" : "cursor-default"
      }`}
      whileHover={published ? { y: -4 } : undefined}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ArticleImage src={article.image} alt={article.title} />
        {!published && (
          <span className="absolute right-4 top-4 rounded-full bg-cream px-3 py-1 font-[family-name:var(--font-roboto)] text-xs font-bold text-green-heading">
            Coming soon
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-[family-name:var(--font-roboto)] text-xs font-bold uppercase tracking-[0.16em] text-gray-text/60">
          {article.tag} · {article.date}
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-[26px] font-bold leading-[32px] text-green-heading">
          {article.title}
        </h3>
        <p className="mt-4 flex-1 font-[family-name:var(--font-roboto)] text-base leading-7 text-gray-text">
          {article.summary}
        </p>
        <p className="mt-6 font-[family-name:var(--font-roboto)] text-sm font-bold text-green-heading">
          {published ? "Read essay ↗" : "Draft in progress"}
        </p>
      </div>
    </motion.button>
  );
}

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  const [open, setOpen] = useState<Article | null>(null);
  const [activeTopic, setActiveTopic] = useState("All");
  const [featured, ...rest] = articles;

  const topics = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((article) => article.topic)))],
    [articles],
  );

  const filteredArticles = useMemo(
    () =>
      activeTopic === "All"
        ? rest
        : rest.filter((article) => article.topic === activeTopic),
    [activeTopic, rest],
  );

  function handleClick(article: Article) {
    if (isPublished(article)) {
      setOpen(article);
    }
  }

  return (
    <>
      <section className="px-5 md:px-28 mb-10 md:mb-14">
        <FadeUp>
          <button
            onClick={() => handleClick(featured)}
            data-ga-event="article_open"
            data-ga-category="articles"
            data-ga-label={featured.title}
            className="group grid w-full overflow-hidden rounded-[26px] bg-cream-light text-left shadow-[0_22px_60px_rgba(0,0,0,0.08)] md:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="relative min-h-[320px] overflow-hidden md:min-h-full">
              <ArticleImage src={featured.image} alt={featured.title} priority />
              <div className="absolute left-5 top-5 rounded-full bg-cream px-4 py-2 font-[family-name:var(--font-roboto)] text-xs font-bold uppercase tracking-[0.14em] text-green-heading">
                Featured essay
              </div>
            </div>
            <div className="flex flex-col justify-center p-7 md:p-12">
              <p className="font-[family-name:var(--font-roboto)] text-xs font-bold uppercase tracking-[0.18em] text-gray-text/60">
                {featured.tag} · {featured.date}
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-[34px] font-bold leading-[40px] text-green-heading md:text-[52px] md:leading-[58px]">
                {featured.title}
              </h2>
              <p className="mt-6 font-[family-name:var(--font-roboto)] text-base leading-8 text-gray-text md:text-[18px]">
                {featured.summary}
              </p>
              <p className="mt-8 font-[family-name:var(--font-roboto)] text-base font-bold text-green-heading">
                Read on Substack ↗
              </p>
            </div>
          </button>
        </FadeUp>
      </section>

      <section className="px-5 md:px-28 pb-16 md:pb-24">
        <FadeUp>
          <div className="mb-8 flex flex-col gap-5 border-y border-gray-text/20 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-[family-name:var(--font-roboto)] text-sm font-bold uppercase tracking-[0.16em] text-gray-text/60">
                Writing archive
              </p>
              <p className="mt-2 font-[family-name:var(--font-roboto)] text-base leading-7 text-gray-text">
                Essays, field notes, and working thoughts on AI adoption.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <FilterButton
                  key={topic}
                  label={topic}
                  active={topic === activeTopic}
                  onClick={() => setActiveTopic(topic)}
                />
              ))}
            </div>
          </div>
        </FadeUp>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTopic}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
          >
            {filteredArticles.map((article, i) => (
              <FadeUp key={article.title} delay={i * 0.05}>
                <ArticleCard article={article} onClick={() => handleClick(article)} />
              </FadeUp>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {open && (
          <ArticleOverlay
            key={open.href}
            article={open}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
