// Category is a free-form label managed from the Dashboard (stored on each
// FAQ row), not a fixed set -- previously a hardcoded union of 4 values.
export type FaqCategory = string;

export type FaqItem = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
};
