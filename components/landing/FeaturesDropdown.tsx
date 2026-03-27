"use client";

import Link from "next/link";
import { Image, Video, Cpu, FolderOpen, Wand2 } from "lucide-react";

interface FeaturesDropdownProps {
  onClose: () => void;
}

export function FeaturesDropdown({ onClose }: FeaturesDropdownProps) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[720px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-fade-in z-50">
      <div className="grid grid-cols-4 gap-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Generate
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                  <Image size={14} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  AI Image Generation
                </span>
              </div>
              <div className="ml-9 space-y-1">
                <Link
                  href="/image-generator"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Text to Image ›
                </Link>
                <Link
                  href="/image-generator"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Realtime Image Generation ›
                </Link>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                  <Video size={14} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  AI Video Generation
                </span>
              </div>
              <div className="ml-9 space-y-1">
                <Link
                  href="/video-generator"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Text to Video ›
                </Link>
                <Link
                  href="/video-generator"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Motion Transfer ›
                </Link>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                  <Cpu size={14} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  AI 3D Generation
                </span>
              </div>
              <div className="ml-9 space-y-1">
                <Link
                  href="/"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Text to 3D Object ›
                </Link>
                <Link
                  href="/"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Image to 3D Object ›
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Edit
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                  <Wand2 size={14} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  AI Image Enhancements
                </span>
              </div>
              <div className="ml-9 space-y-1">
                <Link
                  href="/upscale"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Upscaling ›
                </Link>
                <Link
                  href="/upscale"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Generative Image Editing ›
                </Link>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                  <Video size={14} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  AI Video Enhancements
                </span>
              </div>
              <div className="ml-9 space-y-1">
                <Link
                  href="/video-generator"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Frame Interpolation ›
                </Link>
                <Link
                  href="/video-generator"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Video Style Transfer ›
                </Link>
                <Link
                  href="/video-generator"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Video Upscaling ›
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Customize
          </p>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                  <Cpu size={14} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  AI Finetuning
                </span>
              </div>
              <div className="ml-9 space-y-1">
                <Link
                  href="/"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Image LoRa Finetuning ›
                </Link>
                <Link
                  href="/"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Video LoRa Finetuning ›
                </Link>
                <Link
                  href="/"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  LoRa Sharing ›
                </Link>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                  <FolderOpen size={14} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  File Management
                </span>
              </div>
              <div className="ml-9 space-y-1">
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="block text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Krea Asset Manager ›
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-black rounded-2xl overflow-hidden h-full min-h-[200px] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80')",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-black text-xs font-bold">✦</span>
                </div>
                <span className="text-white text-sm font-semibold">Krea 1</span>
              </div>
              <p className="text-gray-400 text-xs mb-1">PROMPT</p>
              <p className="text-white text-sm font-medium leading-tight">
                "Cinematic photo of a person in a linen jacket"
              </p>
              <button
                onClick={onClose}
                className="mt-2 w-full bg-white text-black text-xs font-medium py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Generate image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}