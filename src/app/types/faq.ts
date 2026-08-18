export type FaqCategory = "network" | "privacy" | "review" | "pricing";

export type FaqItem = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
};
