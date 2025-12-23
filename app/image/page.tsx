import Image from "next/image";
import Link from "next/link";

import { ImageCard } from "@/components/cards/image-card";
import { AppShell } from "@/components/layout/app-shell";
import { getImageThemes } from "@/lib/data";

export default function ImagePage() {
  const themes = getImageThemes();

  return (
    <AppShell
      hideHeader
      backgroundClassName="bg-white"
      contentClassName="max-w-screen-2xl px-6 py-8 md:px-10 md:py-10"
      mainClassName="space-y-6 pb-0"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xl font-semibold text-slate-800">
            <Image
              src="/img/image_icon.png"
              alt="image"
              width={24}
              height={24}
            />
            <span>イメージで覚える単語</span>
          </div>
          <p className="text-sm text-slate-500">
            TOEIC頻出単語をイメージで学ぼう！
          </p>
        </div>
        <div className="flex justify-center rounded-[16px] border border-[#eef2f7] bg-[#f5f8fc] p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
          <div className="grid w-full max-w-6xl grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 md:gap-y-0.5 xl:grid-cols-4">
            {themes.map((theme) => (
              <ImageCard
                key={theme.id}
                theme={theme}
                palette={["#c5b4e8", "#b39ddc"]}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
