"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Search, X,
  Play, ExternalLink, LogOut, Settings,
  CreditCard, BarChart2, Plus,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";

const planWords = ["Basic", "Pro", "Max"];

const imageModels = [
  {
    name: "Nano Banana Pro",
    desc: "Smartest model. World's best prompt adherence. Best model for complex tasks and image editing.",
    tags: ["Featured"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    speed: "⚡⚡⚡",
    quality: "◆◆◆",
    cost: "-100",
  },
  {
    name: "Nano Banana 2",
    desc: "Google's latest flash image model (also known as Gemini 3.1 Flash Image) optimized for fast generation with support for up to 4K.",
    tags: ["Featured", "New"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    speed: "⚡⚡⚡",
    quality: "◆◆◆",
    cost: "-50",
  },
  {
    name: "Flux 2",
    desc: "FLUX.2 [dev] from Black Forest Labs. Faster generation with crisper text generation.",
    tags: ["Free", "New"],
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80",
    speed: "⚡⚡⚡",
    quality: "◆",
    cost: "",
  },
  {
    name: "Krea 1",
    desc: "Ultra-realistic flagship model. The most powerful image model available.",
    tags: ["Featured"],
    image: "https://images.unsplash.com/photo-1679678691006-0ad24fecb769?w=600&q=80",
    speed: "⚡⚡",
    quality: "◆◆◆",
    cost: "-150",
  },
];

const videoModels = [
  {
    name: "Kling 2.6",
    desc: "Frontier model from Kling with native audio. Highest quality at a moderate price point.",
    tags: ["Featured"],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869ad10a2ab?w=600&q=80",
    speed: "⚡⚡⚡",
    quality: "◆◆◆",
    cost: "~300",
  },
  {
    name: "Grok Imagine",
    desc: "Fast, high-quality video generation by xAI.",
    tags: ["New"],
    video: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
    speed: "⚡⚡⚡",
    quality: "◆◆◆",
    cost: "~250",
  },
  {
    name: "Runway Gen-4",
    desc: "Latest generation from Runway ML. Exceptional motion quality.",
    tags: ["New"],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    speed: "⚡⚡",
    quality: "◆◆◆",
    cost: "~200",
  },
];

const nodeApps = [
  {
    title: "Cartoonify",
    desc: "Turn any photo into a cartoon with our free AI cartoon generator.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
  },
  {
    title: "AI Image Generator – FLUX.1 Krea",
    desc: "Try Krea's photorealistic AI image model for free.",
    image: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=400&q=80",
  },
  {
    title: "Clothes Changer",
    desc: "Upload selfies and try on any outfit. See how any clothes look on you.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    title: "Face Swap",
    desc: "Swap faces in any image with AI-powered precision.",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&q=80",
  },
];

const releaseNotes = [
  {
    title: "Annotations in NextFlow Edit",
    desc: "Mark up multiple regions, write a separate prompt for each one, and generate all the changes in a single pass.",
    fullDesc: "The new Annotations feature lets you select any region of your image and provide targeted editing instructions. Each annotation can have its own prompt, allowing fine-grained control over complex edits. All changes are applied in a single generation pass for consistency.",
    date: "Mar 26, 2026",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80",
    action: "Try Edit",
    href: "/dashboard/edit",
  },
  {
    title: "The Node Agent",
    desc: "An AI agent that builds and runs creative workflows from a single sentence.",
    fullDesc: "Describe what you want to create in plain English, and the Node Agent will automatically build a complete workflow for you. It selects the right models, connects nodes, and runs the entire pipeline — all from a single sentence prompt.",
    date: "Mar 18, 2026",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    action: "Try Node Editor",
    href: "/workflow",
  },
  {
    title: "A New, More Powerful NextFlow Edit",
    desc: "Change specific regions, render new perspectives, adjust lighting, apply color palettes, and more.",
    fullDesc: "The rebuilt editing tool gives you fine-grained AI control over every aspect of your images. Change specific regions with precise masking, render new perspectives, adjust lighting conditions, apply color palettes, and much more. A complete overhaul of the editing experience.",
    date: "Mar 9, 2026",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    action: "Try Edit",
    href: "/dashboard/edit",
  },
  {
    title: "Turn Any Image Into a Prompt",
    desc: "Drop any image into NextFlow and get a detailed, generation-ready prompt in seconds.",
    fullDesc: "AI vision analyzes your uploaded image's style, lighting, composition, and subjects to generate a detailed text prompt. Use this prompt to recreate similar images, explore variations, or guide new generations in the same style.",
    date: "Mar 5, 2026",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
    action: "Try Image Tool",
    href: "/dashboard/image",
  },
];

interface ReleaseNote {
  title: string;
  desc: string;
  fullDesc: string;
  date: string;
  image: string;
  action: string;
  href: string;
}

interface UserMenuProps {
  onClose: () => void;
}

function UserMenu({ onClose }: UserMenuProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <div className="absolute bottom-16 left-0 w-80 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
      <div className="p-3 border-b border-white/5">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
          Workspaces
        </p>
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {(user?.firstName || "U")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">Default Workspace</p>
            <p className="text-gray-500 text-xs">Free</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-sm transition-colors mt-1 w-full">
          <Plus size={14} />
          Add workspace
        </button>
      </div>

      <div className="p-3 border-b border-white/5">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-4 h-4 rounded-full border-2 border-green-400 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">100 Credits remaining</p>
            <p className="text-gray-500 text-xs">100 per day</p>
          </div>
        </div>
      </div>

      <div className="p-2">
        {[
          { icon: CreditCard, label: "Upgrade plan", href: "/plans" },
          { icon: CreditCard, label: "Buy credits", href: "/plans" },
          { icon: Settings, label: "Settings", href: "/dashboard" },
          { icon: BarChart2, label: "Usage Statistics", href: "/dashboard" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-sm transition-colors"
          >
            <item.icon size={15} />
            {item.label}
          </Link>
        ))}
        <button
          onClick={() => signOut(() => router.push("/"))}
          className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-xl text-sm transition-colors w-full"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>

      <div className="border-t border-white/5 p-4 grid grid-cols-2 gap-4 text-xs text-gray-600">
        <div>
          <p className="font-medium text-gray-500 mb-2">Products</p>
          {["Image", "Video", "Enhancer", "Realtime", "Edit", "Train"].map((p) => (
            <p key={p} className="hover:text-gray-400 cursor-pointer py-0.5">{p}</p>
          ))}
        </div>
        <div>
          <p className="font-medium text-gray-500 mb-2">Resources</p>
          {["Pricing", "Careers", "Terms of Service", "Privacy Policy", "Documentation", "Models"].map((r) => (
            <p key={r} className="hover:text-gray-400 cursor-pointer py-0.5">{r}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardHome() {
  const [planIndex, setPlanIndex] = useState(0);
  const [showPricingHover, setShowPricingHover] = useState(false);
  const [imageModelIdx, setImageModelIdx] = useState(0);
  const [videoModelIdx, setVideoModelIdx] = useState(0);
  const [nodeAppIdx, setNodeAppIdx] = useState(0);
  const [selectedRelease, setSelectedRelease] = useState<ReleaseNote | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [imageSearch, setImageSearch] = useState("");
  const [videoSearch, setVideoSearch] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlanIndex((i) => (i + 1) % planWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(() => {});
      }
    });
  }, []);

  const planColors = ["text-blue-400", "text-purple-400", "text-cyan-400"];

  const filteredImageModels = imageModels.filter((m) =>
    m.name.toLowerCase().includes(imageSearch.toLowerCase())
  );

  const filteredVideoModels = videoModels.filter((m) =>
    m.name.toLowerCase().includes(videoSearch.toLowerCase())
  );

  return (
    <div className="h-full bg-[#0f0f0f] overflow-auto">
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-10">

        <div
          className="rounded-2xl bg-black border border-white/5 p-6 relative overflow-hidden cursor-pointer group"
          onMouseEnter={() => setShowPricingHover(true)}
          onMouseLeave={() => setShowPricingHover(false)}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-white text-sm">Upscale images &amp; videos to 22K</p>
              <p className="text-white text-sm">Lora fine-tuning</p>
              <p className="text-white text-sm">Access all 150+ models</p>
              <p className="text-white text-sm">Ultra fast &amp; no throttling</p>
            </div>
            <div className="text-right flex-shrink-0 ml-8">
              <p className="text-4xl font-bold">
                <span className="text-white">Try </span>
                <span
                  className={`transition-all duration-500 ${planColors[planIndex]}`}
                  style={{ display: "inline-block" }}
                >
                  {planWords[planIndex]}
                </span>
              </p>
            </div>
          </div>

          {showPricingHover && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
              <Link
                href="/plans"
                className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm"
              >
                View Pricing →
              </Link>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-white font-semibold">Explore image models</h2>
              <button className="w-7 h-7 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <Search size={13} className="text-gray-400" />
              </button>
              {imageSearch && (
                <input
                  value={imageSearch}
                  onChange={(e) => setImageSearch(e.target.value)}
                  placeholder="Search models..."
                  className="bg-white/5 text-white text-xs px-3 py-1.5 rounded-lg outline-none border border-white/10 focus:border-purple-500/50 w-40"
                />
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setImageModelIdx((i) => Math.max(0, i - 1))}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setImageModelIdx((i) => Math.min(filteredImageModels.length - 2, i + 1))}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImageModels
              .slice(imageModelIdx, imageModelIdx + 3)
              .map((model) => (
                <div
                  key={model.name}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ minHeight: 280 }}
                >
                  <img
                    src={model.image}
                    alt={model.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          tag === "Free"
                            ? "bg-green-900/60 text-green-400 border border-green-800/40"
                            : tag === "New"
                            ? "bg-blue-900/60 text-blue-300 border border-blue-800/40"
                            : "bg-white/15 text-white border border-white/20"
                        }`}
                      >
                        {tag === "Featured" ? "🏆 Featured" : tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-lg mb-1">{model.name}</p>
                    <p className="text-gray-300 text-xs line-clamp-2 mb-3">{model.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-yellow-400">{model.speed}</span>
                        <span className="text-blue-300">{model.quality}</span>
                        {model.cost && <span className="text-gray-400">{model.cost} ⊙</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => router.push("/dashboard/image")}
                      className="mt-3 w-full bg-white text-black text-xs font-semibold py-2 rounded-xl hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Generate image
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-white font-semibold">Try video models</h2>
              <button className="w-7 h-7 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <Search size={13} className="text-gray-400" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setVideoModelIdx((i) => Math.max(0, i - 1))}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setVideoModelIdx((i) => Math.min(filteredVideoModels.length - 2, i + 1))}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVideoModels
              .slice(videoModelIdx, videoModelIdx + 2)
              .map((model, idx) => (
                <div
                  key={model.name}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ minHeight: 280 }}
                >
                  <video
                    ref={(el) => { videoRefs.current[idx] = el; }}
                    src={model.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={model.thumbnail}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {model.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-white text-black font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-xl mb-1">{model.name}</p>
                    <p className="text-gray-300 text-xs mb-3">{model.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-yellow-400">{model.speed}</span>
                        <span className="text-blue-300">{model.quality}</span>
                        <span className="text-gray-400">~{model.cost} ⊙</span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push("/dashboard/video")}
                      className="mt-3 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Generate video
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Play with node apps</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setNodeAppIdx((i) => Math.max(0, i - 1))}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setNodeAppIdx((i) => Math.min(nodeApps.length - 3, i + 1))}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {nodeApps.slice(nodeAppIdx, nodeAppIdx + 3).map((app) => (
              <Link key={app.title} href="/workflow">
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ minHeight: 200 }}>
                  <img
                    src={app.image}
                    alt={app.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-sm">{app.title}</p>
                    <p className="text-gray-300 text-xs mt-1 line-clamp-2">{app.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold">Release notes</h2>
            <button className="text-xs text-gray-400 hover:text-white border border-white/10 px-4 py-2 rounded-xl hover:bg-white/5 transition-colors">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {releaseNotes.map((note) => (
              <div
                key={note.title}
                onClick={() => setSelectedRelease(note)}
                className="flex gap-4 cursor-pointer group hover:bg-white/3 rounded-2xl p-2 transition-colors"
              >
                <div className="w-40 h-28 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm mb-1 group-hover:text-purple-300 transition-colors">
                    {note.title}
                  </p>
                  <p className="text-gray-500 text-xs line-clamp-3 mb-2">{note.desc}</p>
                  <p className="text-gray-600 text-xs">{note.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Instant results with NextFlow actions</h2>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronLeft size={14} />
              </button>
              <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: "A story of survival", image: "https://images.unsplash.com/photo-1536240478700-b869ad10a2ab?w=400&q=80" },
              { title: "Portrait enhancement", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
              { title: "Urban architecture", image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80" },
            ].map((item) => (
              <div key={item.title} className="relative rounded-xl overflow-hidden aspect-video group cursor-pointer">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-xs font-semibold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 pb-8">
          <div className="grid grid-cols-4 gap-8 text-xs text-gray-600">
            <div>
              <p className="font-medium text-gray-500 mb-3">Products</p>
              {["Image", "Video", "Enhancer", "Realtime", "Edit", "Chat", "Stage", "Animator", "Train"].map((p) => (
                <p key={p} className="py-0.5 hover:text-gray-400 cursor-pointer">{p}</p>
              ))}
            </div>
            <div>
              <p className="font-medium text-gray-500 mb-3">Resources</p>
              {["Pricing", "Careers", "Terms of Service", "Privacy Policy", "Documentation", "Models"].map((r) => (
                <p key={r} className="py-0.5 hover:text-gray-400 cursor-pointer">{r}</p>
              ))}
            </div>
            <div>
              <p className="font-medium text-gray-500 mb-3">About</p>
              {["Blog", "Discord", "Articles"].map((a) => (
                <p key={a} className="py-0.5 hover:text-gray-400 cursor-pointer">{a}</p>
              ))}
            </div>
            <div>
              <p className="font-medium text-gray-500 mb-3">Connect</p>
              <div className="flex items-center gap-3 mt-2">
                {["■", "✕", "in", "◎"].map((icon, i) => (
                  <button key={i} className="text-gray-600 hover:text-gray-400 transition-colors text-lg">
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedRelease && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRelease(null)}
        >
          <div
            className="bg-[#1a1a1a] rounded-2xl max-w-2xl w-full overflow-hidden border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedRelease.image}
                alt={selectedRelease.title}
                className="w-full object-cover"
                style={{ maxHeight: 280 }}
              />
              <button
                onClick={() => setSelectedRelease(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-xs mb-2">{selectedRelease.date}</p>
              <h3 className="text-white text-xl font-bold mb-3">
                {selectedRelease.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {selectedRelease.fullDesc}
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href={selectedRelease.href}
                  onClick={() => setSelectedRelease(null)}
                  className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors text-sm"
                >
                  {selectedRelease.action} →
                </Link>
                <button
                  onClick={() => setSelectedRelease(null)}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Read more
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}