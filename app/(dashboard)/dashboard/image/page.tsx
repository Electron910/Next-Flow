"use client";

import { useState } from "react";
import { Shuffle, Download, Loader2 } from "lucide-react";

const samplePrompts = [
  "A cinematic portrait in golden hour light, photorealistic",
  "Abstract geometric neon shapes on dark background",
  "A serene mountain lake at sunrise, misty atmosphere",
  "Futuristic cityscape with flying vehicles at night",
  "Macro photography of a colorful butterfly wing",
  "A cozy cabin in a snowy forest, warm light inside",
];

const sampleResults = [
  "https://images.unsplash.com/photo-1679678691006-0ad24fecb769?w=600&q=80",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80",
  "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=600&q=80",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
];

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}

export default function ImageToolPage() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [selectedModel, setSelectedModel] = useState("Krea 1");
  const [error, setError] = useState("");

  const randomPrompt = () => {
    const p = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
    setPrompt(p);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    setError("");
    setGenerating(true);

    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

    const randomImage =
      sampleResults[Math.floor(Math.random() * sampleResults.length)];

    const newImage: GeneratedImage = {
      id: `img-${Date.now()}`,
      url: randomImage,
      prompt: prompt.trim(),
      createdAt: new Date(),
    };

    setGeneratedImages((prev) => [newImage, ...prev]);
    setGenerating(false);
  };

  const handleDownload = (img: GeneratedImage) => {
    const a = document.createElement("a");
    a.href = img.url;
    a.download = `generated-${img.id}.jpg`;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="h-full bg-[#0f0f0f] overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">🖼</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">AI Image Generator</h1>
            <p className="text-gray-500 text-sm">
              Generate stunning images from text
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5 mb-6">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleGenerate();
              }
            }}
            placeholder="Describe the image you want to generate... (Ctrl+Enter to generate)"
            className="w-full bg-transparent text-white text-sm resize-none outline-none min-h-[100px] placeholder-gray-600"
            rows={4}
          />
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
                {["1:1", "3:4", "16:9", "4:3"].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setSelectedRatio(ratio)}
                    className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                      selectedRatio === ratio
                        ? "bg-white text-black font-medium"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
                {["Krea 1", "Flux", "SDXL"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedModel(m)}
                    className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                      selectedModel === m
                        ? "bg-white text-black font-medium"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <button
                onClick={randomPrompt}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Shuffle size={12} />
                Random
              </button>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                generating
                  ? "bg-blue-900/40 text-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {generating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>✦ Generate</>
              )}
            </button>
          </div>
        </div>

        {generating && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center animate-pulse"
              >
                <div className="text-center">
                  <Loader2
                    size={24}
                    className="text-blue-400 animate-spin mx-auto mb-2"
                  />
                  <p className="text-gray-600 text-xs">Generating...</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {generatedImages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-sm font-semibold mb-3">
              Generated Images
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {generatedImages.map((img) => (
                <div
                  key={img.id}
                  className="group relative rounded-xl overflow-hidden aspect-square"
                >
                  <img
                    src={img.url}
                    alt={img.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end justify-between p-3">
                    <button
                      onClick={() => handleDownload(img)}
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Download size={14} className="text-white" />
                    </button>
                    <p className="text-white text-xs line-clamp-2 text-left w-full">
                      {img.prompt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-white text-sm font-semibold mb-3">
            Example outputs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sampleResults.map((img, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform group relative"
              >
                <img
                  src={img}
                  alt={`Example ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setPrompt(samplePrompts[i] || samplePrompts[0])}
                    className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-lg"
                  >
                    Use prompt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}