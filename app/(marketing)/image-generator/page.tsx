"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";

const sampleImages = [
  "https://images.unsplash.com/photo-1679678691006-0ad24fecb769?w=400&q=80",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80",
  "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=400&q=80",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80",
];

const samplePrompts = [
  "A beautiful wallpaper of an indigenous person wearing intricate clothes",
  "Cinematic photo of a neon-lit cyberpunk street at night",
  "A serene mountain landscape at golden hour",
  "Abstract geometric shapes in vibrant colors",
];

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState(samplePrompts[0]);

  const randomPrompt = () => {
    const random = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setPrompt(random);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="relative overflow-hidden">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {sampleImages.slice(0, 4).map((img, i) => (
            <div
              key={i}
              className="w-20 h-20 rounded-xl overflow-hidden opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {sampleImages.slice(4).map((img, i) => (
            <div
              key={i}
              className="w-20 h-20 rounded-xl overflow-hidden opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen px-32 py-20">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-white text-xs">🖼</span>
            <span className="text-white text-sm font-medium">
              Text to Image Generator
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-4">
            AI Image Generator
          </h1>
          <p className="text-gray-400 text-center max-w-xl mb-10 text-base">
            Type any description and watch your ideas become high-quality images
            in seconds. With the best AI image generators all in one place,
            create professional pictures with precise controls to match your
            vision.
          </p>

          <div className="w-full max-w-2xl bg-[#1a1a1a] rounded-2xl p-4 border border-white/10">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent text-white text-base resize-none outline-none min-h-[80px]"
              placeholder="Describe the image you want to generate..."
            />
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={randomPrompt}
                className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
              >
                <Shuffle size={14} />
                Random prompt
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                <span>✦</span> Generate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 max-w-4xl w-full">
            {sampleImages.map((img, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}