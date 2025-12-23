"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/types";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface EtymQuizProps {
  questions: QuizQuestion[];
  name: string;
  slug?: string;
}

export function EtymQuiz({ questions, name, slug }: EtymQuizProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = useMemo(() => questions[index], [index, questions]);
  const progress = Math.round(((index + (finished ? 1 : 0)) / questions.length) * 100);

  useEffect(() => {
    if (finished && slug) {
      router.push(`/test/gogen/${slug}/complete?score=${score}&total=${questions.length}`);
    }
  }, [finished, questions.length, router, score, slug]);

  const select = (choiceIndex: number) => {
    if (selected !== null || finished) return;
    setSelected(choiceIndex);
    const isCorrect = choiceIndex === current.answer_index;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const next = () => {
    if (index === questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((prev) => prev + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (!current) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-slate-600">問題データが読み込めませんでした。</CardContent>
      </Card>
    );
  }

  const showCorrect = selected !== null && selected === current.answer_index;
  const showWrong = selected !== null && selected !== current.answer_index;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Word_Learn_6
          </p>
          <p className="text-2xl font-bold text-slate-900">単語の意味を推測してください</p>
          <p className="text-sm text-slate-600">{name}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="solid" className="bg-slate-900 text-white">
            {index + 1} / {questions.length}
          </Badge>
          <Progress value={progress} className="w-40" />
        </div>
      </div>

      <Card className="relative overflow-hidden border-white/70 bg-gradient-to-br from-white via-sky-50 to-white shadow-card">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-8 top-8 h-16 w-16 rounded-full bg-sky-200 blur-3xl" />
          <div className="absolute right-10 bottom-4 h-20 w-20 rounded-full bg-amber-200 blur-3xl" />
        </div>
        <Button asChild variant="ghost" shape="pill" className="absolute right-4 top-4 h-8 px-3 text-sm text-slate-500">
          <Link href="/">×</Link>
        </Button>
        <CardHeader className="space-y-2 pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">語源ヒント</p>
          <CardTitle className="text-4xl font-bold text-slate-900">{current.word}</CardTitle>
          <CardDescription className="text-sm text-slate-700">{current.etym_hint}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {current.choices.map((choice, idx) => {
            const isCorrect = idx === current.answer_index;
            const isSelected = selected === idx;
            return (
              <button
                key={choice}
                onClick={() => select(idx)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all",
                  isSelected
                    ? isCorrect
                      ? "border-green-500 bg-green-50 text-green-900"
                      : "border-rose-500 bg-rose-50 text-rose-900"
                    : "border-surface-100 bg-white/80 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow"
                )}
              >
                {choice}
              </button>
            );
          })}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 text-sm text-slate-700">
            {showCorrect ? (
              <div className="rounded-2xl bg-green-50 p-3 text-green-800 shadow-inner">
                <p className="text-lg font-semibold">やったね！</p>
                <p>{current.explanation}</p>
              </div>
            ) : showWrong ? (
              <div className="rounded-2xl bg-rose-50 p-3 text-rose-800 shadow-inner">
                <p className="text-lg font-semibold">正解：</p>
                <p className="font-semibold">{current.answer}</p>
                <p className="text-xs text-rose-700">意味：{current.explanation}</p>
              </div>
            ) : (
              <p className="text-slate-600">選択肢をタップして解答してください。</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="ghost" shape="pill">
              <Link href="/">テストを終了</Link>
            </Button>
            {finished ? (
              <Button onClick={restart} variant="default" shape="pill">
                もう一度解く
              </Button>
            ) : (
              <Button
                onClick={next}
                disabled={selected === null}
                variant="default"
                shape="pill"
              >
                次へ
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
