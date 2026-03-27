"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs text-gray-400 mb-1.5 font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-black/30 text-white text-sm rounded-xl px-3 py-2.5 outline-none border transition-colors placeholder-gray-600",
            error
              ? "border-red-500/50 focus:border-red-500"
              : "border-white/10 focus:border-purple-500/50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";