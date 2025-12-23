import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { ImageWordQuiz } from "@/components/quiz/image-word-quiz";
import { getImageThemeById } from "@/lib/data";

export default async function ImageTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const theme = getImageThemeById(id);

  if (!theme) return notFound();

  return (
    <AppShell hideHeader backgroundClassName="bg-white" contentClassName="max-w-none px-0 py-0" mainClassName="p-0 space-y-0">
      <ImageWordQuiz theme={theme} />
    </AppShell>
  );
}
