export type TarotCard = {
  id: string;
  name: string;
  arcana: string;
  tone: string;
  upright: string;
  reversed: string;
  prompt: string;
};

export const spreadPositions = [
  {
    key: "past",
    label: "过去",
    description: "影响你此刻状态的底层线索",
  },
  {
    key: "present",
    label: "现在",
    description: "当下最需要被看见的能量",
  },
  {
    key: "future",
    label: "未来",
    description: "接下来最可能展开的走向",
  },
] as const;

export const tarotDeck: TarotCard[] = [
  {
    id: "the-fool",
    name: "愚者",
    arcana: "大阿卡那",
    tone: "启程",
    upright: "你正在靠近一段新的旅程，信任直觉比过度求稳更重要。",
    reversed: "方向感有些松散，先厘清真正想投入的事情，再决定下一步。",
    prompt: "把注意力放在那个让你既紧张又兴奋的选择上。",
  },
  {
    id: "the-magician",
    name: "魔术师",
    arcana: "大阿卡那",
    tone: "掌控",
    upright: "资源已经在你手里，关键不是等待时机，而是主动组合手上的能力。",
    reversed: "容易分心或高估外部条件，先把最核心的一项行动做扎实。",
    prompt: "你真正可以调动的能力，可能比你以为的更多。",
  },
  {
    id: "the-high-priestess",
    name: "女祭司",
    arcana: "大阿卡那",
    tone: "洞察",
    upright: "答案正在安静地浮现，给自己一点停顿，信息会变得更清晰。",
    reversed: "如果你一直忽略内在感受，外界再多建议也难以替代你的判断。",
    prompt: "试着区分“我知道”与“我害怕知道”。",
  },
  {
    id: "the-empress",
    name: "皇后",
    arcana: "大阿卡那",
    tone: "丰盛",
    upright: "适合照顾关系、审美与创造力，你的柔软正在变成力量。",
    reversed: "过度付出会消耗自己，边界感会让你的温柔更有价值。",
    prompt: "问问自己，什么事情真正值得被耐心灌溉。",
  },
  {
    id: "the-lovers",
    name: "恋人",
    arcana: "大阿卡那",
    tone: "选择",
    upright: "你面对的不是单纯二选一，而是价值观的校准与承诺。",
    reversed: "关系或决定里存在摇摆，先确认你是否忠于自己的核心需求。",
    prompt: "真正的连接，往往来自诚实而不是讨好。",
  },
  {
    id: "the-chariot",
    name: "战车",
    arcana: "大阿卡那",
    tone: "推进",
    upright: "当你统一意志与行动，局势会开始朝你设定的方向移动。",
    reversed: "推进感受阻，说明你需要先整合内在分裂，而不是继续硬撑。",
    prompt: "速度不是重点，方向一致才是。",
  },
  {
    id: "strength",
    name: "力量",
    arcana: "大阿卡那",
    tone: "韧性",
    upright: "真正的力量不是压制，而是温柔而坚定地驯服混乱。",
    reversed: "疲惫可能正在放大自我怀疑，你需要恢复，而不是证明。",
    prompt: "允许自己慢一点，稳定比爆发更可贵。",
  },
  {
    id: "the-star",
    name: "星星",
    arcana: "大阿卡那",
    tone: "疗愈",
    upright: "低潮正在褪去，希望不是幻想，而是你重新连接生命感的开始。",
    reversed: "如果暂时看不到光，也不代表它不存在，你只是需要一点时间。",
    prompt: "先去做一件让你觉得自己还活着的事。",
  },
  {
    id: "the-moon",
    name: "月亮",
    arcana: "大阿卡那",
    tone: "潜意识",
    upright: "情绪、投射和未说出口的部分正在影响判断，慢下来很重要。",
    reversed: "迷雾正在散开，你将逐渐看见先前不愿承认的事实。",
    prompt: "不是所有不确定都危险，有些只是尚未命名。",
  },
];
