import type { ReadingCardInput, ReadingRequest } from "@/lib/reading-types";

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isCardInput(value: unknown): value is ReadingCardInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const card = value as Record<string, unknown>;

  return (
    isNonEmptyString(card.position) &&
    isNonEmptyString(card.name) &&
    typeof card.reversed === "boolean"
  );
}

export function validateReadingRequest(payload: unknown): ReadingRequest {
  if (!payload || typeof payload !== "object") {
    throw new Error("请求体必须是 JSON 对象。");
  }

  const body = payload as Record<string, unknown>;

  if (!isNonEmptyString(body.question)) {
    throw new Error("`question` 不能为空。");
  }

  if (!isNonEmptyString(body.spread)) {
    throw new Error("`spread` 不能为空。");
  }

  if (!Array.isArray(body.cards) || body.cards.length === 0) {
    throw new Error("`cards` 至少需要一张牌。");
  }

  if (!body.cards.every(isCardInput)) {
    throw new Error("`cards` 里的牌信息格式不正确。");
  }

  return {
    question: String(body.question).trim(),
    spread: String(body.spread).trim(),
    cards: (body.cards as ReadingCardInput[]).map((card) => ({
      position: card.position,
      name: card.name,
      reversed: card.reversed,
      arcana: card.arcana,
      tone: card.tone,
      upright: card.upright,
      reversedMeaning: card.reversedMeaning,
      prompt: card.prompt,
    })),
  };
}
