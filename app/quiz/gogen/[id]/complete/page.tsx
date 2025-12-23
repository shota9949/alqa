import Image from "next/image";
import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { GogenFooterBar } from "@/components/gogen/footer-bar";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    total?: string;
    correct?: string;
    incorrect?: string;
  }>;
};

export default async function QuizCompletePage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const total = Math.max(Number(sp.total) || 0, 1);
  const correct = Math.max(Math.min(Number(sp.correct) || 0, total), 0);
  const incorrect = Math.max(Number(sp.incorrect) || 0, 0);
  const percent = Math.round((correct / total) * 100);

  return (
    <AppShell
      title=""
      hideHeader
      backgroundClassName="bg-white"
      contentClassName="max-w-none px-0 py-0"
      mainClassName="p-0 space-y-0"
    >
      <div className="flex min-h-screen flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center bg-white px-6">
          <div className="flex w-full max-w-[1400px] flex-col items-center gap-10 text-center">
            <p className="text-5xl font-bold text-[#00b6c3]">テスト結果</p>
            <div className="flex h-[320px] w-[320px] items-center justify-center rounded-full border-[12px] border-[#00b6c3]">
              <span className="text-5xl font-semibold text-[#00b6c3]">
                {percent}%
              </span>
            </div>
            <p className="text-xl font-semibold text-slate-800">
              {correct}/{total} 正解
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 rounded-lg bg-[#d8f6cf] px-6 py-3 text-base font-semibold text-[#3c9930]">
                <Image
                  src="/img/success.png"
                  alt="success"
                  width={24}
                  height={24}
                />
                <span>正解：{correct}問</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-[#ffd7d7] px-6 py-3 text-base font-semibold text-[#d66a5d]">
                <Image
                  src="/img/unsuccess.png"
                  alt="unsuccess"
                  width={24}
                  height={24}
                />
                <span>不正解：{incorrect}問</span>
              </div>
            </div>
          </div>
        </div>

        <GogenFooterBar
          leftSlot={
            <Button
              asChild
              variant="ghost"
              className="h-12 min-w-[220px] rounded-xl border border-[#E4E4E4] bg-white text-base font-semibold text-[#A2A2A2] shadow-[0_2px_6px_rgba(0,0,0,0.16)]"
            >
              <Link href={`/quiz/gogen/${id}`}>もう一度挑戦</Link>
            </Button>
          }
          rightSlot={
            <Button
              asChild
              variant="ghost"
              className="h-12 min-w-[220px] rounded-xl border border-[#28C5B5] bg-[#28C5B5] text-base font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.16)] hover:bg-[#22b0a2]"
            >
              <Link href="/">次のレッスンへ</Link>
            </Button>
          }
        />
      </div>
    </AppShell>
  );
}
