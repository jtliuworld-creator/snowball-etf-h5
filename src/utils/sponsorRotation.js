/**
 * 招商客户「跑马灯」轮转机制
 *
 * 已付费的招商客户占据每个位置 ETF 列表的头部「头牌位」。
 * 活动第 1 天按签约顺序排列，此后每天整体轮转一位，
 * 保证每个客户在轮转周期内都能轮到「第一位 / 今日推荐」曝光。
 *
 * 示例（签约顺序：华夏 → 易方达 → 富国）：
 *   第 1 天：① 华夏   ② 易方达  ③ 富国
 *   第 2 天：① 易方达  ② 富国   ③ 华夏
 *   第 3 天：① 富国   ② 华夏   ③ 易方达
 *   第 4 天：回到第 1 天，循环往复
 *
 * 每个招商客户在所属位置贡献其「头牌产品」（sortWeight 最高的一只）占据头牌位，
 * 其余产品按权重落入普通列表。
 */

// 活动开始日期 —— 用于计算"活动第几天"，确保第 1 天的排序可控
const ACTIVITY_START = '2026-06-12'

// 已付费招商客户名单，按签约先后顺序排列
// TODO: 接接口后从后端 /api/etf-campaign/sponsors 拉取
const PAID_SPONSORS = ['华夏基金', '易方达基金', '富国基金']

function activityDayIndex() {
  const start = new Date(ACTIVITY_START + 'T00:00:00').getTime()
  const day = Math.floor((Date.now() - start) / 86400000)
  return day < 0 ? 0 : day
}

/** 返回今日招商客户排序（跑马灯轮转后的顺序） */
export function getTodaySponsorOrder() {
  const n = PAID_SPONSORS.length
  if (n === 0) return []
  const shift = activityDayIndex() % n
  return [...PAID_SPONSORS.slice(shift), ...PAID_SPONSORS.slice(0, shift)]
}

/** 今日排在第一位的招商客户（即"今日推荐") */
export function getTodayTopSponsor() {
  return getTodaySponsorOrder()[0] || ''
}

/** 判断某基金公司是否为付费招商客户（其产品需强制加自选） */
export function isPaidSponsor(company) {
  return PAID_SPONSORS.includes(company)
}

/** 从阵容里筛出"付费招商客户"的产品代码（仅这些需要加自选） */
export function getPaidProductCodes(selectedEtfs) {
  const codes = []
  for (const list of Object.values(selectedEtfs || {})) {
    for (const etf of (Array.isArray(list) ? list : [list])) {
      if (etf && isPaidSponsor(etf.fundCompany)) codes.push(etf.code)
    }
  }
  return codes
}

/**
 * 按今日轮转给某个位置的 ETF 列表排序：
 * 1. 每个招商客户取它在本列表里 sortWeight 最高的 1 只，作为「头牌产品」
 * 2. 头牌产品按今日轮转顺序占据列表前列
 * 3. 其余产品（含招商客户的非头牌产品）按 sortWeight 降序排在后面
 */
export function sortPoolByRotation(pool) {
  const order = getTodaySponsorOrder()
  const headliners = []
  const usedIds = new Set()

  for (const company of order) {
    const candidates = pool.filter(e => e.fundCompany === company)
    if (candidates.length === 0) continue
    const best = candidates.reduce((m, e) => ((e.sortWeight || 0) > (m.sortWeight || 0) ? e : m))
    headliners.push(best)
    usedIds.add(best.id)
  }

  const rest = pool
    .filter(e => !usedIds.has(e.id))
    .sort((a, b) => (b.sortWeight || 0) - (a.sortWeight || 0))

  return [...headliners, ...rest]
}
