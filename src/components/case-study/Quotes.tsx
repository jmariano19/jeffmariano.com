import FadeUp from "../FadeUp";
import GrowLine from "../GrowLine";

interface Quote {
  text: string;
  author: string | null;
  lines?: boolean;
}

interface QuotesProps {
  quotes: Quote[];
}

export default function Quotes({ quotes }: QuotesProps) {
  return (
    <section className="px-6 md:px-28 py-[40px]">
      <div className="flex flex-col gap-12">
        {quotes.map((quote, i) => (
          <FadeUp key={i} delay={i * 0.15}>
            {quote.author ? (
              <div className="flex gap-4 md:gap-6">
                <GrowLine className="w-2 md:w-3 bg-[#e6e0cf] rounded-sm shrink-0 self-stretch" />
                <div>
                  <p className="font-[family-name:var(--font-playfair)] italic text-[20px] md:text-[28px] leading-[28px] md:leading-[38px] text-gray-text">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <p className="mt-3 font-[family-name:var(--font-roboto)] text-sm text-brown">
                    — {quote.author}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center pt-[70px] pb-0">
                {quote.lines && <div className="w-full h-px bg-gray-text opacity-20 mb-[40px]" />}
                <p className="font-[family-name:var(--font-playfair)] italic text-[20px] md:text-[28px] leading-[28px] md:leading-[38px] text-gray-text">
                  &ldquo;{quote.text}&rdquo;
                </p>
                {quote.lines && <div className="w-full h-px bg-gray-text opacity-20 mt-[40px]" />}
              </div>
            )}
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
