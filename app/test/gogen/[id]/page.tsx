import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { GogenPairQuiz } from "@/components/quiz/gogen-pair-quiz";
import { Card, CardContent } from "@/components/ui/card";
import { getGogenPairsBySlug, getQuizBySlug } from "@/lib/data";

export default async function GogenTestPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quiz = getQuizBySlug(id);
  const pairs = getGogenPairsBySlug(id);

  if (!quiz) return notFound();

  return (
    <AppShell hideHeader backgroundClassName="bg-white" contentClassName="max-w-none px-0 py-0" mainClassName="p-0 space-y-0">
      {quiz.questions.length ? (
        <GogenPairQuiz questions={quiz.questions} name={quiz.name} slug={quiz.slug} pairs={pairs} />
      ) : (
        <Card>
          <CardContent className="p-6 text-sm text-slate-600">問題が登録されていません。</CardContent>
        </Card>
      )}
    </AppShell>
  );
}
