"use client";

import { useRef, useState } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "reactflow";
import { Video, Upload, Loader2 } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";
import { UploadVideoNodeData } from "@/types/workflow";

export function UploadVideoNode({ id, data }: NodeProps<UploadVideoNodeData>) {
  const { setNodes } = useReactFlow();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const updateData = (updates: Partial<UploadVideoNodeData>) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...updates } } : n
      )
    );
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const validTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload an mp4, mov, webm, or m4v file");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        updateData({
          videoUrl: dataUrl,
          fileName: file.name,
          output: dataUrl,
        });
        setUploading(false);
      };
      reader.onerror = () => setUploading(false);
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  return (
    <NodeWrapper
      id={id}
      title={data.label || "Upload Video"}
      icon={<Video size={12} className="text-white" />}
      iconBg="bg-orange-500"
      isExecuting={data.isExecuting}
      executionStatus={data.executionStatus}
      minWidth={280}
    >
      <div className="space-y-2">
        {data.videoUrl ? (
          <div className="relative group">
            <video
              src={data.videoUrl}
              controls
              className="w-full rounded-xl max-h-40"
              onMouseDown={(e) => e.stopPropagation()}
            />
            <p className="text-gray-500 text-xs mt-1.5 truncate">{data.fileName}</p>
            <button
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="mt-1 text-xs text-gray-500 hover:text-white transition-colors nodrag"
            >
              Change video
            </button>
          </div>
        ) : (
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            disabled={uploading}
            className="w-full border-2 border-dashed border-white/10 rounded-xl p-6 hover:border-orange-500/40 hover:bg-orange-900/10 transition-all flex flex-col items-center gap-2 group nodrag"
          >
            {uploading ? (
              <Loader2 size={20} className="text-orange-400 animate-spin" />
            ) : (
              <Upload size={20} className="text-gray-600 group-hover:text-orange-400 transition-colors" />
            )}
            <span className="text-gray-600 text-xs group-hover:text-gray-400 transition-colors">
              {uploading ? "Reading file..." : "Click to upload video"}
            </span>
            <span className="text-gray-700 text-xs">mp4, mov, webm, m4v</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".mp4,.mov,.webm,.m4v"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        data-handletype="video"
        className="!w-3 !h-3 !bg-orange-400 !border-2 !border-orange-600"
        style={{ right: -6 }}
      />
    </NodeWrapper>
  );
}