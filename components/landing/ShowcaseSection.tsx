"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const showcaseItems = [
  {
    id: 1,
    title: "Krea 1",
    prompt: '"Cinematic photo of a person in a linen jacket"',
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    badge: "Krea 1",
  },
  {
    id: 2,
    title: "Veo 3",
    prompt: '"An animated capybara talking about NextFlow"',
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80",
    badge: "Veo 3",
  },
  {
    id: 3,
    title: "Topaz Upscaler",
    prompt: "Upscale image 512px → 8K",
    image: "https://images.unsplash.com/photo-1542038374-eeea9b8cc04e?w=600&q=80",
    badge: "Topaz Upscaler",
    isUpscale: true,
  },
  {
    id: 4,
    title: "Hailuo",
    prompt:
      '"Advertising sandwich with exploding layers"',
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    badge: "Hailuo",
    hasAnimateButton: true,
  },
];

export function ShowcaseSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + showcaseItems.length) % showcaseItems.length);
  const next = () =>
    setCurrentIndex((i) => (i + 1) % showcaseItems.length);

  const visibleItems = [
    showcaseItems[currentIndex % showcaseItems.length],
    showcaseItems[(currentIndex + 1) % showcaseItems.length],
    showcaseItems[(currentIndex + 2) % showcaseItems.length],
  ];

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-stretch gap-4 overflow-hidden">
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              className={`relative rounded-2xl overflow-hidden flex-1 min-h-[480px] ${
                index === 0 ? "block" : index === 1 ? "block" : "hidden lg:block"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${item.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-black text-xs font-bold">✦</span>
                  </div>
                  <span className="text-white text-xs font-medium">
                    {item.badge}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                {item.hasAnimateButton && (
                  <div className="mb-2">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      Animate image
                    </span>
                  </div>
                )}
                <p className="text-gray-300 text-xs uppercase tracking-wider mb-1">
                  PROMPT
                </p>
                {item.isUpscale ? (
                  <p className="text-white text-2xl font-bold">{item.prompt}</p>
                ) : (
                  <p className="text-white text-xl font-semibold leading-tight">
                    {item.prompt}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}