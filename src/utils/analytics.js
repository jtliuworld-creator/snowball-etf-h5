// 埋点工具 — MVP 阶段输出到 console，后续接真实 SDK 替换 track 函数即可
function track(event, props = {}) {
  const payload = { event, ...props, ts: Date.now() }
  console.log('[埋点]', payload)
  // 后续替换为: window._xq?.track(event, props) 或 其他 SDK
}

export const analytics = {
  pageView: (page) => track('campaign_page_view', { page }),
  quizStart: () => track('quiz_start'),
  quizComplete: (personality) => track('quiz_complete', { personality }),
  formationView: () => track('formation_view'),
  formationChange: (formation) => track('formation_change', { formation }),
  etfCardView: (etfId) => track('etf_card_view', { etfId }),
  etfSelect: (etfId, position) => track('etf_select', { etfId, position }),
  lineupCreate: (data) => track('lineup_create', data),
  posterGenerate: () => track('poster_generate'),
  posterSave: () => track('poster_save'),
  shareClick: () => track('share_click'),
  rankingView: (tab) => track('ranking_view', { tab }),
  productDetailClick: (etfId) => track('product_detail_click', { etfId }),
  sponsorCardClick: (etfId) => track('sponsor_card_click', { etfId }),
  lineupLike: (lineupId) => track('lineup_like', { lineupId }),
  rulesView: () => track('rules_view'),
}

// 点赞数据 mock — 上线后替换为接口
const LIKES_KEY = 'etf_wc_likes'
const MY_LIKES_KEY = 'etf_wc_my_likes'

function today() { return new Date().toISOString().slice(0, 10) }

export function getLineupLikes(lineupId) {
  try {
    const all = JSON.parse(localStorage.getItem(LIKES_KEY) || '{}')
    return all[lineupId]?.count || 0
  } catch (_) { return 0 }
}

export function hasLikedToday(lineupId) {
  try {
    const my = JSON.parse(localStorage.getItem(MY_LIKES_KEY) || '{}')
    return my[lineupId] === today()
  } catch (_) { return false }
}

export function likeLineup(lineupId) {
  try {
    if (hasLikedToday(lineupId)) return { ok: false, reason: 'already_liked_today' }
    const all = JSON.parse(localStorage.getItem(LIKES_KEY) || '{}')
    all[lineupId] = { count: (all[lineupId]?.count || 0) + 1, ts: Date.now() }
    localStorage.setItem(LIKES_KEY, JSON.stringify(all))
    const my = JSON.parse(localStorage.getItem(MY_LIKES_KEY) || '{}')
    my[lineupId] = today()
    localStorage.setItem(MY_LIKES_KEY, JSON.stringify(my))
    analytics.lineupLike(lineupId)
    return { ok: true, count: all[lineupId].count }
  } catch (_) { return { ok: false, reason: 'storage_error' } }
}

// 给当前用户阵容一个稳定 id，分享/统计用
const MY_LINEUP_ID_KEY = 'etf_wc_my_lineup_id'
export function getOrCreateMyLineupId() {
  let id = localStorage.getItem(MY_LINEUP_ID_KEY)
  if (!id) {
    id = 'lu_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
    localStorage.setItem(MY_LINEUP_ID_KEY, id)
  }
  return id
}

// 榜单数据持久化到 localStorage
const STORAGE_KEY = 'etf_wc_selections'

export function saveSelection(selectedEtfs, formation) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    stored.push({
      ...selectedEtfs,
      formation,
      ts: Date.now(),
    })
    // 仅保留最近 500 条避免爆 storage
    const trimmed = stored.slice(-500)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (_) {}
}

export function getRankings() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const countMap = { forward: {}, midfielder: {}, defender: {}, goalkeeper: {}, formation: {} }

    stored.forEach(item => {
      ;['forward', 'midfielder', 'defender', 'goalkeeper'].forEach(pos => {
        // 兼容旧格式（单选对象）和新格式（数组多选）
        const etfsAtPos = Array.isArray(item[pos]) ? item[pos] : (item[pos] ? [item[pos]] : [])
        etfsAtPos.forEach(etf => {
          if (etf && etf.id) {
            countMap[pos][etf.id] = (countMap[pos][etf.id] || 0) + 1
            countMap[pos][`_etf_${etf.id}`] = etf
          }
        })
      })
      if (item.formation) {
        countMap.formation[item.formation] = (countMap.formation[item.formation] || 0) + 1
      }
    })

    const toRanked = (posMap) =>
      Object.entries(posMap)
        .filter(([k]) => !k.startsWith('_etf_'))
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([id, count]) => ({ etf: posMap[`_etf_${id}`], count }))
        .filter(r => r.etf)

    return {
      forward: toRanked(countMap.forward),
      midfielder: toRanked(countMap.midfielder),
      defender: toRanked(countMap.defender),
      goalkeeper: toRanked(countMap.goalkeeper),
      formation: Object.entries(countMap.formation)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count })),
    }
  } catch (_) {
    return { forward: [], midfielder: [], defender: [], goalkeeper: [], formation: [] }
  }
}
