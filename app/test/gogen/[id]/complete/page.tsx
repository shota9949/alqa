import { notFound } from "next/navigation";

import { TestComplete } from "@/components/quiz/test-complete";
import { getQuizBySlug } from "@/lib/data";

export default async function GogenTestCompletePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ score?: string; total?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const quiz = getQuizBySlug(id);

  if (!quiz) return notFound();

  const score = Number(sp.score ?? 0);
  const total = Number(sp.total ?? quiz.questions.length ?? 1);

  return (
    <TestComplete
      score={score}
      total={total}
      retryHref={`/test/gogen/${quiz.slug}` as const}
      nextHref={"/" as const}
      nextLabel="次のレッスンへ"
      retryLabel="もう一度挑戦"
    />
  );
}
