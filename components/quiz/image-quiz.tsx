"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import type { ImageTestQuestion } from "@/lib/types";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface ImageQuizProps {
  questions: ImageTestQuestion[];
  name: string;
}

export function ImageQuiz({ questions, name }: ImageQuizProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = useMemo(() => questions[index], [index, questions]);
  const progress = Math.round(((index + (finished ? 1 : 0)) / questions.length) * 100);

  const select = (id: string) => {
    if (selected || finished) return;
    setSelected(id);
    if (id === current.answerId) setScore((prev) => prev + 1);
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
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge variant="solid" className="bg-slate-900 text-white">
          {name}
        </Badge>
        <Progress value={progress} className="max-w-xs" />
        <span className="text-xs text-slate-600">{index + 1} / {questions.length}</span>
      </div>

      <Card className="border-white/70 bg-white/80 shadow-card">
        <CardHeader className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">イメージ選択</p>
          <CardTitle className="text-2xl">{current.word}</CardTitle>
          <CardDescription className="text-sm text-slate-700">{current.prompt}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {current.options.map((option) => {
            const isAnswer = option.id === current.answerId;
            const isSelected = selected === option.id;
            return (
              <button
                key={option.id}
                onClick={() => select(option.id)}
                className={cn(
                  "flex flex-col gap-2 rounded-2xl border p-3 text-left text-sm font-semibold text-slate-900 transition-all",
                  isSelected
                    ? isAnswer
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-rose-500 bg-rose-50"
                    : "border-white/60 bg-white/70 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow"
                )}
              >
                <div
                  className="flex h-24 items-center justify-center rounded-xl text-white"
                  style={{ backgroundImage: option.gradient }}
                >
                  {option.icon ? (
                    <Image src={option.icon} alt={option.label} width={32} height={32} className="drop-shadow" />
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="text-xs text-slate-600">{option.caption}</p>
                </div>
              </button>
            );
          })}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-700">
            {selected ? current.explanation : "8択の中からイメージを素早く選んでください。"}
          </div>
          <div className="flex gap-2">
            {finished ? (
              <Button onClick={restart} shape="pill" variant="default">
                もう一度
              </Button>
            ) : (
              <Button onClick={next} disabled={!selected} shape="pill" variant="default">
                {index === questions.length - 1 ? "結果を見る" : "次へ"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {finished ? (
        <div className="rounded-3xl border border-white/60 bg-gradient-to-r from-sky-500/20 via-white to-fuchsia-300/30 p-4 text-sm text-slate-800 shadow-inner">
          <p className="text-lg font-semibold text-slate-900">結果</p>
          <p>
            {questions.length}問中 {score} 問正解。イメージが迷ったものは Word_Learn に戻って再確認しましょう。
          </p>
        </div>
      ) : null}
    </div>
  );
}
