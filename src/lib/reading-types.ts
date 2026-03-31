export type ReadingCardInput = {
  position: string;
  name: string;
  reversed: boolean;
  arcana?: string;
  tone?: string;
  upright?: string;
  reversedMeaning?: string;
  prompt?: string;
};

export type ReadingRequest = {
  question: string;
  spread: string;
  cards: ReadingCardInput[];
};

export type ReadingCardResult = {
  position: string;
  cardName: string;
  orientation: "正位" | "逆位";
  reading: string;
};

export type ReadingResponse = {
  summary: string;
  cardReadings: ReadingCardResult[];
  advice: string;
  closing: string;
  model: string;
};
