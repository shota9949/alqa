"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { ImageTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

import { GogenFooterBar } from "../gogen/footer-bar";
import { GogenProgressHeader } from "../gogen/progress-header";
import { Button } from "../ui/button";

type Props = {
  theme: ImageTheme;
};

const sceneAssets = [
  "/img/image-scenes/handshake.svg",
  "/img/image-scenes/bridge.svg",
  "/img/image-scenes/gear.svg",
  "/img/image-scenes/arrow.svg",
  "/img/image-scenes/flag.svg",
  "/img/image-scenes/gradient.svg",
  "/img/image-scenes/coin.svg",
  "/img/image-scenes/fog.svg",
  "/img/image-scenes/hand.svg",
  "/img/image-scenes/cross.svg"
];

export function ImageLearn({ theme }: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const cards = theme.cards.slice(0, 20);
  const total = cards.length || 1;
  const current = cards[index] ?? cards[0];
  const progress = Math.round(((index + 1) / total) * 100);

  const sceneSrc = useMemo(
    () => sceneAssets[index % sceneAssets.length],
    [index]
  );

  const isRevealed = revealed[index] ?? false;
  const primaryText = isRevealed ? current.meaning || current.scene || "" : current.word;
  const secondaryText = isRevealed ? current.word : current.meaning || current.scene || "";

  const handleToggle = () => {
    setRevealed((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleNext = () => {
    if (index >= total - 1) {
      router.push(`/learn/image/${theme.id}/complete`);
      return;
    }
    setIndex((prev) => Math.min(prev + 1, total - 1));
  };

  const handleReset = () => {
    setIndex(0);
    setRevealed({});
  };

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      <div className="flex flex-1 flex-col bg-[#f4f9fc]">
        <GogenProgressHeader value={progress} className="px-5 pt-4" />

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 pb-6 pt-4">
          <p className="ml-8 mt-2 text-lg font-semibold text-slate-900">{theme.title}</p>

          <div className="relative flex flex-1 items-center justify-center">
            <Image
              src="/img/card.png"
              alt="card stack"
              fill
              priority
              className="pointer-events-none select-none object-contain"
            />
            <button
              onClick={handleToggle}
              className="absolute z-10 flex w-[90%] max-w-4xl flex-col items-center gap-4 rounded-[28px] px-10 py-10 text-center transition hover:-translate-y-0.5 sm:px-12 sm:py-12"
            >
              <div className="relative h-[210px] w-full max-w-[420px]">
                <Image
                  src={sceneSrc}
                  alt={current.word}
                  fill
                  className="object-contain"
                  sizes="420px"
                  priority
                />
              </div>
              <p className="text-3xl font-semibold text-[#1CB1F6] md:text-4xl">
                {primaryText}
              </p>
              <div className="flex items-center gap-2 text-base font-semibold text-slate-800 md:text-lg">
                <span aria-hidden>✨</span>
                <span
                  className={cn(
                    "transition",
                    isRevealed ? "text-slate-800" : "text-slate-400 blur-[1px]"
                  )}
                >
                  {secondaryText}
                </span>
              </div>
            </button>
          </div>

          <p className="text-center text-sm font-medium text-slate-500">
            タップで意味を確認
          </p>
        </div>
      </div>

      <GogenFooterBar
        leftSlot={
          <Button
            onClick={handleReset}
            variant="ghost"
            className="h-12 min-w-[220px] rounded-xl border border-[#E4E4E4] bg-white text-base font-semibold text-[#A2A2A2] shadow-sm"
          >
            もう一度復習
          </Button>
        }
        rightSlot={
          <Button
            onClick={handleNext}
            variant="ghost"
            className="h-12 min-w-[220px] rounded-xl border border-[#28C5B5] bg-[#28C5B5] text-base font-semibold text-white shadow-sm hover:bg-[#22b0a2]"
          >
            覚えた！
          </Button>
        }
      />
    </div>
  );
}
