"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import { FeaturesDropdown } from "./FeaturesDropdown";

export function Navbar() {
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white text-lg font-bold">✦</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/app"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                scrolled
                  ? "text-gray-700 hover:text-black hover:bg-gray-100"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              App
            </Link>

            <div ref={dropdownRef} className="relative">
              <button
                onMouseEnter={() => setFeaturesOpen(true)}
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-black hover:bg-gray-100"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                } ${featuresOpen ? (scrolled ? "bg-gray-100 text-black" : "bg-white/10 text-white") : ""}`}
              >
                Features
                <ChevronDown
                  size={14}
                  className={`transition-transform ${featuresOpen ? "rotate-180" : ""}`}
                />
              </button>
              {featuresOpen && (
                <FeaturesDropdown onClose={() => setFeaturesOpen(false)} />
              )}
            </div>

            {[
              { label: "Image Generator", href: "/image-generator" },
              { label: "Video Generator", href: "/video-generator" },
              { label: "Upscaler", href: "/upscale" },
              { label: "API", href: "/api-page" },
              { label: "Pricing", href: "/pricing" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-black hover:bg-gray-100"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/enterprise"
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                scrolled
                  ? "text-gray-700 hover:text-black hover:bg-gray-100"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              Enterprise
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <SignedOut>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
              >
                Sign up for free
              </Link>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Log in
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}