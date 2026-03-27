"use client";

import { useState } from "react";
import { Shuffle, Loader2, Play } from "lucide-react";

const samplePrompts = [
  "A drone flying over misty mountains at dawn, cinematic",
  "Abstract fluid neon simulation, vibrant colors",
  "Time-lapse of a city street at night, rain reflections",
  "Ocean waves crashing on a rocky shore, slow motion",
  "A campfire in a forest at night, sparks flying",
  "Cherry blossoms falling in the wind, spring morning",
];

const videoThumbnails = [
  "https://images.unsplash.com/photo-1536240478700-b869ad10a2ab?w=600&q=80",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  "https://images.unsplash.com/photo-1516616370751-86d6bd8b0651?w=600&q=80",
];

interface GeneratedVideo {
  id: string;
  thumbnail: string;
  prompt: string;
  model: string;
  duration: string;
  createdAt: Date;
}

export default function VideoToolPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("Veo 3");
  const [generating, setGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [error, setError] = useState("");

  const randomPrompt = () => {
    setPrompt(samplePrompts[Math.floor(Math.random() * samplePrompts.length)]);
    setError("");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    setError("");
    setGenerating(true);

    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1500));

    const thumbnail =
      videoThumbnails[Math.floor(Math.random() * videoThumbnails.length)];

    const newVideo: GeneratedVideo = {
      id: `vid-${Date.now()}`,
      thumbnail,
      prompt: prompt.trim(),
      model: selectedModel,
      duration: `${Math.floor(Math.random() * 10) + 5}s`,
      createdAt: new Date(),
    };

    setGeneratedVideos((prev) => [newVideo, ...prev]);
    setGenerating(false);
  };

  const models = ["Veo 3", "Kling", "Hailuo", "Wan", "Runway"];

  return (
    <div className="h-full bg-[#0f0f0f] overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">🎬</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">AI Video Generator</h1>
            <p className="text-gray-500 text-sm">
              Generate videos from text descriptions
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
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
            }}
            placeholder="Describe the video you want to generate... (Ctrl+Enter to generate)"
            className="w-full bg-transparent text-white text-sm resize-none outline-none min-h-[100px] placeholder-gray-600"
            rows={4}
          />
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
                {models.map((m) => (
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
                  ? "bg-yellow-900/40 text-yellow-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
              }`}
            >
              {generating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>✦ Generate Video</>
              )}
            </button>
          </div>
        </div>

        {generating && (
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-10 flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-white font-medium">Generating your video...</p>
              <p className="text-gray-500 text-sm mt-1">
                Using {selectedModel} model
              </p>
            </div>
          </div>
        )}

        {generatedVideos.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-sm font-semibold mb-3">
              Generated Videos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedVideos.map((video) => (
                <div
                  key={video.id}
                  className="group relative rounded-xl overflow-hidden aspect-video"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                      <Play size={20} className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                      <p className="text-white text-xs line-clamp-1 flex-1 mr-2">
                        {video.prompt}
                      </p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                          {video.model}
                        </span>
                        <span className="text-xs text-gray-400">
                          {video.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-white text-sm font-semibold mb-3">
            Example videos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videoThumbnails.map((img, i) => (
              <div
                key={i}
                className="aspect-video rounded-xl overflow-hidden relative group cursor-pointer"
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play size={20} className="text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 to-transparent">
                  <button
                    onClick={() =>
                      setPrompt(samplePrompts[i] || samplePrompts[0])
                    }
                    className="text-white text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
                  >
                    Use this prompt
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