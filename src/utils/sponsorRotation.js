/**
 * 招商客户日轮动 —— 每天换一家基金公司置顶
 * 算法：按 UTC 日期取 mod，N 家公司循环 N 天一轮
 */

// 当前活动周期内的轮值名单（按出场顺序）。
// TODO: 接接口后，从后端 /api/etf-campaign/sponsors 拉取
const SPONSOR_ROTATION = ['华夏基金', '富国基金', '易方达基金', '华安基金', '华宝基金', '华泰柏瑞', '嘉实基金']

/**
 * 返回今天轮到的招商公司名
 */
export function getTodaySponsor() {
  const dayIndex = Math.floor(Date.now() / 86400000)
  return SPONSOR_ROTATION[dayIndex % SPONSOR_ROTATION.length]
}

/**
 * 排序 ETF 列表：今日招商公司的产品置顶（带"今日推荐"标记），
 * 其他 sponsored 产品按 sortWeight 排，最后是普通产品
 */
export function sortPoolByRotation(pool) {
  const today = getTodaySponsor()
  return [...pool].sort((a, b) => {
    const aIsToday = a.sponsored && a.fundCompany === today
    const bIsToday = b.sponsored && b.fundCompany === today
    if (aIsToday !== bIsToday) return aIsToday ? -1 : 1
    if (a.sponsored !== b.sponsored) return a.sponsored ? -1 : 1
    return (b.sortWeight || 0) - (a.sortWeight || 0)
  })
}

/**
 * 判断某只 ETF 是否是"今日推荐"
 */
export function isTodayFeatured(etf) {
  return etf?.sponsored && etf.fundCompany === getTodaySponsor()
}
