"use client";

import { useState, useRef } from "react";
import { Edit, Upload, Loader2, Download } from "lucide-react";

const editPresets = [
  { label: "Remove background", prompt: "Remove the background completely, make it transparent" },
  { label: "Add sunset lighting", prompt: "Add warm golden sunset lighting to the scene" },
  { label: "Make it anime style", prompt: "Convert to anime art style with vibrant colors" },
  { label: "Add snow effect", prompt: "Add realistic falling snow to the image" },
  { label: "Enhance details", prompt: "Enhance and sharpen all fine details in the image" },
  { label: "Change to night", prompt: "Convert the scene to nighttime with stars and moon" },
];

const sampleEdits = [
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80",
];

export default function EditPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setFileName(file.name);
      setEditedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = async () => {
    if (!uploadedImage || !editPrompt.trim()) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000));
    const edited = sampleEdits[Math.floor(Math.random() * sampleEdits.length)];
    setEditedImage(edited);
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!editedImage) return;
    const a = document.createElement("a");
    a.href = editedImage;
    a.download = `edited-${fileName}`;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="h-full bg-[#0f0f0f] overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <Edit size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">AI Image Editor</h1>
            <p className="text-gray-500 text-sm">
              Edit and modify images with AI instructions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div
              onClick={() => !uploadedImage && inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileChange(file);
              }}
              className={`rounded-2xl border-2 overflow-hidden bg-[#1a1a1a] ${
                uploadedImage
                  ? "border-white/10"
                  : "border-dashed border-white/10 hover:border-purple-500/40 cursor-pointer"
              }`}
              style={{ minHeight: 280 }}
            >
              {uploadedImage ? (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Upload"
                    className="w-full object-contain max-h-72"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedImage(null);
                      setEditedImage(null);
                      setFileName("");
                    }}
                    className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-black/80 transition-colors"
                  >
                    Change image
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                    <Upload size={28} className="text-gray-600" />
                  </div>
                  <p className="text-white font-medium mb-1">
                    Upload image to edit
                  </p>
                  <p className="text-gray-500 text-sm">
                    jpg, png, webp supported
                  </p>
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-xl transition-colors"
                  >
                    Browse files
                  </button>
                </div>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
                e.target.value = "";
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5">
              <label className="text-gray-400 text-xs mb-2 block font-medium">
                Edit Instructions
              </label>
              <textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Describe how you want to edit the image..."
                className="w-full bg-transparent text-white text-sm resize-none outline-none min-h-[100px] placeholder-gray-600"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {editPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setEditPrompt(preset.prompt)}
                  className={`text-xs px-3 py-2 rounded-lg transition-colors text-left border ${
                    editPrompt === preset.prompt
                      ? "bg-purple-900/30 border-purple-500/40 text-purple-300"
                      : "text-gray-400 bg-white/5 hover:bg-white/10 border-white/5"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleEdit}
              disabled={!uploadedImage || !editPrompt.trim() || isProcessing}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                !uploadedImage || !editPrompt.trim() || isProcessing
                  ? "bg-purple-900/40 text-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Applying edit...
                </>
              ) : (
                <>✦ Apply Edit</>
              )}
            </button>

            {editedImage && (
              <div className="bg-[#1a1a1a] rounded-2xl border border-green-800/30 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                  <p className="text-green-400 text-xs font-medium">
                    Edit applied successfully
                  </p>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
                <img
                  src={editedImage}
                  alt="Edited"
                  className="w-full object-contain max-h-48"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}