import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "error" | "warning" | "info" | "default";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variantStyles = {
    success: "bg-green-900/40 text-green-400 border-green-800/30",
    error: "bg-red-900/40 text-red-400 border-red-800/30",
    warning: "bg-yellow-900/40 text-yellow-400 border-yellow-800/30",
    info: "bg-blue-900/40 text-blue-400 border-blue-800/30",
    default: "bg-white/5 text-gray-400 border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}