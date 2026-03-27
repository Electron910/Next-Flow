"use client";

import { useRef, useState } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "reactflow";
import { Image, Upload, Loader2 } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";
import { UploadImageNodeData } from "@/types/workflow";

export function UploadImageNode({ id, data }: NodeProps<UploadImageNodeData>) {
  const { setNodes } = useReactFlow();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const updateData = (updates: Partial<UploadImageNodeData>) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...updates } } : n
      )
    );
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a jpg, jpeg, png, webp, or gif file");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        updateData({
          imageUrl: dataUrl,
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
      title={data.label || "Upload Image"}
      icon={<Image size={12} className="text-white" />}
      iconBg="bg-green-500"
      isExecuting={data.isExecuting}
      executionStatus={data.executionStatus}
      minWidth={260}
    >
      <div className="space-y-2">
        {data.imageUrl ? (
          <div className="relative group">
            <img
              src={data.imageUrl}
              alt={data.fileName || "Uploaded"}
              className="w-full rounded-xl object-cover max-h-48"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <button
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors"
              >
                Change Image
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-1.5 truncate">{data.fileName}</p>
          </div>
        ) : (
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            disabled={uploading}
            className="w-full border-2 border-dashed border-white/10 rounded-xl p-6 hover:border-green-500/40 hover:bg-green-900/10 transition-all flex flex-col items-center gap-2 group nodrag"
          >
            {uploading ? (
              <Loader2 size={20} className="text-green-400 animate-spin" />
            ) : (
              <Upload size={20} className="text-gray-600 group-hover:text-green-400 transition-colors" />
            )}
            <span className="text-gray-600 text-xs group-hover:text-gray-400 transition-colors">
              {uploading ? "Reading file..." : "Click to upload image"}
            </span>
            <span className="text-gray-700 text-xs">jpg, jpeg, png, webp, gif</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.gif"
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
        data-handletype="image"
        className="!w-3 !h-3 !bg-green-400 !border-2 !border-green-600"
        style={{ right: -6 }}
      />
    </NodeWrapper>
  );
}