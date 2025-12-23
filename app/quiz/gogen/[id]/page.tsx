import { notFound } from "next/navigation";

import { GogenMeaningQuiz } from "@/components/quiz/gogen-meaning-quiz";
import { AppShell } from "@/components/layout/app-shell";
import { getQuizBySlug } from "@/lib/data";

export default async function GogenQuizByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = getQuizBySlug(id);

  if (!quiz) return notFound();

  return (
    <AppShell hideHeader backgroundClassName="bg-white" contentClassName="max-w-none px-0 py-0" mainClassName="p-0 space-y-0">
      <GogenMeaningQuiz quiz={quiz} slug={quiz.slug} />
    </AppShell>
  );
}
