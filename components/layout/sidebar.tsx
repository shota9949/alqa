"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const sections = [
  {
    heading: "単語学習",
    items: [
      { href: "/", label: "語源ドリル", icon: "/img/drill_icon.png", key: "drill" },
      { href: "/image", label: "イメージで覚える単語", icon: "/img/image_icon.png", key: "image" }
    ]
  },
  {
    heading: "読解学習",
    items: [
      { href: "/coming-soon/structure", label: "構文トレーニング", icon: "/img/document_icon.png", key: "structure" },
      { href: "/coming-soon/reading", label: "長文読解チャレンジ", icon: "/img/ko-bun_icon.png", key: "reading" }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-r border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-64">
      <div className="flex h-full flex-col px-6 pb-8 pt-6">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-3xl font-heading font-bold text-[#0eb1b7]">
            alqa
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-8">
          {sections.map((section) => (
            <div key={section.heading} className="space-y-3">
              <p className="text-sm font-semibold text-slate-600">{section.heading}</p>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link key={item.key} href={item.href as Route} className="block">
                      <div
                        className={cn(
                          "flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors",
                          active
                            ? "border-[#0eb1b7] bg-[#f2fbfc]"
                            : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <Image src={item.icon} alt={item.label} width={24} height={24} />
                        <span className="text-sm text-slate-800">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
