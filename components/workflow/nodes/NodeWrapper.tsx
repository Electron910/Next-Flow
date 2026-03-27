"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { useReactFlow } from "reactflow";

interface NodeWrapperProps {
  id: string;
  title: string;
  icon: ReactNode;
  iconBg: string;
  isExecuting?: boolean;
  executionStatus?: "idle" | "running" | "success" | "error";
  children: ReactNode;
  minWidth?: number;
}

export function NodeWrapper({
  id,
  title,
  icon,
  iconBg,
  isExecuting,
  executionStatus,
  children,
  minWidth = 280,
}: NodeWrapperProps) {
  const { deleteElements } = useReactFlow();

  const getBorderColor = () => {
    switch (executionStatus) {
      case "running":
        return "border-purple-500";
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      default:
        return "border-white/10";
    }
  };

  return (
    <div
      className={`bg-[#1e1e1e] rounded-2xl border-2 ${getBorderColor()} overflow-hidden transition-all ${
        isExecuting ? "node-executing" : ""
      }`}
      style={{ minWidth }}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 bg-[#252525]">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 ${iconBg} rounded-md flex items-center justify-center`}
          >
            {icon}
          </div>
          <span className="text-white text-xs font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {executionStatus === "running" && (
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          )}
          {executionStatus === "success" && (
            <div className="w-2 h-2 rounded-full bg-green-400" />
          )}
          {executionStatus === "error" && (
            <div className="w-2 h-2 rounded-full bg-red-400" />
          )}
          <button
            onClick={() => deleteElements({ nodes: [{ id }] })}
            className="p-1 text-gray-600 hover:text-red-400 transition-colors rounded"
          >
            <X size={12} />
          </button>
        </div>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}