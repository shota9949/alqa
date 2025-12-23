import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import type { Drill } from "@/lib/types";

import { Card } from "../ui/card";

interface DrillCardProps {
  drill: Drill;
  href: string;
  palette?: [string, string];
}

export function DrillCard({ drill, href, palette }: DrillCardProps) {
  const tones = palette ?? drill.tone;
  const label = drill.title.replace(/^Card\s+\d+\s+\|\s*/, "");
  return (
    <Link href={href as Route} aria-label={`${label}へ`}>
      <Card className="border-none bg-transparent p-2 shadow-none transition-transform hover:-translate-y-1">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-[#f5f8fb] p-4">
          <div
            className="flex aspect-square w-full items-center justify-center rounded-[20px] text-base font-bold text-slate-900 shadow-[0_4px_12px_rgba(17,24,39,0.06)]"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.6) 16%, transparent 16%, transparent 24%), linear-gradient(135deg, ${tones[0]}, ${tones[1]})`,
              border: "10px solid #f8fbff"
            }}
          >
            {label}
          </div>
        </div>
      </Card>
    </Link>
  );
}
