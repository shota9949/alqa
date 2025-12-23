"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import type { Drill } from "@/lib/types";
import { cn } from "@/lib/utils";

import { GogenFooterBar } from "../gogen/footer-bar";
import { GogenProgressHeader } from "../gogen/progress-header";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type InteractiveExamplesProps = {
  drill: Drill;
};

export function InteractiveExamples({ drill }: InteractiveExamplesProps) {
  const router = useRouter();
  const total = drill.examples.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const TARGET_STEPS = 20;
  const progress = useMemo(() => {
    if (TARGET_STEPS <= 1) return 0;
    const clampedIndex = Math.min(currentIndex, TARGET_STEPS - 1);
    return Math.round((clampedIndex / (TARGET_STEPS - 1)) * 100);
  }, [currentIndex]);

  useEffect(() => {
    if (!total) router.back();
  }, [router, total]);

  if (!total) return null;

  const example = drill.examples[Math.min(currentIndex, total - 1)];
  const heroWord = drill.root || example.word || drill.title;

  const handleNext = () => {
    if (currentIndex >= TARGET_STEPS - 1) {
      router.push(`/learn/gogen/${drill.id}/complete`);
      return;
    }
    setCurrentIndex((prev) => Math.min(prev + 1, TARGET_STEPS - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const toggleCard = (idx: number) => {
    setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      {/* 上部コンテンツ */}
      <div className="flex flex-1 flex-col bg-[#F4F9FC] overflow-hidden">
        <GogenProgressHeader value={progress} className="px-5 pt-4" />

        <div className="mx-auto mb-4 mt-4 flex w-full max-w-6xl flex-1 flex-col gap-2 px-4 pb-3 overflow-hidden">
          <p className="text-[17px] font-semibold text-slate-900">語源入門</p>
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-md md:min-h-[300px] md:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col items-center justify-center space-y-4 md:items-start lg:items-center">
              <p className="text-[50px] font-semibold tracking-[0.01em] text-[#1CB1F6] leading-tight text-center">
                {heroWord}
              </p>
              <p className="text-3xl font-semibold text-slate-800 leading-tight text-center">
                {drill.meaning}
              </p>
            </div>
            <div className="relative h-[170px] w-full">
              <Image
                src="/img/word_learn.png"
                alt={heroWord}
                fill
                className="rounded-lg object-contain"
                priority
              />
            </div>
          </div>

          <div className="mt-6 text-[17px] font-semibold text-slate-900">
            カードをめくって意味を確認しよう！
          </div>

          <div className="grid gap-8 md:grid-cols-2 overflow-hidden">
            {drill.examples.slice(0, 2).map((item, idx) => {
              const isOpen = flipped[idx] ?? false;
              return (
                <button
                  key={item.word}
                  onClick={() => toggleCard(idx)}
                  className="text-left"
                  aria-label={`${item.word} のカード`}
                >
                  <Card
                    className={cn(
                      "relative h-full min-h-[200px] overflow-hidden rounded-2xl border shadow-md transition hover:-translate-y-0.5",
                      isOpen
                        ? "border-[#07B6BF] bg-[#E3F9FA]"
                        : "border-slate-200 bg-white"
                    )}
                  >
                    {isOpen ? (
                      <div className="flex h-full w-full items-center justify-center px-4 py-5 text-center">
                        <p className="text-xl font-semibold text-slate-700">
                          {item.meaning}
                        </p>
                      </div>
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 py-5 text-center">
                        <p className="text-3xl font-semibold text-slate-900">
                          {item.word}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-base text-slate-800">
                          <span className="text-amber-500" aria-hidden>
                            💡
                          </span>
                          <span className="underline decoration-slate-300">
                            {drill.meaning}
                          </span>
                        </div>
                        <div className="pointer-events-none absolute bottom-3 right-3">
                          <Image
                            src="/img/tap.png"
                            alt="tap to flip"
                            width={40}
                            height={40}
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* スペーサーでフッターを画面最下部に固定し、幅いっぱいに展開 */}
      <GogenFooterBar
        leftSlot={
          <Button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            variant="ghost"
            className="h-12 min-w-[220px] rounded-xl border border-[#E4E4E4] bg-white text-[#A2A2A2] shadow-sm disabled:opacity-60 disabled:shadow-none"
          >
            前にもどる
          </Button>
        }
        rightSlot={
          <Button
            onClick={handleNext}
            variant="ghost"
            className="h-12 min-w-[220px] rounded-xl border border-[#28C5B5] bg-[#28C5B5] text-white shadow-sm hover:bg-[#22b0a2]"
          >
            {currentIndex >= total - 1 ? "覚えた！" : "覚えた！"}
          </Button>
        }
      />
    </div>
  );
}
