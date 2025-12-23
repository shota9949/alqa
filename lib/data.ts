import gogenData from "@/public/data/gogen.json";
import imageData from "@/public/data/image.json";
import testGogenData from "@/public/data/test_gogen.json";
import testImageData from "@/public/data/test_image.json";

import type {
  Drill,
  ImageTestQuestion,
  ImageTheme,
  QuizCategory,
  QuizQuestion
} from "./types";

type RawGogenEntry = {
  "語源パーツ": string;
  "語源パーツの意味": string;
  "一枚絵イメージ": string;
  "例単語3つ": string;
  "例単語の意味と語源の使われ方": Record<string, string>;
};

type RawImageTheme = {
  theme: string;
  story?: string;
  items: {
    word: string;
    meaning_ja?: string;
    image_ja?: string;
    source?: string;
  }[];
};

const rawGogen = gogenData as unknown as Record<string, RawGogenEntry[]>;
const rawImage = imageData as unknown as { themes?: RawImageTheme[] };
const rawImageTests =
  (testImageData as unknown as { imageTests?: ImageTestQuestion[] }).imageTests ?? [];

const drillConfigs: {
  id: string;
  key: string;
  title: string;
  tagline: string;
  summary: string;
  accent: string;
  tone: [string, string];
  icon: string;
  story: string;
}[] = [
  {
    id: "intro",
    key: "語源入門（語源パーツ→例単語3つ）20",
    title: "語源入門",
    tagline: "基本の語源パーツをイメージで押さえる",
    summary: "接頭辞・語根の核イメージと代表単語をセットで確認できます。",
    accent: "#0ea5e9",
    tone: ["#0ea5e9", "#22d3ee"],
    icon: "/img/drill_icon.png",
    story: "基本の語源を一枚絵で覚えてクイック復習。"
  },
  {
    id: "move",
    key: "動き・伝達・変化（語源パーツ→例単語3つ）20",
    title: "動き・伝達・変化",
    tagline: "動きや伝達の語源をまとめて整理",
    summary: "移動・変化を表す語源パーツを例単語と一緒に学びます。",
    accent: "#f97316",
    tone: ["#f97316", "#fb7185"],
    icon: "/img/quiz_icon.png",
    story: "イメージで動きのニュアンスをとらえて使い分け。"
  },
  {
    id: "biz",
    key: "ビジネス領域（語源パーツ→例単語3つ）20",
    title: "ビジネス語源",
    tagline: "ビジネス頻出の語源をまとめてチェック",
    summary: "会計・法務・交渉でよく見る語源をセットで確認します。",
    accent: "#22c55e",
    tone: ["#22c55e", "#10b981"],
    icon: "/img/document_icon.png",
    story: "仕事シーンで頻出の語源をざっくりつかむ。"
  },
  {
    id: "form",
    key: "形のルール（接尾辞・品詞変換）（語源パーツ→例単語3つ）20",
    title: "形のルール",
    tagline: "接尾辞での品詞変換・派生を整理",
    summary: "接尾辞ごとの役割を一枚絵で確認し、派生語を思い出しやすく。",
    accent: "#a855f7",
    tone: ["#a855f7", "#6366f1"],
    icon: "/img/image_icon.png",
    story: "語尾の変化で品詞や意味がどう変わるかを可視化。"
  }
];

const drillList: Drill[] = drillConfigs.map((config) => {
  const entries = rawGogen[config.key] ?? [];
  const first = entries[0];

  const examples = first
    ? Object.entries(first["例単語の意味と語源の使われ方"] ?? {}).map(([word, meaning]) => ({
        word,
        meaning,
        breakdown: `${first["語源パーツ"]} = ${first["語源パーツの意味"]}`
      }))
    : [];

  return {
    id: config.id,
    title: config.title,
    root: first?.["語源パーツ"] ?? config.title,
    meaning: first?.["語源パーツの意味"] ?? config.tagline,
    tagline: config.tagline,
    accent: config.accent,
    tone: config.tone,
    icon: config.icon,
    summary: config.summary,
    examples,
    story: first?.["一枚絵イメージ"] ?? config.story
  };
});

const tonePalette: [string, string][] = [
  ["#0ea5e9", "#22d3ee"],
  ["#f97316", "#fb7185"],
  ["#22c55e", "#10b981"],
  ["#a855f7", "#6366f1"]
];

const imageThemes: ImageTheme[] = (rawImage.themes ?? []).map((theme, index) => {
  const tone = tonePalette[index % tonePalette.length];
  const cards = (theme.items ?? []).map((item) => ({
    word: item.word,
    meaning: item.meaning_ja ?? "",
    scene: item.image_ja ?? theme.story ?? theme.theme,
    cue: theme.theme,
    story: item.image_ja ?? theme.story ?? "",
    image_ja: item.image_ja
  }));

  return {
    id: `theme-${index + 1}`,
    title: theme.theme,
    caption: theme.story ?? "イメージで覚えるセット",
    accent: tone[0],
    tone,
    icon: "/img/image_icon.png",
    keywords: cards.slice(0, 3).map((card) => card.word),
    story: theme.story ?? "",
    cards
  };
});

const derivedImageTests: ImageTestQuestion[] = imageThemes
  .map((theme) => {
    const options = theme.cards.slice(0, 8).map((card, idx) => ({
      id: `${theme.id}-opt-${idx}`,
      label: card.word,
      caption: card.scene || card.story || card.meaning,
      gradient: `linear-gradient(135deg, ${theme.tone[0]}, ${theme.tone[1]})`
    }));

    if (!options.length) return null;

    const answer = options[0];

    return {
      id: `${theme.id}-q1`,
      word: answer.label,
      prompt: `「${theme.title}」に合うイメージを選んでください`,
      options,
      answerId: answer.id,
      explanation: theme.story || `テーマ「${theme.title}」のイメージセットからの出題です。`
    };
  })
  .filter(Boolean) as ImageTestQuestion[];

const categoryMap: Record<string, string> = {
  intro: "語源入門（意味選択クイズ）20",
  move: "動き・伝達・変化（意味選択クイズ）20",
  biz: "ビジネス領域（意味選択クイズ）20",
  form: "形のルール（派生語・品詞変換）（意味選択クイズ）20"
};

const quizCategories: QuizCategory[] = Object.entries(categoryMap).map(
  ([slug, name]) => ({
    slug,
    name,
    questions: (
      (testGogenData as { mcpServers: Record<string, QuizQuestion[]> })
        .mcpServers[name] || []
    )
  })
);

const imageTests =
  rawImageTests.length && Array.isArray(rawImageTests) ? rawImageTests : derivedImageTests;

export function getDrills() {
  return drillList;
}

export function getDrillById(id: string) {
  return drillList.find((item) => item.id === id);
}

export function getImageThemes() {
  return imageThemes;
}

export function getImageThemeById(id: string) {
  return imageThemes.find((item) => item.id === id);
}

export function getQuizCategories() {
  return quizCategories;
}

export function getQuizBySlug(slug: string) {
  return quizCategories.find((item) => item.slug === slug);
}

export function getImageTests() {
  return imageTests;
}

export function getImageTestById(id: string) {
  return imageTests.find((item) => item.id === id);
}

const gogenPairKeyMap: Record<string, string> = {
  intro: "語源入門（語源パーツ→例単語3つ）20",
  move: "動き・伝達・変化（語源パーツ→例単語3つ）20",
  biz: "ビジネス領域（語源パーツ→例単語3つ）20",
  form: "形のルール（接尾辞・品詞変換）（語源パーツ→例単語3つ）20"
};

export function getGogenPairsBySlug(slug: string) {
  const key = gogenPairKeyMap[slug];
  if (!key) return [];
  const entries = rawGogen[key] ?? [];
  return entries.map((entry, idx) => ({
    id: `${slug}-pair-${idx}`,
    part: entry["語源パーツ"],
    meaning: entry["語源パーツの意味"]
  }));
}
