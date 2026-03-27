"use client";

import { useState } from "react";

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState(
    "Abstract visuals of bright flares, woman walking in crowded street, hazy, cyberpunk"
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516616370751-86d6bd8b0651?w=1920&q=80')",
          filter: "brightness(0.4) saturate(1.5)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <span className="text-white text-xs">🎬</span>
          <span className="text-white text-sm font-medium">Generate Video</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-4 max-w-3xl">
          AI Video Generator for Realism, Speed &amp; Creativity.
        </h1>
        <p className="text-gray-300 text-center max-w-lg mb-10 text-base">
          Generate AI videos with Veo, Sora, Wan, Kling and more, all in one
          place. Start creating for free.
        </p>

        <div className="w-full max-w-2xl bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-transparent text-white text-base resize-none outline-none min-h-[80px]"
            placeholder="Describe the video you want to generate..."
          />
          <div className="flex justify-end mt-3">
            <button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black text-sm font-semibold px-6 py-3 rounded-full transition-colors">
              <span>✦</span> Generate
            </button>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <p className="text-gray-400 text-sm">Powered by:</p>
          {["Veo 3", "Kling", "Hailuo", "Wan", "Runway"].map((model) => (
            <span
              key={model}
              className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full border border-white/10"
            >
              {model}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}