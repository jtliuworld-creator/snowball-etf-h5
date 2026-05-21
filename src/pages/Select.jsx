import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { ETF_POOL } from '../data/etfs.js'
import { getPositionCounts, TOTAL_PLAYERS } from '../data/formations.js'
import { calcLineupScores, calcComment } from '../utils/scoring.js'
import { analytics, saveSelection } from '../utils/analytics.js'
import { sortPoolByRotation } from '../utils/sponsorRotation.js'
import EtfCard from '../components/EtfCard.jsx'

const TABS = [
  { key: 'forward', label: '⚡ 前锋', short: '前锋', color: '#ff6b35' },
  { key: 'midfielder', label: '💫 中场', short: '中场', color: '#4dabf7' },
  { key: 'defender', label: '🛡️ 后卫', short: '后卫', color: '#3a5fcd' },
  { key: 'goalkeeper', label: '🥅 门将', short: '门将', color: '#f5a623' },
]

export default function Select() {
  const navigate = useNavigate()
  const { state, dispatch } = useGame()
  const [activeTab, setActiveTab] = useState('forward')

  useEffect(() => { analytics.pageView('select') }, [])

  const counts = useMemo(() => getPositionCounts(state.formation), [state.formation])
  const selected = state.selectedEtfs
  const filledTotal = Object.values(selected).reduce((s, arr) => s + arr.length, 0)
  const allFilled = filledTotal === TOTAL_PLAYERS

  function isSelected(etf) {
    return selected[etf.position]?.some(e => e.id === etf.id)
  }

  function toggleEtf(etf) {
    const max = counts[etf.position] || 0
    dispatch({ type: 'TOGGLE_ETF', etf, max })
    analytics.etfSelect(etf.id, etf.position)

    // 选满当前位置 → 自动跳到下一个未满
    const willBeFilled = (selected[etf.position]?.length || 0) + 1 === max
    const alreadyHas = isSelected(etf)
    if (willBeFilled && !alreadyHas) {
      const order = ['forward', 'midfielder', 'defender', 'goalkeeper']
      const nextEmpty = order.find(k => k !== etf.position && (selected[k]?.length || 0) < counts[k])
      if (nextEmpty) setTimeout(() => setActiveTab(nextEmpty), 300)
    }
  }

  function handleDone() {
    const scores = calcLineupScores(selected, state.formation)
    const comment = calcComment(scores)
    dispatch({ type: 'SET_SCORES', scores, comment })
    saveSelection(selected, state.formation)
    analytics.lineupCreate({ formation: state.formation, personality: state.personality })
    navigate('/result')
  }

  const sortedPool = useMemo(() => sortPoolByRotation(ETF_POOL[activeTab] || []), [activeTab])

  return (
    <div className="page select-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/formation')}>← 返回</button>
        <h2 className="page-header-title">选择ETF球员</h2>
        <span className="select-progress-badge">{filledTotal}/{TOTAL_PLAYERS}</span>
      </div>

      {/* 已选概览 4 个 slot */}
      <div className="select-overview">
        {TABS.map(tab => {
          const have = selected[tab.key]?.length || 0
          const need = counts[tab.key]
          const filled = have === need
          return (
            <div
              key={tab.key}
              className={`select-slot ${filled ? 'filled' : ''} ${activeTab === tab.key ? 'active' : ''}`}
              style={{ borderColor: activeTab === tab.key ? tab.color : undefined }}
              onClick={() => setActiveTab(tab.key)}
            >
              <div className="select-slot-label" style={{ color: tab.color }}>{tab.label}</div>
              <div className="select-slot-count">{have}/{need}</div>
            </div>
          )
        })}
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
            {tab.label} <span className="tab-count">{selected[tab.key]?.length || 0}/{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      {/* ETF 列表 */}
      <div className="select-list">
        {sortedPool.map((etf, i) => (
          <EtfCard
            key={etf.id}
            etf={etf}
            selected={isSelected(etf)}
            onSelect={toggleEtf}
            featured={i === 0}
          />
        ))}
      </div>

      <div className="page-bottom">
        {!allFilled && (
          <div className="select-pos-progress">
            {TABS.map(tab => {
              const have = selected[tab.key]?.length || 0
              const need = counts[tab.key]
              const done = have === need
              return (
                <span key={tab.key} className={`spp-item ${done ? 'done' : ''}`}>
                  {tab.short}
                  {done
                    ? <> 已选 {have} 支 ✓</>
                    : <> 已选 {have}，还需 <b>{need - have}</b> 支</>}
                </span>
              )
            })}
          </div>
        )}
        <button
          className={`btn-primary btn-large ${!allFilled ? 'disabled' : ''}`}
          onClick={allFilled ? handleDone : undefined}
          disabled={!allFilled}
        >
          {allFilled ? '生成阵容评分 →' : `还需选 ${TOTAL_PLAYERS - filledTotal} 只`}
        </button>
      </div>

      <div className="risk-tip">
        页面展示的ETF仅作为活动候选，不代表收益承诺或投资建议。基金有风险，投资需谨慎。
      </div>
    </div>
  )
}
