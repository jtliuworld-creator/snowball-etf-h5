import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { ETF_POOL } from '../data/etfs.js'
import { calcLineupScores, calcComment } from '../utils/scoring.js'
import { analytics, saveSelection } from '../utils/analytics.js'
import EtfCard from '../components/EtfCard.jsx'

const TABS = [
  { key: 'forward', label: '⚡ 前锋', color: '#ff6b35' },
  { key: 'midfielder', label: '💫 中场', color: '#4dabf7' },
  { key: 'defender', label: '🛡️ 后卫', color: '#3a5fcd' },
  { key: 'goalkeeper', label: '🥅 门将', color: '#f5a623' },
]

export default function Select() {
  const navigate = useNavigate()
  const { state, dispatch } = useGame()
  const [activeTab, setActiveTab] = useState('forward')

  useEffect(() => { analytics.pageView('select') }, [])

  const selected = state.selectedEtfs
  const filledCount = Object.values(selected).filter(Boolean).length
  const allFilled = filledCount === 4

  function selectEtf(etf) {
    dispatch({ type: 'SET_ETF', position: etf.position, etf })
    analytics.etfSelect(etf.id, etf.position)
    // Auto-advance to next empty tab
    const keys = ['forward', 'midfielder', 'defender', 'goalkeeper']
    const nextEmpty = keys.find(k => k !== etf.position && !selected[k])
    if (nextEmpty) setTimeout(() => setActiveTab(nextEmpty), 300)
  }

  function handleDone() {
    const scores = calcLineupScores(state.selectedEtfs, state.formation)
    const comment = calcComment(scores)
    dispatch({ type: 'SET_SCORES', scores, comment })
    saveSelection(state.selectedEtfs, state.formation)
    analytics.lineupCreate({ formation: state.formation, personality: state.personality })
    navigate('/result')
  }

  const pool = ETF_POOL[activeTab] || []

  return (
    <div className="page select-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/formation')}>← 返回</button>
        <h2 className="page-header-title">选择ETF球员</h2>
        <span className="select-progress-badge">{filledCount}/4</span>
      </div>

      {/* 已选概览 */}
      <div className="select-overview">
        {TABS.map(tab => (
          <div
            key={tab.key}
            className={`select-slot ${selected[tab.key] ? 'filled' : ''} ${activeTab === tab.key ? 'active' : ''}`}
            style={{ borderColor: activeTab === tab.key ? tab.color : undefined }}
            onClick={() => setActiveTab(tab.key)}
          >
            <div className="select-slot-label" style={{ color: tab.color }}>{tab.label}</div>
            <div className="select-slot-value">
              {selected[tab.key] ? selected[tab.key].name : '待选'}
            </div>
          </div>
        ))}
      </div>

      {/* 分类 Tab */}
      <div className="select-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`select-tab ${activeTab === tab.key ? 'active' : ''}`}
            style={activeTab === tab.key ? { background: tab.color, borderColor: tab.color } : {}}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ETF 列表 */}
      <div className="select-list">
        {pool.map(etf => (
          <EtfCard
            key={etf.id}
            etf={etf}
            selected={selected[activeTab]?.id === etf.id}
            onSelect={selectEtf}
          />
        ))}
      </div>

      <div className="page-bottom">
        <button
          className={`btn-primary btn-large ${!allFilled ? 'disabled' : ''}`}
          onClick={allFilled ? handleDone : undefined}
          disabled={!allFilled}
        >
          {allFilled ? '生成阵容评分 →' : `还需选 ${4 - filledCount} 个位置`}
        </button>
      </div>

      <div className="risk-tip">
        页面展示的ETF仅作为活动候选，不代表收益承诺或投资建议。基金有风险，投资需谨慎。
      </div>
    </div>
  )
}
