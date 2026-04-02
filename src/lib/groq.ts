import type { ReadingRequest, ReadingResponse } from "@/lib/reading-types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function buildPrompt(input: ReadingRequest) {
  const cards = input.cards
    .map((card) => {
      const orientation = card.reversed ? "逆位" : "正位";
      const baseMeaning = card.reversed
        ? card.reversedMeaning || "请结合逆位状态解读。"
        : card.upright || "请结合正位状态解读。";

      return [
        `位置：${card.position}`,
        `牌名：${card.name}`,
        `方向：${orientation}`,
        card.arcana ? `体系：${card.arcana}` : "",
        card.tone ? `主题：${card.tone}` : "",
        `基础含义：${baseMeaning}`,
        card.prompt ? `提示语：${card.prompt}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  return `你是一位专业、温柔、克制、不故弄玄虚的中文塔罗咨询师。

请根据用户问题与抽到的牌，输出一个 JSON 对象，不要输出 Markdown，不要输出代码块，不要输出额外解释。

用户问题：
${input.question}

牌阵：
${input.spread}

抽到的牌：
${cards}

请严格返回以下 JSON 结构：
{
  "summary": "2-3句总结整体能量",
  "cardReadings": [
    {
      "position": "过去/现在/未来",
      "cardName": "牌名",
      "orientation": "正位或逆位",
      "reading": "这一张牌在这个位置上的详细解释"
    }
  ],
  "advice": "给用户的具体建议，务实可执行",
  "closing": "一句简短、有余韵的结束语"
}

要求：
1. 全部用简体中文。
2. cardReadings 数量必须与输入牌数一致，并按输入顺序返回。
3. 内容要有安抚感，但不要夸大、不要承诺结果。
4. 不要提及自己是 AI，也不要要求用户再提供 API key。`;
}

function normalizeResponse(content: string, model: string): ReadingResponse {
  const trimmed = content.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start !== -1 && end !== -1 && start < end) {
    try {
      const parsed = JSON.parse(
        trimmed.slice(start, end + 1),
      ) as Omit<ReadingResponse, "model">;

      if (
        parsed &&
        typeof parsed.summary === "string" &&
        Array.isArray(parsed.cardReadings) &&
        typeof parsed.advice === "string" &&
        typeof parsed.closing === "string"
      ) {
        return {
          summary: parsed.summary,
          cardReadings: parsed.cardReadings.map((item) => ({
            position: item.position,
            cardName: item.cardName,
            orientation: item.orientation === "逆位" ? "逆位" : "正位",
            reading: item.reading,
          })),
          advice: parsed.advice,
          closing: parsed.closing,
          model,
        };
      }
    } catch {
      // Fall through to the text-based fallback below.
    }
  }

  return {
    summary: "本次解读已成功生成，但模型返回了非标准结构，因此改用稳妥模式整理结果。",
    cardReadings: [],
    advice: trimmed,
    closing: "请把最触动你的那一句，当作这次牌面的重点。",
    model,
  };
}

export async function generateReading(input: ReadingRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  if (!apiKey) {
    throw new Error("服务端缺少 GROQ_API_KEY 环境变量。");
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content:
            "你是一位专业的中文塔罗咨询师。必须严格返回 JSON 对象，不能包含代码块或解释文字。",
        },
        {
          role: "user",
          content: buildPrompt(input),
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq 请求失败：${response.status} ${text}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq 没有返回可用内容。");
  }

  return normalizeResponse(content, model);
}
