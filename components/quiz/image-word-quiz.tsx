"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { ImageTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

import { GogenFooterBar } from "../gogen/footer-bar";
import { GogenProgressHeader } from "../gogen/progress-header";
import { Button } from "../ui/button";

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

type ChoiceStatus = "idle" | "selected";

interface Props {
  theme: ImageTheme;
}

export function ImageWordQuiz({ theme }: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lastWasCorrect, setLastWasCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const questions = useMemo(() => theme.cards.slice(0, 20), [theme.cards]);
  const current = useMemo(() => questions[index], [index, questions]);

  const rngSeedRef = useRef<Record<string, number>>({});

  const seededShuffle = <T,>(arr: T[], seed: number) => {
    const rand = () => {
      seed += 0x6D2B79F5;
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const displayChoices = useMemo(() => {
    if (!current) return [];
    const answer = current.word;
    const others = questions
      .map((q) => q.word)
      .filter((word) => word !== answer);
    const seedKey = `${theme.id}-${current.word}`;
    const baseSeed = rngSeedRef.current[seedKey] ?? Math.abs(seedKey.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0));
    rngSeedRef.current[seedKey] = baseSeed;
    const sampledOthers = seededShuffle(others, baseSeed).slice(0, 3);
    return seededShuffle([answer, ...sampledOthers], baseSeed + 1);
  }, [current, questions, theme.id]);

  const sceneSrc = useMemo(
    () => sceneAssets[index % sceneAssets.length],
    [index]
  );

  const answeredCount = Math.min(
    index + (submitted ? 1 : 0),
    questions.length
  );
  const progress = Math.round((answeredCount / questions.length) * 100);
  const canSubmit = selected !== null && !submitted && !finished;

  const getChoiceClass = (state: ChoiceStatus) => {
    if (state === "selected") {
      return "border-[#33AEF3] bg-[#DEF4FF] text-[#33AEF3]";
    }
    return "border-[#E4E4E4] bg-white text-[#878787] shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:border-[#33AEF3] hover:bg-[#DEF4FF] hover:text-[#33AEF3]";
  };

  const handleSelect = (idx: number) => {
    if (submitted || finished) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null || !current) return;
    const isCorrect =
      displayChoices[selected] === current.word;
    setSubmitted(true);
    setLastWasCorrect(isCorrect);
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const isLast = index === questions.length - 1;
    if (isLast) {
      setFinished(true);
      const search = new URLSearchParams({
        total: String(questions.length),
        correct: String(correctCount),
        incorrect: String(incorrectCount)
      }).toString();
      router.push(`/test/image/${theme.id}/complete?${search}`);
      return;
    }
    setIndex((prev) => prev + 1);
    setSelected(null);
    setSubmitted(false);
    setLastWasCorrect(null);
  };

  if (!current) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-sm text-slate-600">問題が読み込めませんでした。</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col">
        <GogenProgressHeader value={progress} className="px-6 pt-5" />

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 px-6 pt-8 text-center">
          <p className="mt-4 text-xl font-semibold text-slate-900">イラストにいちばん合う単語を選択してください</p>
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-[200px] w-full max-w-[320px]">
              <Image src={sceneSrc} alt={current.word} fill className="object-contain" />
            </div>
          </div>
          <div className="mt-4 grid w-full max-w-3xl grid-cols-1 justify-items-center gap-8 md:mt-10 md:grid-cols-2">
            {displayChoices.map((choice, idx) => (
              <button
                key={choice}
                onClick={() => handleSelect(idx)}
                className={cn(
                  "h-14 w-[260px] rounded-full border px-6 text-base font-semibold transition-colors",
                  getChoiceClass(selected === idx ? "selected" : "idle")
                )}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      </div>

      <GogenFooterBar
        backgroundClassName={
          lastWasCorrect === null
            ? "bg-white"
            : lastWasCorrect
              ? "bg-[#dffdd3]"
              : "bg-[#ffe6e5]"
        }
        innerClassName="px-10"
        leftSlot={
          lastWasCorrect === null ? (
            <Button
              asChild
              variant="ghost"
              className="h-12 min-w-[180px] rounded-xl border border-[#E4E4E4] bg-[#F7F7F7] text-base font-semibold text-[#A2A2A2] shadow-sm"
            >
              <Link href="/">テストを終了</Link>
            </Button>
          ) : lastWasCorrect ? (
            <div className="flex items-center gap-3 text-[#1e9f26]">
              <Image src="/img/success.png" alt="success" width={32} height={32} />
              <span className="text-sm font-semibold">やったね！</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[#e05a4f]">
              <Image src="/img/unsuccess.png" alt="unsuccess" width={32} height={32} />
              <div className="flex flex-col text-sm font-semibold leading-tight">
                <span>正解：{current.word}</span>
                <span>意味：{current.meaning || current.scene || ""}</span>
              </div>
            </div>
          )
        }
        rightSlot={
          lastWasCorrect === null ? (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              variant="ghost"
              className={cn(
                "h-12 min-w-[180px] rounded-xl border text-base font-semibold shadow-sm transition-colors",
                canSubmit
                  ? "border-[#28C5B5] bg-[#28C5B5] text-white hover:bg-[#22b0a2]"
                  : "border-[#EFEFEF] bg-[#EFEFEF] text-[#C9C9C9]"
              )}
            >
              送信する
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="ghost"
              className={cn(
                "h-12 min-w-[180px] rounded-xl border text-base font-semibold shadow-sm transition-colors",
                lastWasCorrect
                  ? "border-[#3dad22] bg-[#3dad22] text-white hover:brightness-110"
                  : "border-[#f26c60] bg-[#f26c60] text-white hover:brightness-105"
              )}
            >
              次へ
            </Button>
          )
        }
      />
    </div>
  );
}
