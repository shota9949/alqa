import Image from "next/image";
import { DrillCard } from "@/components/cards/drill-card";
import { AppShell } from "@/components/layout/app-shell";
import { getDrills } from "@/lib/data";

export default function Page() {
  const drills = getDrills();
  // preload data for consistency if needed in future

  return (
    <AppShell
      hideHeader
      backgroundClassName="bg-white"
      contentClassName="max-w-screen-2xl px-4 py-4 md:px-8 md:py-6 h-screen overflow-hidden gap-0"
      mainClassName="h-full space-y-0 pb-0 overflow-hidden"
    >
      <div className="grid h-full grid-rows-2 gap-4 overflow-hidden">
        <section className="flex flex-col justify-center gap-2 overflow-hidden">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Image src="/img/drill_icon.png" alt="drill" width={24} height={24} />
              <span>語源ドリル</span>
            </div>
            <p className="text-sm text-slate-500">単語を分解して、語源を学んでいこう！</p>
          </div>
          <div className="rounded-3xl border border-[#eef2f7] bg-[#f5f8fc] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-5 h-full flex items-center">
            <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {drills.map((drill) => (
                <DrillCard key={drill.id} drill={drill} href={`/learn/gogen/${drill.id}`} palette={["#f0e46a", "#d8cd44"]} />
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center gap-2 overflow-hidden">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Image src="/img/quiz_icon.png" alt="quiz" width={24} height={24} />
              <span>上級単語推測クイズに挑戦</span>
            </div>
            <p className="text-sm text-slate-500">これ学んだ語源を生かして難しい単語のイメージを推測してみよう！</p>
          </div>
          <div className="rounded-3xl border border-[#eef2f7] bg-[#f5f8fc] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-5 h-full flex items-center">
            <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {drills.map((drill) => (
                <DrillCard key={`${drill.id}-quiz`} drill={drill} href={`/quiz/gogen/${drill.id}`} palette={["#7fd9c8", "#6fcab8"]} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
