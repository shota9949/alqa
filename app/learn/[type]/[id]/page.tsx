import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ImageScenes } from "@/components/learn/image-scenes";
import { InteractiveExamples } from "@/components/learn/interactive-examples";
import { ImageLearn } from "@/components/learn/image-learn";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDrillById, getImageTests, getImageThemeById } from "@/lib/data";

export default async function LearnPage({
  params
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  if (type === "gogen") {
    const drill = getDrillById(id);
    if (!drill) return notFound();

    return (
      <AppShell
        description=""
        actions={null}
        hideHeader
        backgroundClassName="bg-[#F4F9FC]"
        contentClassName="max-w-none px-0 py-0 gap-0"
        mainClassName="p-0 space-y-0 pb-0"
      >
        <InteractiveExamples drill={drill} />
      </AppShell>
    );
  }

  if (type === "image") {
    const theme = getImageThemeById(id);
    if (!theme) return notFound();

    return (
      <AppShell
        hideHeader
        backgroundClassName="bg-white"
        contentClassName="max-w-none px-0 py-0"
        mainClassName="p-0 space-y-0"
      >
        <ImageLearn theme={theme} />
      </AppShell>
    );
  }

  return notFound();
}
