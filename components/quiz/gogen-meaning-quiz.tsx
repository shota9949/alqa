"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { QuizCategory } from "@/lib/types";

import { GogenFooterBar } from "../gogen/footer-bar";
import { GogenProgressHeader } from "../gogen/progress-header";
import { Button } from "../ui/button";

type ChoiceState = "idle" | "selected";

interface Props {
  quiz: QuizCategory;
  slug?: string;
}

export function GogenMeaningQuiz({ quiz, slug }: Props) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lastWasCorrect, setLastWasCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const questions = useMemo(() => quiz.questions.slice(0, 20), [quiz.questions]);
  const current = useMemo(() => questions[index], [index, questions]);

  const displayChoices = useMemo(() => {
    if (!current || !current.choices?.length) return [];
    const all = current.choices;
    const answer = all[current.answer_index] ?? all[0];
    const others = all.filter((c) => c !== answer);

    const shuffled = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
    const sampledOthers = shuffled(others).slice(0, 3);
    const withAnswer = shuffled([answer, ...sampledOthers]);
    return withAnswer;
  }, [current]);
  const answeredCount = Math.min(
    index + (submitted ? 1 : 0),
    questions.length
  );
  const progress = Math.round((answeredCount / questions.length) * 100);
  const canSubmit = selected !== null && !submitted && !finished;

  const getChoiceClass = (state: ChoiceState) => {
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
      selected === displayChoices.findIndex((c) => c === current.choices[current.answer_index]);
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
      const total = questions.length;
      const correct = correctCount;
      const incorrect = incorrectCount;
      const search = new URLSearchParams({
        total: String(total),
        correct: String(correct),
        incorrect: String(incorrect)
      }).toString();
      const targetSlug = slug || quiz.slug || "intro";
      router.push(`/quiz/gogen/${targetSlug}/complete?${search}`);
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
        <div className="text-sm text-slate-600">
          問題が読み込めませんでした。
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col">
        <GogenProgressHeader value={progress} className="px-6 pt-5" />

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-12 px-6 pt-8 text-center">
          {finished ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <p className="text-2xl font-semibold text-slate-900">
                お疲れさまでした！
              </p>
              <p className="text-sm text-slate-600">
                結果はまもなく表示されます。
              </p>
            </div>
          ) : (
            <>
              <p className="mt-4 text-xl font-semibold text-slate-900">
                単語の意味を推測してください
              </p>
              <div className="flex flex-1 flex-col items-center justify-center gap-12">
                <div className="flex items-center gap-3 text-5xl font-bold text-slate-900 md:text-6xl">
                  <span>{current.word}</span>
                  <span className="text-2xl">✨</span>
                </div>
                <div className="mt-8 grid w-full max-w-3xl grid-cols-1 justify-items-center gap-10 md:mt-14 md:grid-cols-2">
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
            </>
          )}
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
                <span>正解：{current.choices[current.answer_index] ?? ""}</span>
                <span>意味：{current.etym_hint || ""}</span>
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
