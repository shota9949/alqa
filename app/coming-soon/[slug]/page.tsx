import Image from "next/image";
import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const copyMap: Record<string, { title: string; description: string; icon: string }> = {
  structure: {
    title: "構文トレーニング",
    description: "現在作成中です。もう少しで体験版を公開予定です。",
    icon: "/img/document_icon.png"
  },
  reading: {
    title: "長文読解チャレンジ",
    description: "現在作成中です。読解用のイメージ教材を準備しています。",
    icon: "/img/quiz_icon.png"
  }
};

export default async function ComingSoonPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = copyMap[slug] ?? {
    title: "コンテンツ準備中",
    description: "このセクションは現在作成中です。",
    icon: "/img/logo_icon.png"
  };

  return (
    <AppShell
      title={content.title}
      description="準備ができ次第お知らせします。"
      actions={
        <Button asChild variant="secondary" shape="pill">
          <Link href="/">トップへ戻る</Link>
        </Button>
      }
    >
      <Card className="flex flex-col items-center gap-6 border-slate-200 bg-[#f7f9fb] p-10 text-center shadow-sm">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-inner">
          <Image src={content.icon} alt={content.title} width={40} height={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">現在作成中</h2>
          <p className="text-sm text-slate-700">{content.description}</p>
          <p className="text-xs text-slate-500">完成後、このメニューからすぐアクセスできます。</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="default" shape="pill">
            <Link href="/">語源ドリルを見る</Link>
          </Button>
          <Button asChild variant="secondary" shape="pill">
            <Link href="/image">イメージ一覧を見る</Link>
          </Button>
        </div>
      </Card>
    </AppShell>
  );
}
