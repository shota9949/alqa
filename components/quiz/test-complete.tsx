import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { GogenFooterBar } from "@/components/gogen/footer-bar";
import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  score: number;
  total: number;
  retryHref: string;
  nextHref: string;
  nextLabel?: string;
  retryLabel?: string;
};

export function TestComplete({
  title = "テスト結果",
  score,
  total,
  retryHref,
  nextHref,
  nextLabel = "次のレッスンへ",
  retryLabel = "もう一度挑戦"
}: Props) {
  const getProgressColor = (pct: number) => {
    if (pct >= 100) return "#00b6c3";
    const clamped = Math.max(0, Math.min(pct, 100));
    const hue = Math.round((clamped / 100) * 180); // red->teal
    return `hsl(${hue}deg, 80%, 55%)`;
  };

  const safeTotal = Math.max(total || 0, 1);
  const safeScore = Math.max(Math.min(score || 0, safeTotal), 0);
  const incorrect = Math.max(safeTotal - safeScore, 0);
  const percent = Math.round((safeScore / safeTotal) * 100);
  const progressColor = getProgressColor(percent);
  const angle = Math.min(Math.max(percent, 0), 100) * 3.6;
  const retryRoute = retryHref as unknown as Route<string>;
  const nextRoute = nextHref as unknown as Route<string>;

  return (
    <AppShell hideHeader backgroundClassName="bg-white" contentClassName="max-w-none px-0 py-0" mainClassName="p-0 space-y-0">
      <div className="flex min-h-screen flex-col bg-white">
        <div className="flex flex-1 flex-col items-center justify-center bg-white px-6">
          <div className="flex w-full max-w-[1400px] flex-col items-center gap-10 text-center">
            <p className="text-5xl font-bold text-[#00b6c3]">{title}</p>
            <div
              className="relative flex h-[320px] w-[320px] items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${progressColor} ${angle}deg, #e5e7eb ${angle}deg)`
              }}
            >
              <div className="absolute inset-[14px] rounded-full bg-white" />
              <span className="relative text-5xl font-semibold text-[#00b6c3]">
                {percent}%
              </span>
            </div>
            <p className="text-xl font-semibold text-slate-800">
              {safeScore}/{safeTotal} 正解
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 rounded-lg bg-[#d8f6cf] px-6 py-3 text-base font-semibold text-[#3c9930]">
                <Image
                  src="/img/success.png"
                  alt="success"
                  width={24}
                  height={24}
                />
                <span>正解：{safeScore}問</span>
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
              <Link href={retryRoute}>{retryLabel}</Link>
            </Button>
          }
          rightSlot={
            <Button
              asChild
              variant="ghost"
              className="h-12 min-w-[220px] rounded-xl border border-[#28C5B5] bg-[#28C5B5] text-base font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.16)] hover:bg-[#22b0a2]"
            >
              <Link href={nextRoute}>{nextLabel}</Link>
            </Button>
          }
        />
      </div>
    </AppShell>
  );
}
