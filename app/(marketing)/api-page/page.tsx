"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const codeExample = `# Step 1: Create generation job
curl -X POST https://api.nextflow.app/generate/image/flux-1-dev \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "a serene mountain landscape at sunset",
    "width": 1024,
    "height": 576,
    "steps": 28
  }'

# Response: {"job_id": "550e8400-e29b-41d4-a716-446655440000", ...}

# Step 2: Poll for completion (repeat until completed)
curl -X GET https://api.nextflow.app/jobs/550e8400-e29b-41d4-a716-446655440000 \\
  -H "Authorization: Bearer YOUR_API_TOKEN"`;

export default function APIPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-4 flex items-center gap-2 text-gray-400 text-sm">
          <span className="hover:text-white cursor-pointer">Home</span>
          <span>›</span>
          <span className="hover:text-white cursor-pointer">Features</span>
          <span>›</span>
          <span className="text-white">API</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              AI Image &amp; Video Generation API
            </h1>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              40+ image and video models, one REST API. Generate, upscale, train
              custom LoRAs, and build creative pipelines. Simple compute-unit
              pricing. No infrastructure to manage.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors">
                Get Started
              </button>
              <button className="px-6 py-3 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                Contact Sales
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              {[
                { value: "40+", label: "AI Models" },
                { value: "99.9%", label: "Uptime SLA" },
                { value: "<3s", label: "Generation Speed" },
                { value: "REST", label: "Simple API" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-400 text-xs ml-2">
                  text-to-image.sh
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="p-6 text-sm text-gray-300 overflow-x-auto leading-relaxed font-mono">
              <code>{codeExample}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}