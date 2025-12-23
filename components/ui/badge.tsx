import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-white/80 text-slate-700 ring-1 ring-white/60",
  outline: "border border-slate-200 bg-transparent text-slate-700",
  solid: "bg-slate-900 text-white"
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
