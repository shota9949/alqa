import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  leftSlot: ReactNode;
  rightSlot: ReactNode;
  backgroundClassName?: string;
  height?: number;
  className?: string;
  innerClassName?: string;
};

export function GogenFooterBar({
  leftSlot,
  rightSlot,
  backgroundClassName,
  height = 138,
  className,
  innerClassName
}: Props) {
  return (
    <div
      className={cn(
        "flex w-full flex-shrink-0 items-center border-t border-slate-200",
        backgroundClassName ?? "bg-white",
        className
      )}
      style={{ minHeight: `${height}px` }}
    >
      <div className={cn("mx-auto flex h-full w-full max-w-6xl items-center justify-between gap-10 px-12", innerClassName)}>
        {leftSlot}
        {rightSlot}
      </div>
    </div>
  );
}
