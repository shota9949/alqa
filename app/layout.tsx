import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "alqa",
  description: "語源・イメージで覚えるTOEIC語彙学習アプリ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={cn("min-h-screen bg-white text-slate-900 antialiased")}>
        {children}
      </body>
    </html>
  );
}
