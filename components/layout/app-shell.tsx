import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Sidebar } from "./sidebar";

interface AppShellProps {
  title?: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
  hideHeader?: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
  mainClassName?: string;
}

export function AppShell({
  title = "",
  description,
  eyebrow,
  actions,
  children,
  hideHeader,
  backgroundClassName,
  contentClassName,
  mainClassName
}: AppShellProps) {
  return (
    <div className={cn("min-h-screen md:flex", backgroundClassName ?? "bg-white")}>
      <Sidebar />
      <div className={cn("mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-6 px-6 py-10", contentClassName)}>
        {hideHeader ? null : (
          <header className="border-b border-slate-200 pb-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 space-y-2">
                <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
                {description ? (
                  <p className="max-w-2xl text-sm text-slate-600">{description}</p>
                ) : null}
              </div>
              {actions ? <div className={cn("flex items-center gap-3")}>{actions}</div> : null}
            </div>
          </header>
        )}
        <main className={cn("space-y-6 pb-10", hideHeader ? "pt-0" : "", mainClassName)}>{children}</main>
      </div>
    </div>
  );
}
