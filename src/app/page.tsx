'use client'
import { useState, useEffect } from 'react'
import type { ReadingResponse } from '@/lib/reading-types'

const CARDS = [
  { name: '愚者', nameEn: 'The Fool', symbol: '0', keywords: '新开始 · 冒险 · 自由 · 无限可能', upright: '新的开始、冒险精神、天真无邪', reversed: '鲁莽冲动、意志薄弱、走入歧途' },
  { name: '魔术师', nameEn: 'The Magician', symbol: 'I', keywords: '意志 · 技能 · 创造力 · 自我实现', upright: '意志坚定、技能出众、创造实现', reversed: '欺骗操控、技能滥用、意志涣散' },
  { name: '女祭司', nameEn: 'The High Priestess', symbol: 'II', keywords: '直觉 · 神秘 · 内在智慧 · 潜意识', upright: '直觉清晰、神秘智慧、灵性感知', reversed: '压抑直觉、隐藏秘密、感情封闭' },
  { name: '女皇', nameEn: 'The Empress', symbol: 'III', keywords: '丰盛 · 创造 · 母性 · 自然 · 富饶', upright: '生命丰盛、创造力旺盛、母爱滋养', reversed: '创造受阻、过度依赖、物质损失' },
  { name: '皇帝', nameEn: 'The Emperor', symbol: 'IV', keywords: '权威 · 稳定 · 领导力 · 秩序 · 保护', upright: '权威领导、结构稳定、强大保护', reversed: '专制独裁、控制欲强、缺乏弹性' },
  { name: '教皇', nameEn: 'The Hierophant', symbol: 'V', keywords: '传统 · 精神指引 · 规则 · 婚姻 · 制度', upright: '遵循传统、精神指引、制度婚姻', reversed: '打破传统、叛逆自由、制度腐败' },
  { name: '恋人', nameEn: 'The Lovers', symbol: 'VI', keywords: '爱情 · 选择 · 灵魂伴侣 · 价值观 · 和谐', upright: '真爱降临、灵魂共鸣、正确选择', reversed: '感情失和、错误选择、价值冲突' },
  { name: '战车', nameEn: 'The Chariot', symbol: 'VII', keywords: '意志力 · 胜利 · 决心 · 控制 · 自律', upright: '意志坚定、克服障碍、走向胜利', reversed: '失去控制、方向迷失、遭遇挫败' },
  { name: '力量', nameEn: 'Strength', symbol: 'VIII', keywords: '内在力量 · 勇气 · 耐心 · 慈悲 · 自控', upright: '内在强大、以柔克刚、慈悲耐心', reversed: '自我怀疑、软弱无力、滥用权力' },
  { name: '隐者', nameEn: 'The Hermit', symbol: 'IX', keywords: '内省 · 独处 · 智慧探索 · 引导 · 灵性', upright: '向内寻找、独处沉淀、智慧指引', reversed: '孤立封闭、拒绝帮助、社交退缩' },
  { name: '命运之轮', nameEn: 'Wheel of Fortune', symbol: 'X', keywords: '命运转折 · 好运 · 变化 · 机遇 · 循环', upright: '好运降临、命运转机、把握机遇', reversed: '厄运当头、抗拒变化、命运不顺' },
  { name: '正义', nameEn: 'Justice', symbol: 'XI', keywords: '公正 · 平衡 · 真相 · 因果 · 法律', upright: '公平公正、因果显现、真相大白', reversed: '不公正义、逃避责任、因果报应' },
  { name: '倒吊人', nameEn: 'The Hanged Man', symbol: 'XII', keywords: '暂停 · 牺牲 · 新视角 · 等待 · 顿悟', upright: '换个视角、暂停等待、放手顿悟', reversed: '无谓拖延、无益牺牲、固执抗拒' },
  { name: '死神', nameEn: 'Death', symbol: 'XIII', keywords: '结束 · 转变 · 重生 · 放下 · 蜕变', upright: '旧事终结、蜕变重生、放下过去', reversed: '抗拒改变、停滞腐朽、无法放手' },
  { name: '节制', nameEn: 'Temperance', symbol: 'XIV', keywords: '平衡 · 节制 · 耐心 · 调和 · 疗愈', upright: '内外平衡、耐心调和、身心疗愈', reversed: '失衡极端、缺乏耐心、内心冲突' },
  { name: '恶魔', nameEn: 'The Devil', symbol: 'XV', keywords: '束缚 · 物质执着 · 阴影自我 · 诱惑', upright: '物质束缚、阴影显现、执着上瘾', reversed: '从束缚解脱、觉醒自由、释放阴影' },
  { name: '塔', nameEn: 'The Tower', symbol: 'XVI', keywords: '突变 · 崩塌 · 觉醒 · 解放 · 意外', upright: '突然崩塌、强制觉醒、虚假瓦解', reversed: '延迟灾难、恐惧改变、内部危机' },
  { name: '星星', nameEn: 'The Star', symbol: 'XVII', keywords: '希望 · 灵感 · 指引 · 信念 · 平静更新', upright: '希望重燃、星光指引、内心平静', reversed: '失去希望、缺乏信念、自我怀疑' },
  { name: '月亮', nameEn: 'The Moon', symbol: 'XVIII', keywords: '幻觉 · 恐惧 · 潜意识 · 不确定 · 梦境', upright: '潜意识涌现、直觉警示、迷雾笼罩', reversed: '走出幻觉、恐惧消散、真相显现' },
  { name: '太阳', nameEn: 'The Sun', symbol: 'XIX', keywords: '成功 · 活力 · 光明 · 喜悦 · 自信', upright: '光明喜悦、成功丰盛、充满活力', reversed: '过度自信、短暂挫折、乐观受阻' },
  { name: '审判', nameEn: 'Judgement', symbol: 'XX', keywords: '觉醒 · 更新 · 内在召唤 · 救赎 · 反思', upright: '灵魂觉醒、内心召唤、救赎更新', reversed: '自我怀疑、拒绝改变、忽视内心' },
  { name: '世界', nameEn: 'The World', symbol: 'XXI', keywords: '完成 · 成就 · 整合 · 圆满 · 自由', upright: '圆满完成、旅程终点、整合自由', reversed: '未竟之事、停滞不前、逃避成长' },
]

type Phase = 'question' | 'spread' | 'pick' | 'reading'

interface DrawnCard {
  card: typeof CARDS[0]
  reversed: boolean
  position: string
}

type ReadingState = ReadingResponse | null

export default function Home() {
  const [phase, setPhase] = useState<Phase>('question')
  const [question, setQuestion] = useState('')
  const [spreadType, setSpreadType] = useState<'single' | 'three'>('three')
  const [shuffled, setShuffled] = useState<typeof CARDS>([])
  const [picked, setPicked] = useState<number[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])
  const [reading, setReading] = useState<ReadingState>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [particles, setParticles] = useState<{ x: number, y: number, size: number, dur: number, delay: number }[]>([])

  useEffect(() => {
    setParticles(Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      dur: 3 + Math.random() * 4,
      delay: Math.random() * 4,
    })))
  }, [])

  const needed = spreadType === 'single' ? 1 : 3
  const positions = spreadType === 'single' ? ['当下指引'] : ['过去', '现在', '未来']

  function startShuffle() {
    const s = [...CARDS].sort(() => Math.random() - 0.5)
    setShuffled(s)
    setPicked([])
    setPhase('pick')
  }

  function pickCard(idx: number) {
    if (picked.includes(idx) || picked.length >= needed) return
    const next = [...picked, idx]
    setPicked(next)
    if (next.length === needed) {
      const cards: DrawnCard[] = next.map((i, pos) => ({
        card: shuffled[i],
        reversed: Math.random() < 0.3,
        position: positions[pos],
      }))
      setDrawnCards(cards)
      setTimeout(() => fetchReading(cards), 600)
    }
  }

  async function fetchReading(cards: DrawnCard[]) {
    setPhase('reading')
    setLoading(true)
    setReading(null)
    setError('')

    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          spread: spreadType === 'single' ? '单张牌 / 当下指引' : '三张牌 / 过去-现在-未来',
          cards: cards.map(({ card, reversed, position }) => ({
            position,
            name: card.name,
            reversed,
            arcana: '大阿卡那',
            tone: card.keywords,
            upright: card.upright,
            reversedMeaning: card.reversed,
            prompt: card.keywords,
          })),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '解读失败，请重试')
      }

      setReading(data as ReadingResponse)
    } catch {
      setError('连接失败或解读暂不可用，请稍后重试')
    }
    setLoading(false)
  }

  function reset() {
    setPhase('question')
    setQuestion('')
    setPicked([])
    setDrawnCards([])
    setReading(null)
    setError('')
  }

  return (
    <main className="tarot-root">
      {/* Particles */}
      <div className="particles">
        {particles.map((p, i) => (
          <div key={i} className="particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}
      </div>

      {/* Magic circles */}
      <div className="magic-circle circle-1" />
      <div className="magic-circle circle-2" />

      <div className="content">

        {/* Header */}
        <header className="site-header">
          <div className="logo">
            <span className="logo-symbol">✦</span>
            <span className="logo-text">ARCANA</span>
            <span className="logo-symbol">✦</span>
          </div>
          <p className="logo-sub">命运之眼 · Tarot Oracle</p>
        </header>

        {/* PHASE: Question */}
        {phase === 'question' && (
          <div className="phase-box animate-in">
            <h1 className="phase-title">将你的困惑<br />倾诉给星辰</h1>
            <p className="phase-desc">闭上眼睛，感受内心最深处的那个问题</p>
            <textarea
              className="question-input"
              placeholder="例如：我的感情走向将如何？我现在的方向是否正确？"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              rows={3}
            />
            <div className="spread-row">
              <button
                className={`spread-opt ${spreadType === 'single' ? 'active' : ''}`}
                onClick={() => setSpreadType('single')}
              >单张 · 当下指引</button>
              <button
                className={`spread-opt ${spreadType === 'three' ? 'active' : ''}`}
                onClick={() => setSpreadType('three')}
              >三张 · 过去现在未来</button>
            </div>
            <button
              className="primary-btn"
              disabled={!question.trim()}
              onClick={() => setPhase('spread')}
            >召唤塔罗 ✦</button>
          </div>
        )}

        {/* PHASE: Spread intro */}
        {phase === 'spread' && (
          <div className="phase-box animate-in">
            <div className="ritual-icon">🌙</div>
            <h2 className="phase-title" style={{ fontSize: '1.8rem' }}>洗牌仪式</h2>
            <p className="phase-desc" style={{ maxWidth: 400 }}>
              深呼吸，将你的问题注入意念之中<br />
              当你准备好，点击下方开始洗牌
            </p>
            <div className="card-stack">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="stack-card" style={{
                  transform: `rotate(${(i - 3) * 4}deg) translateY(${Math.abs(i - 3) * 2}px)`,
                  zIndex: 7 - i,
                }} />
              ))}
            </div>
            <button className="primary-btn" onClick={startShuffle}>
              ✦ 开始洗牌 ✦
            </button>
          </div>
        )}

        {/* PHASE: Pick cards */}
        {phase === 'pick' && (
          <div className="pick-phase animate-in">
            <h2 className="phase-title" style={{ fontSize: '1.5rem', marginBottom: 6 }}>
              选择你的牌
            </h2>
            <p className="phase-desc" style={{ marginBottom: 32 }}>
              跟随直觉，点击 {needed} 张牌 · 已选 {picked.length}/{needed}
            </p>
            <div className="fan-container">
              {shuffled.slice(0, 22).map((_, idx) => {
                const total = 22
                const angle = (idx / (total - 1)) * 120 - 60
                const isPicked = picked.includes(idx)
                const isHovered = hoveredCard === idx
                return (
                  <div
                    key={idx}
                    className={`fan-card ${isPicked ? 'picked' : ''} ${isHovered && !isPicked ? 'hovered' : ''}`}
                    style={{
                      transform: `rotate(${angle}deg) translateY(${isPicked ? -120 : isHovered ? -60 : 0}px)`,
                      transitionDelay: `${idx * 0.04}s`,
                      zIndex: isHovered || isPicked ? 100 : idx,
                    }}
                    onClick={() => pickCard(idx)}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="fan-card-inner">
                      <div className="card-back-pattern">
                        <div className="card-back-circle" />
                        <div className="card-back-symbol">✦</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* PHASE: Reading */}
        {phase === 'reading' && (
          <div className="reading-phase animate-in">
            <h2 className="phase-title" style={{ fontSize: '1.6rem', marginBottom: 32 }}>
              ✦ 星辰之语 ✦
            </h2>

            {/* Drawn cards display */}
            <div className="drawn-cards">
              {drawnCards.map((dc, i) => (
                <div key={i} className="drawn-card-wrap">
                  <div className={`drawn-card ${dc.reversed ? 'reversed' : ''}`}>
                    <div className="drawn-card-inner">
                      <div className="drawn-symbol">{dc.card.symbol}</div>
                      <div className="drawn-name">{dc.card.name}</div>
                      <div className="drawn-en">{dc.card.nameEn}</div>
                      {dc.reversed && <div className="reversed-badge">逆位</div>}
                    </div>
                  </div>
                  <div className="drawn-position">{dc.position}</div>
                  <div className="drawn-keywords">{dc.card.keywords}</div>
                </div>
              ))}
            </div>

            {/* Reading text */}
            <div className="reading-box">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-orb" />
                  <p>星辰正在感应中…</p>
                </div>
              ) : error ? (
                <div className="reading-structured">
                  <p className="reading-text">{error}</p>
                </div>
              ) : reading ? (
                <div className="reading-structured">
                  <div className="reading-section-block">
                    <div className="reading-label">整体讯息</div>
                    <p className="reading-text">{reading.summary}</p>
                  </div>

                  <div className="reading-cards-list">
                    {reading.cardReadings.map((item) => (
                      <article key={`${item.position}-${item.cardName}`} className="reading-card-item">
                        <div className="reading-card-head">
                          <span>{item.position}</span>
                          <span>{item.cardName} · {item.orientation}</span>
                        </div>
                        <p className="reading-card-copy">{item.reading}</p>
                      </article>
                    ))}
                  </div>

                  <div className="reading-section-block">
                    <div className="reading-label">行动建议</div>
                    <p className="reading-text">{reading.advice}</p>
                  </div>

                  <div className="reading-closing">{reading.closing}</div>
                </div>
              ) : (
                <p className="reading-text">牌面已经翻开，解读即将显现。</p>
              )}
            </div>

            <button className="primary-btn" onClick={reset} style={{ marginTop: 32 }}>
              ✦ 重新占卜 ✦
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
