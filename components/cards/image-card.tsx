import Link from "next/link";

import type { ImageTheme } from "@/lib/types";

import { Card } from "../ui/card";

interface ImageCardProps {
  theme: ImageTheme;
  palette?: [string, string];
}

export function ImageCard({ theme, palette }: ImageCardProps) {
  const tones = palette ?? theme.tone;
  return (
    <Link href={`/learn/image/${theme.id}`} className="block">
      <Card className="border-none bg-transparent p-2 shadow-none transition-transform hover:-translate-y-1">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-[#f5f8fb] p-4">
          <div
            className="flex aspect-square w-full items-center justify-center rounded-[20px] text-base font-bold text-slate-900 shadow-[0_4px_12px_rgba(17,24,39,0.06)]"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.6) 16%, transparent 16%, transparent 24%), linear-gradient(135deg, ${tones[0]}, ${tones[1]})`,
              border: "10px solid #f8fbff"
            }}
          >
            {theme.title}
          </div>
        </div>
      </Card>
    </Link>
  );
}
