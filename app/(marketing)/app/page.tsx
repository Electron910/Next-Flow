"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const toolCards = [
  {
    title: "Generate Image",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
    href: "/image-generator",
    icon: "🖼",
    color: "bg-blue-500",
  },
  {
    title: "Generate Video",
    image: "https://images.unsplash.com/photo-1536240478700-b869ad10a2ab?w=400&q=80",
    href: "/video-generator",
    icon: "🎬",
    color: "bg-yellow-500",
  },
  {
    title: "Upscale & Enhance",
    image: "https://images.unsplash.com/photo-1542038374-eeea9b8cc04e?w=400&q=80",
    href: "/upscale",
    icon: "✨",
    color: "bg-gray-700",
  },
  {
    title: "Realtime",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    href: "/sign-up",
    icon: "⚡",
    color: "bg-teal-500",
  },
];

const navItems = [
  { label: "Home", href: "#", icon: "🏠", active: true },
  { label: "Train Lora", href: "/sign-up", icon: "🎨" },
  { label: "Node Editor", href: "/sign-up", icon: "🔷" },
  { label: "Assets", href: "/sign-up", icon: "📁" },
];

const toolItems = [
  { label: "Image", href: "/image-generator", icon: "🖼", color: "bg-blue-500" },
  { label: "Video", href: "/video-generator", icon: "🎬", color: "bg-yellow-500" },
  { label: "Enhancer", href: "/upscale", icon: "✂️", color: "bg-gray-600" },
  { label: "Nano Banana", href: "/sign-up", icon: "🍌", color: "bg-yellow-400" },
  { label: "Realtime", href: "/sign-up", icon: "⚡", color: "bg-teal-500" },
  { label: "Edit", href: "/sign-up", icon: "✏️", color: "bg-purple-500" },
];

export default function AppPreviewPage() {
  const [currentCard, setCurrentCard] = useState(0);

  return (
    <div className="flex h-screen bg-[#0f0f0f] overflow-hidden pt-16">
      <div className="w-64 bg-[#1a1a1a] border-r border-white/5 flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between p-3 border-b border-white/5">
          <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <span className="text-sm">⊟</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <p className="px-3 text-xs text-gray-600 uppercase tracking-wider mb-2">
              Tools
            </p>
            <div className="space-y-0.5">
              {toolItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <div
                    className={`w-5 h-5 ${item.color} rounded-md flex items-center justify-center text-xs`}
                  >
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </Link>
              ))}
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-400 transition-colors w-full">
                <span>···</span>
                <span>More</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 p-3 space-y-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-3">
            <p className="text-white text-xs font-medium mb-2">
              Earn 3,000 Credits
            </p>
            <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors">
              Upgrade
            </button>
          </div>
          <Link
            href="/sign-in"
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl">
          <div className="rounded-2xl overflow-hidden mb-6 relative min-h-[280px] bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 flex flex-col items-center justify-center">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="relative z-10 text-center px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Start by generating a free image
              </h2>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/sign-up"
                  className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Generate Image →
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors border border-white/30"
                >
                  Generate Video →
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mb-4 gap-2">
            <button
              onClick={() =>
                setCurrentCard((i) => (i - 1 + toolCards.length) % toolCards.length)
              }
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentCard((i) => (i + 1) % toolCards.length)}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {toolCards.map((card) => (
              <Link key={card.title} href={card.href}>
                <div className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url('${card.image}')` }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div
                      className={`w-7 h-7 ${card.color} rounded-lg flex items-center justify-center mb-2 text-sm`}
                    >
                      {card.icon}
                    </div>
                    <p className="text-white text-sm font-semibold">
                      {card.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="text-white text-sm">
                  Upscale images &amp; videos to 22K
                </p>
                <p className="text-white text-sm">Lora fine-tuning</p>
                <p className="text-white text-sm">Access all 150+ models</p>
                <p className="text-white text-sm">Ultra fast &amp; no throttling</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  <span className="text-white">Try </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Max
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}