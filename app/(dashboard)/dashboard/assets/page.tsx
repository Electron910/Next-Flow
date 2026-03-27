"use client";

import { FolderOpen, Upload, Image, Video } from "lucide-react";

export default function AssetsPage() {
  return (
    <div className="h-full bg-[#0f0f0f] overflow-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FolderOpen size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Assets</h1>
              <p className="text-gray-500 text-sm">Manage your generated content</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/10 transition-colors">
            <Upload size={14} />
            Upload
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {["All", "Images", "Videos", "3D Models"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                tab === "All"
                  ? "bg-white text-black font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            "https://images.unsplash.com/photo-1679678691006-0ad24fecb769?w=300&q=80",
            "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=300&q=80",
            "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=300&q=80",
            "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=300&q=80",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
            "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=300&q=80",
            "https://images.unsplash.com/photo-1536240478700-b869ad10a2ab?w=300&q=80",
            "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300&q=80",
            "https://images.unsplash.com/photo-1569585723035-0e9e6ff87cbf?w=300&q=80",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80",
          ].map((img, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative">
              <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <div className="flex gap-1 w-full">
                  <button className="flex-1 bg-white/20 text-white text-xs py-1 rounded-lg hover:bg-white/30 transition-colors">
                    Use
                  </button>
                  <button className="flex-1 bg-white/20 text-white text-xs py-1 rounded-lg hover:bg-white/30 transition-colors">
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}