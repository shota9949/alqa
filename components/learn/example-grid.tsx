import type { ExampleWord } from "@/lib/types";

import { Card, CardContent } from "../ui/card";

interface ExampleGridProps {
  examples: ExampleWord[];
  accent?: string;
}

export function ExampleGrid({ examples, accent = "#0ea5e9" }: ExampleGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {examples.map((example) => (
        <Card key={example.word} className="border-white/60 bg-white/80 shadow-sm">
          <CardContent className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {example.breakdown}
            </p>
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: accent }}
                aria-hidden
              />
              {example.word}
            </div>
            <p className="text-sm text-slate-700">{example.meaning}</p>
            {example.note ? <p className="text-xs text-slate-600">{example.note}</p> : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
