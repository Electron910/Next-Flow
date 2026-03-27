"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Loader2 } from "lucide-react";

const realtimeImages = [
  "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=600&q=80",
  "https://images.unsplash.com/photo-1679678691006-0ad24fecb769?w=600&q=80",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
];

export default function RealtimePage() {
  const [prompt, setPrompt] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const imageIndexRef = useRef(0);

  useEffect(() => {
    if (!isLive || !prompt.trim()) {
      setCurrentImage(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsGenerating(true);

    debounceRef.current = setTimeout(() => {
      const img = realtimeImages[imageIndexRef.current % realtimeImages.length];
      imageIndexRef.current += 1;
      setCurrentImage(img);
      setIsGenerating(false);
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [prompt, isLive]);

  return (
    <div className="h-full bg-[#0f0f0f] overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
            <Clock size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Realtime Canvas</h1>
            <p className="text-gray-500 text-sm">
              Generate images in under 50ms as you type
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-400 text-xs font-medium">
                  Your Prompt
                </label>
                <span className="text-gray-600 text-xs">
                  {prompt.length} chars
                </span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  isLive
                    ? "Start typing to generate in realtime..."
                    : "Enable realtime mode then start typing..."
                }
                className="w-full bg-transparent text-white text-sm resize-none outline-none min-h-[150px] placeholder-gray-600"
                rows={6}
              />
            </div>

            <button
              onClick={() => {
                setIsLive(!isLive);
                if (!isLive) setCurrentImage(null);
              }}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                isLive
                  ? "bg-red-900/30 text-red-400 border border-red-800/30 hover:bg-red-900/50"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              {isLive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  Stop Realtime
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Start Realtime Generation
                </>
              )}
            </button>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "< 50ms", desc: "Generation time" },
                { label: "Live", desc: "Updates as you type" },
                { label: "Free", desc: "No credits needed" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#1a1a1a] rounded-xl p-3 border border-white/5 text-center"
                >
                  <p className="text-teal-400 font-bold text-sm">{stat.label}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden flex flex-col" style={{ minHeight: 400 }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <p className="text-gray-400 text-xs font-medium">Canvas Output</p>
              {isLive && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-teal-400 text-xs">LIVE</span>
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              {isGenerating ? (
                <div className="text-center">
                  <Loader2 size={32} className="text-teal-400 animate-spin mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Generating...</p>
                </div>
              ) : currentImage ? (
                <img
                  src={currentImage}
                  alt="Generated"
                  className="w-full h-full object-contain"
                  style={{ maxHeight: 380 }}
                />
              ) : (
                <div className="text-center px-8">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock size={28} className="text-gray-600" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    {isLive
                      ? "Start typing to see realtime generation"
                      : "Enable realtime mode to start generating"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}