import { FORMATIONS } from '../data/formations.js'

export function calcLineupScores(selectedEtfs, formation) {
  const etfs = Object.values(selectedEtfs).filter(Boolean)
  if (etfs.length === 0) return null

  const avg = (key) => Math.round(etfs.reduce((s, e) => s + e.scores[key], 0) / etfs.length)
  const bonus = FORMATIONS[formation]?.bonus || { offense: 0, defense: 0, control: 0 }
  const allFilled = etfs.length === 4

  const raw = {
    offense: Math.min(100, avg('offense') + bonus.offense),
    defense: Math.min(100, avg('defense') + bonus.defense),
    control: Math.min(100, avg('control') + bonus.control),
    balance: Math.min(100, avg('balance') + (allFilled ? 5 : 0)),
    personality: Math.min(100, avg('personality')),
  }

  return raw
}

export function calcComment(scores) {
  if (!scores) return ''
  const { offense, defense, control, balance, personality } = scores

  if (personality >= 80) {
    return '你的阵容很有个人审美，不是全跟热门走。你更像一位有自己战术想法的球队老板。'
  }
  if (balance >= 85) {
    return '这是一套进可攻、退可守的成熟阵容。你不是在赌一脚世界波，而是在搭一支能踢完整赛季的球队。'
  }
  if (control >= 80) {
    return '你的阵容中场很厚，节奏感很强。它不是靠单点爆发，而是靠整体结构运转。'
  }
  if (offense >= 80 && defense < 65) {
    return '你的阵容火力很猛，像一支前场压迫型球队。机会来时冲得快，但后防不能完全放空。'
  }
  if (defense >= 80 && offense < 65) {
    return '你的阵容防守很稳，像一支擅长守住底线的球队。它未必天天进球，但更重视活到终场。'
  }
  return '你搭建了一支有自己特色的球队，进可攻、退可守，等待属于你的高光时刻。'
}

const SCORE_LABELS = {
  offense: '进攻力',
  defense: '防守力',
  control: '控场力',
  balance: '平衡度',
  personality: '个性值',
}

export { SCORE_LABELS }
