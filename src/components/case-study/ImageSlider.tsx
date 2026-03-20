"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageSliderProps {
  images: string[];
  label?: string;
}

export default function ImageSlider({ images, label }: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % images.length);
  };

  return (
    <div className="bg-[#e6e2d6] rounded-[20px] mt-10 p-6 md:p-10">
      {label && (
        <p className="font-[family-name:var(--font-roboto)] font-bold text-sm md:text-base text-gray-text text-center mb-6">
          {label}
        </p>
      )}

      <div className="relative flex items-center gap-4">
        {/* Prev arrow */}
        <button
          onClick={prev}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-white/70 hover:bg-white transition-colors flex items-center justify-center shadow-sm"
          aria-label="Previous"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="#363636" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative flex-1 rounded-[10px] overflow-hidden bg-white/30" style={{ minHeight: 300 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full"
            >
              <Image
                src={images[current]}
                alt={`Slide ${current + 1}`}
                width={1400}
                height={900}
                className="w-full h-auto object-contain rounded-[10px]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-white/70 hover:bg-white transition-colors flex items-center justify-center shadow-sm"
          aria-label="Next"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="#363636" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-green-heading" : "bg-gray-text/30"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
