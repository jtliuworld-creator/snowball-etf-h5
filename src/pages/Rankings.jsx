import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRankings } from '../utils/analytics.js'
import { ETF_POOL } from '../data/etfs.js'
import { analytics } from '../utils/analytics.js'

const TABS = [
  { key: 'forward', label: '⚡ 前锋' },
  { key: 'midfielder', label: '💫 中场' },
  { key: 'defender', label: '🛡️ 后卫' },
  { key: 'goalkeeper', label: '🥅 门将' },
  { key: 'formation', label: '📐 阵型' },
]

// 用预置数据做榜单默认展示（无真实后台时）
function buildDefaultRankings() {
  const defaults = { forward: [], midfielder: [], defender: [], goalkeeper: [], formation: [] }
  ;['forward', 'midfielder', 'defender', 'goalkeeper'].forEach(pos => {
    defaults[pos] = ETF_POOL[pos].slice(0, 5).map((etf, i) => ({
      etf,
      count: Math.max(10, 80 - i * 15 + Math.floor(Math.random() * 8)),
    }))
  })
  defaults.formation = [
    { name: '4-3-3', count: 142 },
    { name: '4-4-2', count: 98 },
    { name: '5-3-2', count: 76 },
    { name: '3-4-3', count: 54 },
    { name: '4-5-1', count: 40 },
  ]
  return defaults
}

export default function Rankings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('forward')
  const [rankings, setRankings] = useState(null)

  useEffect(() => {
    analytics.pageView('rankings')
    const real = getRankings()
    const defaults = buildDefaultRankings()
    // 把真实选择次数叠加到默认榜单上（真实后台上线前的 fallback）
    ;['forward', 'midfielder', 'defender', 'goalkeeper'].forEach(pos => {
      real[pos].forEach(({ etf, count }) => {
        const found = defaults[pos].find(d => d.etf.id === etf.id)
        if (found) found.count += count
        else defaults[pos].push({ etf, count })
      })
      defaults[pos].sort((a, b) => b.count - a.count)
    })
    if (real.formation.length > 0) {
      real.formation.forEach(({ name, count }) => {
        const found = defaults.formation.find(f => f.name === name)
        if (found) found.count += count
      })
      defaults.formation.sort((a, b) => b.count - a.count)
    }
    setRankings(defaults)
  }, [])

  function handleTabChange(key) {
    setActiveTab(key)
    analytics.rankingView(key)
  }

  const MEDAL = ['🥇', '🥈', '🥉']

  return (
    <div className="page rankings-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/')}>← 返回</button>
        <h2 className="page-header-title">热门ETF球员榜</h2>
      </div>

      <div className="rankings-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`rankings-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => handleTabChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rankings-list">
        {!rankings && <div className="rankings-loading">加载中...</div>}

        {rankings && activeTab !== 'formation' && (
          rankings[activeTab].map((item, i) => (
            <div key={item.etf.id} className="ranking-row">
              <div className="ranking-rank">{MEDAL[i] || `${i + 1}`}</div>
              <div className="ranking-info">
                <div className="ranking-name">{item.etf.name}</div>
                <div className="ranking-meta">
                  {item.etf.fundCompany} · {item.etf.skill}
                </div>
              </div>
              <div className="ranking-count">
                <span className="ranking-count-num">{item.count}</span>
                <span className="ranking-count-label">人选择</span>
              </div>
            </div>
          ))
        )}

        {rankings && activeTab === 'formation' && (
          rankings.formation.map((item, i) => (
            <div key={item.name} className="ranking-row">
              <div className="ranking-rank">{MEDAL[i] || `${i + 1}`}</div>
              <div className="ranking-info">
                <div className="ranking-name">{item.name}</div>
                <div className="ranking-meta">阵型</div>
              </div>
              <div className="ranking-count">
                <span className="ranking-count-num">{item.count}</span>
                <span className="ranking-count-label">人使用</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="page-bottom">
        <button className="btn-primary btn-large" onClick={() => navigate('/')}>
          回到首页，开始组队 →
        </button>
      </div>

      <div className="risk-tip">
        榜单根据用户选择热度生成，不代表产品优劣或未来收益。基金有风险，投资需谨慎。
      </div>
    </div>
  )
}
