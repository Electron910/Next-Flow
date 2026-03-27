"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function UpscalePage() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80')",
            }}
          />
          <div className="absolute inset-0 flex items-start justify-center pt-24 gap-8">
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
              Before
            </div>
            <div className="w-px h-full bg-white/30 absolute left-1/2" />
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
              After
            </div>
          </div>

          <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 max-w-xs">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=100&q=80"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-white text-xs font-medium">
                Drag and drop anywhere to start
              </p>
              <a href="#" className="text-blue-400 text-xs hover:underline">
                Upscale for free now
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center px-12 py-20">
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 w-fit mb-6">
            <span className="text-white text-xs">✦</span>
            <span className="text-white text-sm font-medium">Upscale Image</span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            AI Image Upscaler
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
            Make any photo high-resolution. Our AI-technology has upscaled
            hundreds of millions of images, keeping photos sharp and true to the
            original. Perfect for print, web, or display.
          </p>

          <div
            className={`bg-[#1a1a1a] rounded-2xl p-6 border-2 border-dashed transition-colors cursor-pointer ${
              isDragging ? "border-blue-500 bg-blue-900/10" : "border-white/10"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={() => setIsDragging(false)}
          >
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                <Upload size={16} />
                Upload to upscale
              </button>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <span>or drop a file</span>
                <span>paste image or URL</span>
              </div>
              <div className="ml-auto relative w-16 h-16">
                <div className="absolute bottom-0 left-0 w-12 h-12 rounded-lg overflow-hidden border-2 border-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100&q=80"
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 rounded-lg overflow-hidden border-2 border-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&q=80"
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-0 right-0 w-5 h-5 bg-white/80 rounded-bl-lg flex items-center justify-center">
                  <span className="text-black text-xs font-bold">↗</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-xs mt-4">
            By uploading an image or URL you agree to our{" "}
            <a href="#" className="underline hover:text-gray-400">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-gray-400">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}