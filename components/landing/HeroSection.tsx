"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80')",
          filter: "brightness(0.3)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-16">
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight max-w-4xl mb-6">
          <span className="text-[#84934A]">NextFlow</span> is the world&apos;s
          most powerful{" "}
          <span className="text-white">creative AI suite.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
          Build, run, and orchestrate LLM workflows visually. Connect nodes,
          chain AI models, and automate your creative process.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-up"
            className="px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors text-base"
          >
            Start for free
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors text-base border border-white/20 backdrop-blur-sm"
          >
            Launch App
          </Link>
        </div>

        <div className="mt-16 max-w-3xl w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-[#1a1a1a] p-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="flex-1 bg-[#2a2a2a] rounded-md mx-4 h-6 flex items-center px-3">
              <span className="text-gray-400 text-xs">
                nextflow.app/workflow
              </span>
            </div>
          </div>
          <div className="bg-[#0f0f0f] aspect-video relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full opacity-30"
                style={{
                  backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>
            <div className="relative z-10 bg-gradient-to-r from-[#84934A] to-[#492828] rounded-2xl px-12 py-6 text-white text-xl font-semibold shadow-2xl">
              Let&apos;s create something
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}