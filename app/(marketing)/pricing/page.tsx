"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Get free daily credits to try basic features.",
    price: { monthly: 0, yearly: 0 },
    units: "100 compute units / day",
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
  },
  {
    name: "Basic",
    description: "Access our most popular features",
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
  },
  {
    name: "Pro",
    description: "Advanced features and discounts on compute units",
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
    description: "Full access with higher discounts on compute units",
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
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-black leading-tight mb-8">
            Trusted by over 30,000,000 users
            <br />
            From 191 countries.
            <br />
            We&apos;ve got a plan for everybody...
          </h1>

          <div className="flex items-center justify-center">
            <div className="bg-gray-100 rounded-full p-1 flex items-center gap-1">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  billing === "monthly"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  billing === "yearly"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Yearly
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  -20% off
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border ${
                plan.highlight
                  ? "border-blue-500 bg-white shadow-xl"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-black">{plan.name}</h3>
                {plan.badge && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-black">
                    ${billing === "monthly" ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="text-gray-400 text-sm mb-1">/month</span>
                </div>
                {billing === "yearly" && plan.price.yearly > 0 && (
                  <p className="text-gray-400 text-xs mt-1">billed yearly</p>
                )}
                {billing === "monthly" && plan.price.monthly > 0 && (
                  <p className="text-gray-400 text-xs mt-1">billed monthly</p>
                )}
              </div>

              <button
                className={`w-full py-3 rounded-full font-semibold text-sm transition-colors mb-6 flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-white text-black border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {plan.cta} →
              </button>

              <div className="mb-4">
                <p className="font-bold text-black text-sm">{plan.units}</p>
                <p className="text-gray-400 text-xs">{plan.period}</p>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-4 flex items-center gap-1 text-gray-400 text-xs hover:text-black transition-colors">
                <ChevronDown size={12} />
                See all features...
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}