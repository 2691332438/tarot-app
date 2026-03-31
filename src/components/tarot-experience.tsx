"use client";

import { useMemo, useState } from "react";
import { spreadPositions, tarotDeck, type TarotCard } from "@/data/tarot";
import type { ReadingResponse } from "@/lib/reading-types";

type DrawnCard = {
  card: TarotCard;
  reversed: boolean;
  position: (typeof spreadPositions)[number];
};

function drawCards() {
  const pool = [...tarotDeck].sort(() => Math.random() - 0.5).slice(0, 3);

  return pool.map((card, index) => ({
    card,
    reversed: Math.random() > 0.5,
    position: spreadPositions[index],
  }));
}

export function TarotExperience() {
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<ReadingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    if (drawnCards.length === 0) {
      return "把问题放在心里，按下抽牌后，让三张牌为你梳理过去、现在与未来。";
    }

    const focus = drawnCards.map((entry) => entry.card.tone).join(" / ");
    return `这组牌的核心主题是 ${focus}。先理解正在发生什么，再决定你要如何回应。`;
  }, [drawnCards]);

  async function handleDraw() {
    if (!question.trim()) {
      setError("先写下你此刻最想确认的问题，我们再开始解读。");
      return;
    }

    const nextCards = drawCards();
    setDrawnCards(nextCards);
    setReading(null);
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          spread: "三张牌 / 过去-现在-未来",
          cards: nextCards.map((entry) => ({
            position: entry.position.label,
            name: entry.card.name,
            reversed: entry.reversed,
            arcana: entry.card.arcana,
            tone: entry.card.tone,
            upright: entry.card.upright,
            reversedMeaning: entry.card.reversed,
            prompt: entry.card.prompt,
          })),
        }),
      });

      const data = (await response.json()) as ReadingResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "暂时无法生成解读。");
      }

      setReading(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "暂时无法生成解读。",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex-1 px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="glass-panel animate-rise overflow-hidden rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-muted">
                Arcana Atelier
              </p>
              <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl">
                在线塔罗抽牌
                <span className="block text-[0.92em] text-accent">
                  极简地看见内心答案
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
                这是一个适合静下来使用的三张牌阵。输入你此刻想确认的问题，抽取牌面后，你会看到过去、现在与未来的提示，以及每张牌的正逆位信息。
              </p>
            </div>

            <div className="glass-panel w-full max-w-sm rounded-[1.75rem] border border-line/80 bg-panel-strong p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-muted">
                Reading Ritual
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-foreground/80">
                <li>1. 先在心里聚焦一个具体问题。</li>
                <li>2. 点击抽牌，查看三张牌的脉络。</li>
                <li>3. 留意最触动你的那一句解释。</li>
              </ol>
            </div>
          </div>
        </section>

        <section
          className="glass-panel animate-rise rounded-[2rem] px-6 py-8 [animation-delay:120ms] md:px-10 md:py-10"
          style={{ animationDelay: "120ms" }}
        >
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <label
                htmlFor="question"
                className="text-sm uppercase tracking-[0.26em] text-muted"
              >
                Your Intention
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="例如：我应该如何看待这段关系的下一步？"
                className="mt-4 min-h-36 w-full resize-none rounded-[1.5rem] border border-line bg-white/50 px-5 py-4 text-base leading-7 outline-none transition focus:border-accent"
              />

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleDraw}
                  className="rounded-full bg-foreground px-6 py-3 text-sm font-medium tracking-[0.18em] text-background transition hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "正在生成解读" : "抽取三张牌"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuestion("");
                    setDrawnCards([]);
                    setReading(null);
                    setError("");
                  }}
                  className="rounded-full border border-line bg-white/40 px-6 py-3 text-sm font-medium tracking-[0.14em] text-foreground transition hover:bg-white/65"
                >
                  清空状态
                </button>
              </div>

              {error ? (
                <p className="mt-4 rounded-2xl border border-rose-900/15 bg-rose-50/70 px-4 py-3 text-sm leading-6 text-rose-900">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="rounded-[1.75rem] border border-line bg-white/30 p-6">
              <p className="text-sm uppercase tracking-[0.26em] text-muted">
                Session Focus
              </p>
              <p className="mt-4 font-serif text-3xl leading-tight">
                {question.trim() || "你的问题还未写下"}
              </p>
              <p className="mt-6 text-sm leading-7 text-muted">{summary}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {drawnCards.length === 0
            ? spreadPositions.map((position, index) => (
                <article
                  key={position.key}
                  className="glass-panel card-sheen animate-rise rounded-[1.75rem] p-6"
                  style={{ animationDelay: `${220 + index * 120}ms` }}
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-muted">
                    {position.label}
                  </p>
                  <div className="mt-6 flex min-h-72 flex-col justify-between rounded-[1.5rem] border border-dashed border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.2))] p-6">
                    <div>
                      <p className="font-serif text-3xl">等待翻开</p>
                      <p className="mt-3 text-sm leading-7 text-muted">
                        {position.description}
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.32em] text-muted">
                      Arcana
                    </p>
                  </div>
                </article>
              ))
            : drawnCards.map((entry, index) => (
                <article
                  key={`${entry.position.key}-${entry.card.id}`}
                  className="glass-panel card-sheen animate-rise rounded-[1.75rem] p-6"
                  style={{ animationDelay: `${220 + index * 120}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-muted">
                        {entry.position.label}
                      </p>
                      <h2 className="mt-4 font-serif text-4xl leading-none">
                        {entry.card.name}
                      </h2>
                    </div>
                    <span className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted">
                      {entry.reversed ? "逆位" : "正位"}
                    </span>
                  </div>

                  <div className="mt-6 rounded-[1.5rem] border border-line bg-[linear-gradient(180deg,rgba(255,252,249,0.92),rgba(250,245,239,0.72))] p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-muted">
                      {entry.card.arcana} / {entry.card.tone}
                    </p>
                    <p className="mt-5 text-sm leading-7 text-foreground/88">
                      {entry.reversed ? entry.card.reversed : entry.card.upright}
                    </p>
                    <p className="mt-5 border-t border-line pt-5 text-sm leading-7 text-muted">
                      {entry.card.prompt}
                    </p>
                  </div>
                </article>
              ))}
        </section>

        <section className="glass-panel animate-rise rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.26em] text-muted">
                  Server Reading
                </p>
                <h3 className="mt-3 font-serif text-3xl">服务端解读结果</h3>
              </div>
              {reading ? (
                <span className="rounded-full border border-line bg-white/40 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted">
                  {reading.model}
                </span>
              ) : null}
            </div>

            {loading ? (
              <div className="rounded-[1.5rem] border border-line bg-white/35 p-6 text-sm leading-7 text-muted">
                正在由服务端调用模型生成解读，这一步完成后，前端就不需要再暴露任何 API key。
              </div>
            ) : reading ? (
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[1.5rem] border border-line bg-white/40 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-muted">
                    Summary
                  </p>
                  <p className="mt-4 text-base leading-8 text-foreground/88">
                    {reading.summary}
                  </p>
                  <p className="mt-6 border-t border-line pt-6 text-sm leading-7 text-muted">
                    {reading.advice}
                  </p>
                  <p className="mt-6 font-serif text-2xl leading-relaxed text-accent">
                    {reading.closing}
                  </p>
                </div>

                <div className="space-y-4">
                  {reading.cardReadings.map((item) => (
                    <article
                      key={`${item.position}-${item.cardName}`}
                      className="rounded-[1.5rem] border border-line bg-white/35 p-5"
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-muted">
                        {item.position} / {item.orientation}
                      </p>
                      <h4 className="mt-3 font-serif text-2xl">{item.cardName}</h4>
                      <p className="mt-4 text-sm leading-7 text-foreground/86">
                        {item.reading}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-line bg-white/20 p-6 text-sm leading-7 text-muted">
                这里会显示由 `/api/reading` 返回的结构化 JSON 结果。等你接好 `GROQ_API_KEY` 后，前端就可以直接消费这个接口了。
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
