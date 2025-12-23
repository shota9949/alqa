import Link from "next/link";
import type { Route } from "next";

import { cn } from "@/lib/utils";

import { Progress } from "../ui/progress";

type Props = {
  value: number;
  closeHref?: Route<string>;
  className?: string;
};

export function GogenProgressHeader({ value, closeHref = "/" as Route<string>, className }: Props) {
  return (
    <div className={cn("mx-auto flex w-full max-w-6xl items-center gap-4", className)}>
      <Link href={closeHref} className="text-2xl text-slate-300">
        ×
      </Link>
      <Progress value={value} className="h-3 flex-1 rounded-full bg-slate-200 [&>div]:bg-[#1CB1F6]" />
    </div>
  );
}
