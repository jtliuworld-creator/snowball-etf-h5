import { analytics } from '../utils/analytics.js'

const POSITION_COLORS = {
  forward: { bg: '#ff6b35', label: '前锋' },
  midfielder: { bg: '#4dabf7', label: '中场' },
  defender: { bg: '#3a5fcd', label: '后卫' },
  goalkeeper: { bg: '#f5a623', label: '门将' },
}

export default function EtfCard({ etf, selected, onSelect, compact = false }) {
  const pos = POSITION_COLORS[etf.position] || POSITION_COLORS.forward

  function handleClick() {
    if (etf.sponsored) analytics.sponsorCardClick(etf.id)
    else analytics.etfCardView(etf.id)
    onSelect?.(etf)
  }

  if (compact) {
    return (
      <div className={`etf-card-compact ${selected ? 'selected' : ''}`} onClick={handleClick}>
        <span className="etf-card-compact-name">{etf.name}</span>
        <span className="etf-card-compact-company">{etf.fundCompany}</span>
        {selected && <span className="etf-check">✓</span>}
      </div>
    )
  }

  return (
    <div className={`etf-card ${selected ? 'selected' : ''} ${etf.sponsored ? 'sponsored' : ''}`} onClick={handleClick}>
      {etf.sponsored && <span className="etf-sponsor-badge">赞助</span>}
      <div className="etf-card-header">
        <span className="etf-pos-badge" style={{ background: pos.bg }}>{pos.label}</span>
        <span className="etf-skill">⚡ {etf.skill}</span>
      </div>
      <div className="etf-card-name">{etf.name}</div>
      <div className="etf-card-company">{etf.fundCompany} · {etf.code}</div>
      <div className="etf-card-tags">
        {etf.tags.map(t => <span key={t} className="etf-tag">{t}</span>)}
      </div>
      <div className="etf-card-desc">{etf.description}</div>
      <div className="etf-card-footer">
        <span className="etf-risk" data-level={etf.riskLevel}>风险: {etf.riskLevel}</span>
        {selected && <span className="etf-selected-mark">✓ 已选</span>}
      </div>
    </div>
  )
}
