"use client";

import { useState } from "react";
import {
  Type,
  Image,
  Video,
  Cpu,
  Crop,
  Film,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface WorkflowSidebarProps {
  onAddNode: (type: string) => void;
}

const nodeTypes = [
  {
    type: "textNode",
    label: "Text Node",
    description: "Simple text input",
    icon: Type,
    color: "bg-blue-500",
    outputType: "text",
  },
  {
    type: "uploadImageNode",
    label: "Upload Image",
    description: "Upload jpg, png, webp",
    icon: Image,
    color: "bg-green-500",
    outputType: "image",
  },
  {
    type: "uploadVideoNode",
    label: "Upload Video",
    description: "Upload mp4, mov, webm",
    icon: Video,
    color: "bg-orange-500",
    outputType: "video",
  },
  {
    type: "llmNode",
    label: "Run Any LLM",
    description: "Gemini AI models",
    icon: Cpu,
    color: "bg-purple-500",
    outputType: "text",
  },
  {
    type: "cropImageNode",
    label: "Crop Image",
    description: "FFmpeg crop operation",
    icon: Crop,
    color: "bg-[#84934A]",
    outputType: "image",
  },
  {
    type: "extractFrameNode",
    label: "Extract Frame",
    description: "Extract video frame",
    icon: Film,
    color: "bg-[#492828]",
    outputType: "image",
  },
];

export function WorkflowSidebar({ onAddNode }: WorkflowSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = nodeTypes.filter(
    (n) =>
      n.label.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase())
  );

  if (collapsed) {
    return (
      <div className="w-12 bg-[#1a1a1a] border-r border-white/5 flex flex-col items-center py-3">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>
        <div className="mt-4 space-y-3">
          {nodeTypes.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.type}
                title={n.label}
                onClick={() => onAddNode(n.type)}
                className={`w-8 h-8 ${n.color} rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity`}
              >
                <Icon size={14} className="text-white" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-60 bg-[#1a1a1a] border-r border-white/5 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-white/5">
        <span className="text-white text-sm font-semibold">Nodes</span>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes..."
            className="w-full bg-white/5 text-white text-xs pl-8 pr-3 py-2 rounded-lg outline-none border border-white/10 focus:border-purple-500/50 placeholder-gray-600 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-2 font-medium">
          Quick Access
        </p>
        <div className="space-y-1.5">
          {filtered.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/reactflow", n.type);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onClick={() => onAddNode(n.type)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5 hover:border-purple-500/30 hover:bg-white/8 cursor-pointer group transition-all"
              >
                <div
                  className={`w-8 h-8 ${n.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">
                    {n.label}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {n.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      n.outputType === "text"
                        ? "bg-blue-400"
                        : n.outputType === "image"
                        ? "bg-green-400"
                        : "bg-orange-400"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}