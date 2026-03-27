"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Get free daily credits to try basic features.",
    price: { monthly: 0, yearly: 0 },
    units: "100 compute units",
    period: "per day",
    cta: "Get Free",
    features: [
      "No credit card required",
      "Full access to real-time models",
      "Limited access to image, video, 3D, and lipsync models",
      "Limited access to image upscaling",
      "Limited access to LoRA training",
    ],
    highlight: false,
    badge: "",
  },
  {
    name: "Basic",
    description: "Access our most popular features for daily generations.",
    price: { monthly: 9, yearly: 7 },
    units: "5,000 compute units",
    period: "per month",
    cta: "Get Basic",
    features: [
      "Commercial license",
      "Full access to Image, 3D, and Lipsync models",
      "LoRA fine-tuning with up to 50 images",
      "Upscale & enhance to 4K",
      "Access to selected video models",
    ],
    highlight: false,
    badge: "",
  },
  {
    name: "Pro",
    description: "Full access to the world's best models & all our industry-leading tools.",
    price: { monthly: 35, yearly: 28 },
    units: "20,000 compute units",
    period: "per month",
    cta: "Get Pro",
    features: [
      "Everything in Basic plus",
      "Access to all video models",
      "Workflow automation with Nodes and Apps",
      "AI-powered Nodes Agent",
      "Bulk discounts on compute unit packs",
      "Upscale & enhance to 8K",
    ],
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Max",
    description: "Maximum power for serious creators with unlimited concurrency.",
    price: { monthly: 105, yearly: 84 },
    units: "60,000 compute units",
    period: "per month",
    cta: "Get Max",
    features: [
      "Everything in Pro plus",
      "Unlimited Lora fine-tunings with 2,000 files",
      "Unlimited Concurrency",
      "Unlimited relaxed generations",
      "Upscale & enhance to 22K",
    ],
    highlight: false,
    badge: "",
  },
];

export default function PlansPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="h-full bg-[#0f0f0f] overflow-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Choose your plan
          </h1>
          <p className="text-gray-400 text-sm">
            Unlock more power with a paid plan
          </p>
        </div>

        <div className="flex items-center justify-center mb-10">
          <div className="bg-white/5 rounded-full p-1 flex items-center gap-1 border border-white/10">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                billing === "monthly"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                billing === "yearly"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                -20% off
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-5 border transition-all ${
                plan.highlight
                  ? "border-blue-500/50 bg-[#1e2433]"
                  : "border-white/5 bg-[#1a1a1a]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                {plan.badge && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-xs mb-5">{plan.description}</p>

              <div className="mb-5">
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-white">
                    $
                    {billing === "monthly"
                      ? plan.price.monthly
                      : plan.price.yearly}
                  </span>
                  <span className="text-gray-500 text-xs mb-1">/mo</span>
                </div>
                {plan.price.monthly > 0 && (
                  <p className="text-gray-600 text-xs">billed {billing}</p>
                )}
              </div>

              <button
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors mb-5 flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                }`}
              >
                {plan.cta} →
              </button>

              <div className="mb-3">
                <p className="font-bold text-white text-sm">{plan.units}</p>
                <p className="text-gray-500 text-xs">{plan.period}</p>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs">
                    <Check
                      size={12}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need more?{" "}
            <Link
              href="/enterprise"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Contact us for Enterprise pricing
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}