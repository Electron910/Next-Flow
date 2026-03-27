"use client";

import { useState, useRef } from "react";
import { Cpu, Upload, X, CheckCircle, Loader2, Image } from "lucide-react";

interface TrainingFile {
  id: string;
  name: string;
  url: string;
  size: number;
}

type TrainingStatus = "idle" | "uploading" | "training" | "complete" | "error";

export default function TrainLoraPage() {
  const [files, setFiles] = useState<TrainingFile[]>([]);
  const [modelName, setModelName] = useState("");
  const [triggerWord, setTriggerWord] = useState("");
  const [steps, setSteps] = useState("1000");
  const [status, setStatus] = useState<TrainingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    const newFiles: TrainingFile[] = [];
    Array.from(fileList).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      newFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        url,
        size: file.size,
      });
    });
    setFiles((prev) => [...prev, ...newFiles].slice(0, 50));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleStartTraining = async () => {
    if (!modelName.trim()) {
      alert("Please enter a model name");
      return;
    }
    if (!triggerWord.trim()) {
      alert("Please enter a trigger word");
      return;
    }
    if (files.length < 1) {
      alert("Please upload at least 1 image (10-50 recommended)");
      return;
    }

    setStatus("training");
    setProgress(0);

    const totalSteps = parseInt(steps);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          setStatus("complete");
          return 100;
        }
        return next;
      });
    }, totalSteps === 500 ? 200 : totalSteps === 1000 ? 300 : 500);
  };

  const handleReset = () => {
    setStatus("idle");
    setProgress(0);
    setFiles([]);
    setModelName("");
    setTriggerWord("");
  };

  return (
    <div className="h-full bg-[#0f0f0f] overflow-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Cpu size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Train LoRA</h1>
            <p className="text-gray-500 text-sm">
              Fine-tune AI models with your own images
            </p>
          </div>
        </div>

        {status === "complete" ? (
          <div className="bg-[#1a1a1a] rounded-2xl p-10 border border-green-800/30 text-center">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-white text-2xl font-bold mb-2">
              Training Complete!
            </h2>
            <p className="text-gray-400 mb-2">
              Model <span className="text-white font-semibold">{modelName}</span> has been trained successfully.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Trigger word:{" "}
              <span className="text-purple-400 font-mono">{triggerWord}</span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors font-medium"
              >
                Train Another
              </button>
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium">
                Use Model
              </button>
            </div>
          </div>
        ) : status === "training" ? (
          <div className="bg-[#1a1a1a] rounded-2xl p-10 border border-purple-800/30 text-center">
            <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 size={32} className="text-purple-400 animate-spin" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">
              Training in progress...
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Training{" "}
              <span className="text-white font-semibold">{modelName}</span> with{" "}
              {files.length} images for {steps} steps
            </p>
            <div className="w-full bg-white/5 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm">
              {Math.round(progress)}% complete
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
                Upload Training Images
                <span className="text-gray-500 text-xs font-normal">
                  {files.length}/50
                </span>
              </h3>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all mb-4 ${
                  isDragging
                    ? "border-purple-500 bg-purple-900/10"
                    : "border-white/10 hover:border-purple-500/40 hover:bg-purple-900/5"
                }`}
              >
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <Upload size={20} className="text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-white text-sm font-medium">
                    Drop images here
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    or click to browse
                  </p>
                </div>
                <p className="text-gray-600 text-xs">
                  jpg, png, webp — 10 to 50 images recommended
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />

              {files.length > 0 && (
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="relative group aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center"
                        >
                          <X size={12} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-4">
                Training Configuration
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">
                    Model Name *
                  </label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="my-custom-model"
                    className="w-full bg-black/30 text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-white/10 focus:border-purple-500/50 placeholder-gray-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">
                    Trigger Word *
                  </label>
                  <input
                    type="text"
                    value={triggerWord}
                    onChange={(e) => setTriggerWord(e.target.value)}
                    placeholder="mysubject"
                    className="w-full bg-black/30 text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-white/10 focus:border-purple-500/50 placeholder-gray-600 transition-colors"
                  />
                  <p className="text-gray-600 text-xs mt-1">
                    Use this word in prompts to activate your model
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">
                    Training Steps
                  </label>
                  <select
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    className="w-full bg-black/30 text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
                  >
                    <option value="500">500 steps (fast, ~30s)</option>
                    <option value="1000">1000 steps (recommended, ~1min)</option>
                    <option value="2000">2000 steps (detailed, ~2min)</option>
                  </select>
                </div>

                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                  <p className="text-gray-400 text-xs font-medium mb-2">
                    Summary
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Images</span>
                      <span className="text-white">{files.length} uploaded</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Steps</span>
                      <span className="text-white">{steps}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Est. time</span>
                      <span className="text-white">
                        {steps === "500"
                          ? "~30 seconds"
                          : steps === "1000"
                          ? "~1 minute"
                          : "~2 minutes"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStartTraining}
                  disabled={files.length === 0 || !modelName || !triggerWord}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    files.length === 0 || !modelName || !triggerWord
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                  }`}
                >
                  Start Training
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}