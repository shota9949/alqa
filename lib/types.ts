export type ExampleWord = {
  word: string;
  meaning: string;
  breakdown: string;
  note?: string;
};

export type Drill = {
  id: string;
  title: string;
  root: string;
  meaning: string;
  tagline: string;
  accent: string;
  tone: [string, string];
  icon: string;
  summary: string;
  examples: ExampleWord[];
  story: string;
  cta?: string;
};

export type ImageCard = {
  word: string;
  meaning: string;
  scene: string;
  cue: string;
  story: string;
  image_ja?: string;
  imageIcon?: string;
};

export type ImageTheme = {
  id: string;
  title: string;
  caption: string;
  accent: string;
  tone: [string, string];
  icon: string;
  keywords: string[];
  story: string;
  cards: ImageCard[];
};

export type QuizQuestion = {
  id: string;
  word: string;
  choices: string[];
  answer_index: number;
  answer: string;
  etym_hint: string;
  explanation: string;
  related_candidates: string[];
};

export type QuizCategory = {
  slug: string;
  name: string;
  questions: QuizQuestion[];
};

export type ImageTestOption = {
  id: string;
  label: string;
  caption: string;
  gradient: string;
  icon?: string;
};

export type ImageTestQuestion = {
  id: string;
  word: string;
  prompt: string;
  options: ImageTestOption[];
  answerId: string;
  explanation: string;
};
