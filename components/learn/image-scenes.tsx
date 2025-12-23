import Image from "next/image";

import type { ImageCard as ImageSceneCard } from "@/lib/types";

interface ImageScenesProps {
  cards: ImageSceneCard[];
  accent?: string;
}

export function ImageScenes({ cards, accent = "#0ea5e9" }: ImageScenesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.word}
          className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            {card.imageIcon ? (
              <Image src={card.imageIcon} alt={card.word} width={56} height={56} className="rounded-lg" />
            ) : null}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {card.cue}
              </p>
              <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <span className="h-3 w-3 rounded-full" style={{ background: accent }} aria-hidden />
                {card.word}
              </div>
              <p className="text-sm text-slate-700">{card.meaning}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-600">{card.scene}</p>
          <p className="mt-2 text-xs font-semibold text-slate-700">{card.story}</p>
        </div>
      ))}
    </div>
  );
}
