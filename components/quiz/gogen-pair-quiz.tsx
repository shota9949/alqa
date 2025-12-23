"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/types";

import { GogenFooterBar } from "../gogen/footer-bar";
import { GogenProgressHeader } from "../gogen/progress-header";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type ChoiceStatus = "idle" | "selected" | "correct" | "wrong" | "answered";
type PairState = "idle" | "selected" | "highlight" | "wrong" | "disabled";

type PairItem = { id: string; part: string; meaning: string };

interface PairQuizProps {
  questions: QuizQuestion[];
  name: string;
  slug?: string;
  pairs?: PairItem[];
}

function shuffleArray<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function GogenPairQuiz({ questions, name, slug, pairs }: PairQuizProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [statuses, setStatuses] = useState<ChoiceStatus[]>(() =>
    new Array(questions[0]?.choices.length || 0).fill("idle")
  );
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);
  const [pairRound, setPairRound] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [leftStates, setLeftStates] = useState<PairState[]>([]);
  const [rightStates, setRightStates] = useState<PairState[]>([]);
  const [rightOrder, setRightOrder] = useState<PairItem[]>([]);
  const [pairRoundsState, setPairRoundsState] = useState<PairItem[][]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [allMatched, setAllMatched] = useState(false);

  const current = useMemo(() => questions[index], [index, questions]);
  const pairMode = pairs && pairs.length > 0;

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!pairMode) return;
    const base = [...(pairs ?? [])];
    const shuffled = shuffleArray(base);
    const rounds: PairItem[][] = [];
    for (let i = 0; i < shuffled.length; i += 5) {
      rounds.push(shuffled.slice(i, i + 5));
    }
    setPairRoundsState(rounds);
  }, [pairMode, pairs]);

  const pairRounds = useMemo(
    () => (pairMode ? pairRoundsState : []),
    [pairMode, pairRoundsState]
  );

  const currentPairs = useMemo(
    () => (pairMode ? pairRounds[pairRound] ?? [] : []),
    [pairMode, pairRounds, pairRound]
  );
  const rightItems = useMemo(
    () => (pairMode ? rightOrder : []),
    [pairMode, rightOrder]
  );

  const totalSteps = pairMode ? pairRounds.length || 1 : questions.length;
  const completedSteps = pairMode
    ? pairRound + (allMatched ? 1 : 0)
    : index + (finished ? 1 : 0);

  const progress = Math.round((completedSteps / totalSteps) * 100);

  const canProceed = useMemo(() => {
    if (pairMode) return allMatched;
    return statuses.some((s) => s === "answered");
  }, [allMatched, pairMode, statuses]);

  useEffect(() => {
    if (finished && slug) {
      const total = pairMode
        ? pairRounds.length || questions.length
        : questions.length;
      const finalScore = pairMode
        ? pairRounds.length || questions.length
        : score;
      router.push(
        `/test/gogen/${slug}/complete?score=${finalScore}&total=${total}`
      );
    }
  }, [
    finished,
    questions.length,
    pairMode,
    pairRounds.length,
    router,
    score,
    slug,
  ]);

  useEffect(() => {
    if (!current) return;
    setStatuses(new Array(current.choices.length).fill("idle"));
    setLocked(false);
  }, [current]);

  useEffect(() => {
    if (!pairMode) return;
    setSelectedLeft(null);
    setMatchedCount(0);
    setAllMatched(false);
    setLeftStates(new Array(currentPairs.length).fill("idle"));
    setRightStates(new Array(currentPairs.length).fill("idle"));
    setRightOrder(shuffleArray(currentPairs));
    setLocked(false);
  }, [pairMode, currentPairs]);

  const handleSelect = (idx: number) => {
    if (!current || locked) return;

    const isCorrect = idx === current.answer_index;
    const nextStatuses = statuses.map((s, i) =>
      i === idx ? (isCorrect ? "correct" : "wrong") : s
    );
    setStatuses(nextStatuses);
    setLocked(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        setStatuses((prev) =>
          prev.map((s, i) =>
            i === idx ? "answered" : s === "answered" ? s : "idle"
          )
        );
        setLocked(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setStatuses((prev) => prev.map(() => "idle"));
        setLocked(false);
      }, 1000);
    }
  };

  const handleLeftSelect = (idx: number) => {
    if (!pairMode || locked) return;
    if (leftStates[idx] === "disabled") return;
    setSelectedLeft(idx);
    setLeftStates((prev) =>
      prev.map((s, i) =>
        i === idx ? "selected" : s === "selected" ? "idle" : s
      )
    );
  };

  const handleRightSelect = (idx: number) => {
    if (!pairMode || locked) return;
    if (rightStates[idx] === "disabled") return;
    if (selectedLeft === null) return;

    const leftId = currentPairs[selectedLeft]?.id;
    const rightId = rightItems[idx]?.id;
    if (!leftId || !rightId) return;

    const isCorrect = leftId === rightId;
    setLocked(true);
    setLeftStates((prev) =>
      prev.map((s, i) =>
        i === selectedLeft ? (isCorrect ? "highlight" : "wrong") : s
      )
    );
    setRightStates((prev) =>
      prev.map((s, i) => (i === idx ? (isCorrect ? "highlight" : "wrong") : s))
    );

    setTimeout(() => {
      if (isCorrect) {
        setLeftStates((prev) =>
          prev.map((s, i) => (i === selectedLeft ? "disabled" : s))
        );
        setRightStates((prev) =>
          prev.map((s, i) => (i === idx ? "disabled" : s))
        );
        setMatchedCount((prev) => {
          const next = prev + 1;
          if (next >= currentPairs.length) {
            setAllMatched(true);
          }
          return next;
        });
      } else {
        setLeftStates((prev) =>
          prev.map((s, i) =>
            i === selectedLeft && s !== "disabled" ? "idle" : s
          )
        );
        setRightStates((prev) =>
          prev.map((s, i) => (i === idx && s !== "disabled" ? "idle" : s))
        );
      }
      setSelectedLeft(null);
      setLocked(false);
    }, 1000);
  };

  const next = () => {
    if (pairMode) {
      if (pairRound === pairRounds.length - 1) {
        setFinished(true);
        return;
      }
      setPairRound((prev) => prev + 1);
      return;
    }
    if (!current) return;
    if (index === questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((prev) => prev + 1);
  };

  if (!current && !pairMode) {
    return (
      <Card>
        <div className="p-6 text-sm text-slate-600">
          問題データが読み込めませんでした。
        </div>
      </Card>
    );
  }

  if (pairMode && !hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-sm text-slate-600">読み込み中です…</div>
      </div>
    );
  }

  const getClass = (status: ChoiceStatus) => {
    switch (status) {
      case "selected":
        return "border-[#33AEF3] bg-[#DEF4FF] text-[#33AEF3]";
      case "correct":
        return "border-[#53CA28] bg-[#D6FFBC] text-[#53CA28]";
      case "wrong":
        return "border-[#FE5751] bg-[#FFE0E1] text-[#FE5751]";
      case "answered":
        return "border-[#E4E4E4] bg-white text-[#E4E4E4]";
      default:
        return "border-[#E4E4E4] bg-white text-[#878787] hover:border-[#33AEF3] hover:bg-[#DEF4FF] hover:text-[#33AEF3]";
    }
  };

  const getPairClass = (state: PairState) => {
    switch (state) {
      case "selected":
        return "border-[#33AEF3] bg-[#DEF4FF] text-[#33AEF3]";
      case "highlight":
        return "border-[#53CA28] bg-[#D6FFBC] text-[#53CA28]";
      case "wrong":
        return "border-[#FE5751] bg-[#FFE0E1] text-[#FE5751]";
      case "disabled":
        return "cursor-not-allowed border-[#E5E5E5] bg-white text-[#E5E5E5]";
      default:
        return "border-[#E4E4E4] bg-white text-[#878787] hover:border-[#33AEF3] hover:bg-[#DEF4FF] hover:text-[#33AEF3]";
    }
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex flex-col flex-1 bg-white">
        <GogenProgressHeader value={progress} className="px-6 pt-5" />

        {pairMode ? (
          <div className="mx-auto mt-8 flex w-full max-w-5xl flex-col items-center gap-10 px-6">
            <p className="mt-6 text-xl font-semibold text-slate-900">
              同じ意味のペアを選んでください
            </p>
            <div className="mt-6 grid w-full max-w-3xl grid-cols-1 justify-items-center gap-8 md:grid-cols-2">
              <div className="flex flex-col items-center gap-6">
                {currentPairs.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleLeftSelect(idx)}
                    disabled={leftStates[idx] === "disabled" || locked}
                    className={cn(
                      "h-14 w-[260px] rounded-full border px-6 text-base font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition",
                      getPairClass(leftStates[idx])
                    )}
                  >
                    {item.part}
                  </button>
                ))}
              </div>
              <div className="flex flex-col items-center gap-6">
                {rightItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleRightSelect(idx)}
                    disabled={rightStates[idx] === "disabled" || locked}
                    className={cn(
                      "h-14 w-[260px] rounded-full border px-6 text-base font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition",
                      getPairClass(rightStates[idx])
                    )}
                  >
                    {item.meaning}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col items-center gap-10">
            <p className="mt-6 text-xl font-semibold text-slate-900">
              同じ意味のペアを選んでください
            </p>

            <div className="mt-6 grid w-full max-w-3xl grid-cols-1 justify-items-center gap-8 md:grid-cols-2">
              {current?.choices.map((choice, idx) => (
                <button
                  key={choice}
                  onClick={() => handleSelect(idx)}
                  disabled={locked && statuses[idx] !== "answered"}
                  className={cn(
                    "h-14 w-[260px] rounded-full border px-6 text-base font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.06)] transition",
                    getClass(statuses[idx])
                  )}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <GogenFooterBar
        leftSlot={
          <Button
            asChild
            variant="ghost"
            className="h-12 min-w-[180px] rounded-xl border border-[#E4E4E4] bg-white text-base font-semibold text-[#A2A2A2] shadow-sm"
          >
            <Link href="/">テストを終了</Link>
          </Button>
        }
        rightSlot={
          <Button
            onClick={next}
            disabled={!canProceed}
            variant="ghost"
            className="h-12 min-w-[180px] rounded-xl border border-[#28C5B5] bg-[#28C5B5] text-base font-semibold text-white shadow-sm hover:bg-[#22b0a2]"
          >
            次の問題へ
          </Button>
        }
      />
    </div>
  );
}
