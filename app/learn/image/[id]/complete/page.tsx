import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { getImageTests, getImageThemeById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function ImageLearnCompletePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const theme = getImageThemeById(id);
  const firstImageTest = getImageTests()[0];

  if (!theme) return notFound();

  return (
    <AppShell
      hideHeader
      backgroundClassName="bg-white"
      contentClassName="max-w-none px-0 py-0"
      mainClassName="p-0 space-y-0"
    >
      <div
        className="grid h-screen bg-white overflow-hidden"
        style={{ gridTemplateRows: "calc(100vh - 140px) 140px" }}
      >
        <div className="flex flex-col items-center justify-center bg-[#F4F9FC] px-6">
          <div className="flex w-full max-w-[1400px] flex-col items-center gap-10">
            <p className="text-5xl font-bold text-[#00b6c3]">学習完了!</p>
            <div className="flex h-[320px] w-[320px] items-center justify-center rounded-full border-[12px] border-[#00b6c3]">
              <span className="text-5xl font-semibold text-[#00b6c3]">100%</span>
            </div>
            <p className="mt-2 text-xl text-slate-800">お疲れ様です！このセッションの学習を完了しました。</p>
          </div>
        </div>

        <div className="flex items-center justify-center border-t border-slate-200 bg-white px-12">
          <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between gap-10 px-0">
            <Button
              asChild
              variant="ghost"
              className="h-12 min-w-[220px] rounded-xl border border-[#E4E4E4] bg-white text-base font-semibold text-[#A2A2A2] shadow-[0_2px_6px_rgba(0,0,0,0.16)]"
            >
              <Link href={`/learn/image/${theme.id}`}>もう一度復習</Link>
            </Button>
            {firstImageTest ? (
              <Button
                asChild
                variant="ghost"
                className="h-12 min-w-[220px] rounded-xl border border-[#28C5B5] bg-[#28C5B5] text-base font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.16)] hover:bg-[#22b0a2]"
              >
                <Link href={`/test/image/${theme.id}`}>テストを始める</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
