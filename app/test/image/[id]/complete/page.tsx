import { TestComplete } from "@/components/quiz/test-complete";

export default async function ImageTestCompletePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ total?: string; correct?: string; incorrect?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const total = Math.max(Number(sp.total) || 0, 1);
  const correct = Math.max(Math.min(Number(sp.correct) || 0, total), 0);

  return (
    <TestComplete
      score={correct}
      total={total}
      retryHref={`/test/image/${id}` as const}
      nextHref={"/image" as const}
      nextLabel="次のレッスンへ"
      retryLabel="もう一度挑戦"
    />
  );
}
