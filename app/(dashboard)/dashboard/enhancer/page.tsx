"use client";

import { useState, useRef } from "react";
import { Upload, Wand2, Download, ZoomIn } from "lucide-react";

export default function EnhancerToolPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setOriginalImage(dataUrl);
      setFileName(file.name);
      setEnhancedImage(null);
      simulateUpscale(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const simulateUpscale = async (imageUrl: string) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setEnhancedImage(imageUrl);
    setIsProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDownload = () => {
    if (!enhancedImage) return;
    const a = document.createElement("a");
    a.href = enhancedImage;
    a.download = `upscaled-${fileName}`;
    a.click();
  };

  return (
    <div className="h-full bg-[#0f0f0f] overflow-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center">
            <Wand2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">AI Image Enhancer & Upscaler</h1>
            <p className="text-gray-500 text-sm">Upscale images up to 22K resolution</p>
          </div>
        </div>

        {!originalImage ? (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-20 flex flex-col items-center justify-center cursor-pointer transition-all mb-8 ${
                isDragging
                  ? "border-blue-500 bg-blue-900/10"
                  : "border-white/10 hover:border-blue-500/40 hover:bg-blue-900/5 bg-[#1a1a1a]"
              }`}
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <Upload size={28} className="text-gray-400" />
              </div>
              <p className="text-white font-semibold text-lg mb-2">
                Drop your image here
              </p>
              <p className="text-gray-500 text-sm mb-4">
                or click to browse — jpg, png, webp
              </p>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors">
                <Upload size={14} />
                Upload to upscale
              </button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "22K", desc: "Max resolution" },
                { label: "7 Models", desc: "Upscaling options" },
                { label: "< 5s", desc: "Processing time" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 text-center"
                >
                  <p className="text-2xl font-bold text-white">{stat.label}</p>
                  <p className="text-gray-500 text-xs mt-1">{stat.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                {isProcessing ? "Processing..." : enhancedImage ? "Upscaled successfully" : "Uploading..."}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setOriginalImage(null); setEnhancedImage(null); setFileName(""); }}
                  className="px-4 py-2 bg-white/10 text-white text-sm rounded-xl hover:bg-white/15 transition-colors"
                >
                  Upload New
                </button>
                {enhancedImage && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-colors"
                  >
                    <Download size={14} />
                    Download
                  </button>
                )}
              </div>
            </div>

            {isProcessing ? (
              <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center" style={{ minHeight: 400 }}>
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white font-medium">Upscaling image...</p>
                  <p className="text-gray-500 text-sm mt-1">This usually takes 2-5 seconds</p>
                </div>
              </div>
            ) : enhancedImage ? (
              <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 relative" style={{ minHeight: 400 }}>
                <div className="relative overflow-hidden select-none" style={{ minHeight: 400 }}>
                  <img
                    src={enhancedImage}
                    alt="Enhanced"
                    className="w-full object-contain"
                    style={{ maxHeight: 500 }}
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  >
                    <img
                      src={originalImage!}
                      alt="Original"
                      className="w-full object-contain"
                      style={{ maxHeight: 500, filter: "brightness(0.7)" }}
                    />
                    <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      Before
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    After
                  </div>
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <ZoomIn size={12} className="text-black" />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                  />
                </div>
                <div className="p-4 flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    Original: {fileName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    Upscaled (4x)
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}