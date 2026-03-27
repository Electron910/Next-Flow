"use client";

import Link from "next/link";

export function UseCasesSection() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm text-gray-400 mb-2">Use cases</p>
        <h2 className="text-4xl font-bold text-black mb-12 max-w-2xl">
          Generate or edit high quality images, videos, and 3D objects with AI
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-12">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                AI Video Generation
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Access all of the most powerful AI video models including Veo 3,
                Kling, Hailuo, Wan, and Runway. Generate viral videos for social
                media, animate static images, or add new details to existing
                videos.
              </p>
              <Link
                href="/video-generator"
                className="inline-block px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                Try AI Video Generation
              </Link>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Image Upscaling
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enhance and upscale images up to a 22K resolution. Make blurry
                photos razor-sharp, turn simple 3D renders into photo-like
                architecture visualizations, restore old film scans, or add
                ultra-fine skin textures to your portraits.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Real-time rendering
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                The market leader in realtime image generation for Creatives.
                Turn easy-to-control primitives into photorealistic images in
                less than 50ms.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80')",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  {["4:3", "3:2", "16:9", "2.35:1"].map((ratio) => (
                    <button
                      key={ratio}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        ratio === "16:9"
                          ? "bg-[#84934A] text-white border-[#84934A]"
                          : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {["1:1", "4:5"].map((ratio) => (
                    <button
                      key={ratio}
                      className="text-xs px-3 py-1 rounded-full border bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors"
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
                <div className="mt-2 bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-white text-sm">Photo of a person...</p>
                  <div className="flex items-center gap-2 mt-2">
                    {["Style", "Image prompt", "Image style", "2:3", "1K", "Raw"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="text-xs text-white/70 bg-white/10 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}