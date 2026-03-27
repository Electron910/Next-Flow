"use client";

import { useState } from "react";
import { Zap, Loader2, Download } from "lucide-react";

const sampleImages = [
  "https://images.unsplash.com/photo-1569585723035-0e9e6ff87cbf?w=400&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=400&q=80",
  "https://images.unsplash.com/photo-1679678691006-0ad24fecb769?w=400&q=80",
];

const quickPrompts = [
  "A golden apple floating in space",
  "Neon banana in cyberpunk city",
  "Abstract colorful explosion",
  "Futuristic robot portrait",
];

interface GeneratedResult {
  id: string;
  url: string;
  prompt: string;
  timeMs: number;
}

export default function NanoBananaPage() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    setError("");
    setGenerating(true);
    const start = Date.now();

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const img = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    const elapsed = Date.now() - start;

    setResults((prev) => [
      { id: `nb-${Date.now()}`, url: img, prompt: prompt.trim(), timeMs: elapsed },
      ...prev,
    ]);
    setGenerating(false);
  };

  return (
    <div className="h-full bg-[#0f0f0f] overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-black" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Nano Banana</h1>
            <p className="text-gray-500 text-sm">
              Ultra-fast Gemini Flash image generation
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5 mb-4">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
            }}
            placeholder="Describe your image — ultra fast generation..."
            className="w-full bg-transparent text-white text-sm resize-none outline-none min-h-[80px] placeholder-gray-600"
            rows={3}
          />
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                <Zap size={10} /> Ultra Fast
              </span>
              <span className="text-gray-600 text-xs">~1-2s generation</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                generating
                  ? "bg-yellow-900/40 text-yellow-600 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 text-black"
              }`}
            >
              {generating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>✦ Generate Fast</>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {quickPrompts.map((qp) => (
            <button
              key={qp}
              onClick={() => setPrompt(qp)}
              className="text-xs text-gray-400 bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {results.length > 0 && (
          <div className="mb-8">
            <h3 className="text-white text-sm font-semibold mb-3">
              Generated Results
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {results.map((result) => (
                <div key={result.id} className="group relative rounded-xl overflow-hidden aspect-square">
                  <img src={result.url} alt={result.prompt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end justify-between p-3">
                    <div className="flex items-center gap-1">
                      <Zap size={10} className="text-yellow-400" />
                      <span className="text-yellow-400 text-xs">{result.timeMs}ms</span>
                    </div>
                    <p className="text-white text-xs line-clamp-2 text-left w-full">{result.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5">
          <h3 className="text-white text-sm font-semibold mb-3">
            Featured Models
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                name: "Nano Banana Pro",
                desc: "Smartest model. World's best prompt adherence. Best model for complex tasks.",
                tags: ["Featured"],
                image: sampleImages[0],
                speed: "⚡⚡⚡",
                cost: "◆◆◆",
              },
              {
                name: "Nano Banana 2",
                desc: "Google's latest Gemini Flash image model optimized for up to 4K generation.",
                tags: ["Featured", "New"],
                image: sampleImages[1],
                speed: "⚡⚡⚡",
                cost: "◆◆",
              },
            ].map((model) => (
              <div
                key={model.name}
                className="relative rounded-xl overflow-hidden h-48 cursor-pointer group"
              >
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute top-2 left-2 flex gap-1">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-bold">{model.name}</p>
                  <p className="text-gray-300 text-xs mt-0.5 line-clamp-2">{model.desc}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-yellow-400 text-xs">{model.speed}</span>
                    <span className="text-blue-400 text-xs">{model.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}