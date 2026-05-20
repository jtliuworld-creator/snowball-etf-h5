export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: '如果市场突然大涨，你最担心什么？',
    options: [
      { key: 'A', text: '怕没上车，踏空了行情', type: 'aggressive' },
      { key: 'B', text: '怕追高，买在顶部', type: 'control' },
      { key: 'C', text: '怕波动太大，拿不住', type: 'defensive' },
      { key: 'D', text: '怕看不懂方向，不知该如何配置', type: 'balanced' },
    ],
  },
  {
    id: 2,
    question: '你的球队更像哪种风格？',
    options: [
      { key: 'A', text: '全力进攻，追求进球', type: 'aggressive' },
      { key: 'B', text: '中场控球，掌控节奏', type: 'control' },
      { key: 'C', text: '稳守反击，后发制人', type: 'defensive' },
      { key: 'D', text: '攻守均衡，全面发展', type: 'balanced' },
    ],
  },
  {
    id: 3,
    question: '你最想要哪种ETF球员？',
    options: [
      { key: 'A', text: '爆发力强，能带来超额收益', type: 'aggressive' },
      { key: 'B', text: '基本盘稳，宽基指数为核心', type: 'control' },
      { key: 'C', text: '防守能力强，低波动少亏钱', type: 'defensive' },
      { key: 'D', text: '关键时刻能救命，对冲风险', type: 'balanced' },
    ],
  },
]

export const PERSONALITIES = {
  aggressive: {
    key: 'aggressive',
    name: '进攻狂人型老板',
    emoji: '⚡',
    description: '你是一位敢于进攻的球队老板。你愿意把更多资源放在前锋线上，追求进攻弹性和机会捕捉。但系统提醒：火力强不等于没有风险，后防也不能完全空着。',
    recommendedFormation: '3-4-3',
    forwardTags: ['科技成长', 'AI', '半导体'],
  },
  control: {
    key: 'control',
    name: '大师控球型老板',
    emoji: '🎯',
    description: '你更像一位重视节奏的主教练。你不急于猛攻，而是希望通过宽基、中证系列等中场资产掌控组合节奏，以稳定结构致胜。',
    recommendedFormation: '4-5-1',
    forwardTags: ['宽基', '指数', '均衡'],
  },
  defensive: {
    key: 'defensive',
    name: '稳守反击型老板',
    emoji: '🛡️',
    description: '你相信真正的冠军阵容，首先要守得住。你的ETF阵容更适合强化后防，用红利、低波、债券或黄金类资产增强组合韧性，等待反击机会。',
    recommendedFormation: '5-3-2',
    forwardTags: ['红利', '低波', '防御'],
  },
  balanced: {
    key: 'balanced',
    name: '均衡控场型老板',
    emoji: '⚖️',
    description: '你不是只想赌一脚世界波，而是希望球队能踢完整场比赛。你的ETF阵容适合以宽基为中场核心，再搭配少量进攻型资产和防守型资产，构建均衡组合。',
    recommendedFormation: '4-3-3',
    forwardTags: ['均衡', '宽基', '混合'],
  },
}

export function calcPersonality(answers) {
  const counts = { aggressive: 0, control: 0, defensive: 0, balanced: 0 }
  answers.forEach(type => { counts[type] = (counts[type] || 0) + 1 })
  const max = Math.max(...Object.values(counts))
  const priority = ['balanced', 'control', 'defensive', 'aggressive']
  return priority.find(k => counts[k] === max)
}
