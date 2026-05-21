import { analytics } from '../utils/analytics.js'

const POSITION_COLORS = {
  forward: { bg: '#ff6b35', label: '前锋' },
  midfielder: { bg: '#4dabf7', label: '中场' },
  defender: { bg: '#3a5fcd', label: '后卫' },
  goalkeeper: { bg: '#f5a623', label: '门将' },
}

// Deterministic mock 近一周涨跌幅（基于 etf.id 哈希出 -5.00% ~ +5.00%）
// TODO: 接接口后从后端取真实数据
function getWeeklyChange(etfId) {
  const hash = [...(etfId || '')].reduce((s, c) => s + c.charCodeAt(0), 0)
  const value = (((hash * 7919) % 1001) - 500) / 100
  return Math.round(value * 100) / 100
}

function ChangeBadge({ value }) {
  const positive = value >= 0
  const cls = positive ? 'etf-change-up' : 'etf-change-down'
  const sign = positive ? '+' : ''
  return <span className={`etf-change ${cls}`}>{sign}{value.toFixed(2)}%</span>
}

export default function EtfCard({ etf, selected, onSelect, featured = false }) {
  const pos = POSITION_COLORS[etf.position] || POSITION_COLORS.forward
  const change = getWeeklyChange(etf.id)

  function handleClick() {
    if (etf.sponsored) analytics.sponsorCardClick(etf.id)
    else analytics.etfCardView(etf.id)
    onSelect?.(etf)
  }

  return (
    <div
      className={`etf-card-row ${selected ? 'selected' : ''} ${featured ? 'featured' : ''}`}
      onClick={handleClick}
    >
      {featured && <span className="etf-featured-badge">今日推荐</span>}

      <div className="etf-row-main">
        <span className="etf-pos-pill" style={{ background: pos.bg }}>{pos.label}</span>
        <span className="etf-row-name">{etf.name}</span>
        <ChangeBadge value={change} />
      </div>

      <div className="etf-row-meta">{etf.fundCompany} · {etf.code}</div>

      <div className="etf-row-sub">
        <span className="etf-row-desc">{etf.description}</span>
      </div>

      <div className="etf-row-foot">
        <span className="etf-risk" data-level={etf.riskLevel}>风险 {etf.riskLevel}</span>
        <span className="etf-skill-mini">⚡ {etf.skill}</span>
        {selected && <span className="etf-selected-mark">✓ 已选</span>}
      </div>
    </div>
  )
}
