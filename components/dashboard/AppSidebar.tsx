"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Home,
  Cpu,
  GitBranch,
  FolderOpen,
  Image,
  Video,
  Wand2,
  Zap,
  Clock,
  Edit,
  MoreHorizontal,
  PanelLeft,
  TrendingUp,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Train Lora", href: "/dashboard/train-lora", icon: Cpu },
  { label: "Node Editor", href: "/workflow", icon: GitBranch },
  { label: "Assets", href: "/dashboard/assets", icon: FolderOpen },
];

const toolItems = [
  {
    label: "Image",
    href: "/dashboard/image",
    icon: Image,
    color: "bg-blue-500",
  },
  {
    label: "Video",
    href: "/dashboard/video",
    icon: Video,
    color: "bg-yellow-500",
  },
  {
    label: "Enhancer",
    href: "/dashboard/enhancer",
    icon: Wand2,
    color: "bg-gray-600",
  },
  {
    label: "Nano Banana",
    href: "/dashboard/nano-banana",
    icon: Zap,
    color: "bg-yellow-400",
  },
  {
    label: "Realtime",
    href: "/dashboard/realtime",
    icon: Clock,
    color: "bg-teal-500",
  },
  {
    label: "Edit",
    href: "/dashboard/edit",
    icon: Edit,
    color: "bg-purple-500",
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const visibleTools = showMore ? toolItems : toolItems.slice(0, 6);

  if (collapsed) {
    return (
      <div className="w-12 bg-[#1a1a1a] border-r border-white/5 flex flex-col items-center py-3 gap-2 flex-shrink-0">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          title="Expand sidebar"
        >
          <PanelLeft size={18} />
        </button>
        <div className="w-px h-4 bg-white/10" />
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`p-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
            </Link>
          );
        })}
        <div className="w-px h-4 bg-white/10" />
        {toolItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className="p-1"
            >
              <div
                className={`w-7 h-7 ${item.color} rounded-md flex items-center justify-center hover:opacity-80 transition-opacity`}
              >
                <Icon size={13} className="text-white" />
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-white/5 flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between p-3 border-b border-white/5">
        <button
          onClick={() => setCollapsed(true)}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          title="Collapse sidebar"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-5">
          <p className="px-3 text-xs text-gray-600 uppercase tracking-wider mb-2 font-medium">
            Tools
          </p>
          <div className="space-y-0.5">
            {visibleTools.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-5 h-5 ${item.color} rounded-md flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={11} className="text-white" />
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-gray-400 transition-colors w-full"
            >
              <MoreHorizontal size={17} />
              <span>{showMore ? "Show less" : "More"}</span>
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="px-3 text-xs text-gray-600 uppercase tracking-wider mb-2 font-medium">
            Sessions
          </p>
          <p className="px-3 text-xs text-gray-700">No recent sessions</p>
        </div>
      </div>

      <div className="relative border-t border-white/5 p-3 space-y-2">
        {showUserMenu && (
          <div className="absolute bottom-16 left-3 z-50">
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-white" />
            <span className="text-white text-xs font-medium">Earn 3,000 Credits</span>
          </div>
          <Link
            href="/plans"
            className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors block text-center"
          >
            Upgrade
          </Link>
        </div>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 px-1 py-1 w-full hover:bg-white/5 rounded-xl transition-colors"
        >
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {(user?.firstName || user?.emailAddresses[0]?.emailAddress || "U")[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-white text-xs font-medium truncate">
              {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "User"}
            </p>
            <p className="text-gray-500 text-xs">Free</p>
          </div>
        </button>
      </div>
    </div>
  );
}