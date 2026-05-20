import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { FORMATION_LIST } from '../data/formations.js'
import { analytics } from '../utils/analytics.js'

export default function Formation() {
  const navigate = useNavigate()
  const { state, dispatch } = useGame()

  useEffect(() => { analytics.formationView() }, [])

  function select(name) {
    dispatch({ type: 'SET_FORMATION', payload: name })
    analytics.formationChange(name)
  }

  const sortedFormations = useMemo(() => {
    const recommended = state.personalityData?.recommendedFormation
    if (!recommended) return FORMATION_LIST
    return [...FORMATION_LIST].sort((a, b) => {
      if (a.name === recommended) return -1
      if (b.name === recommended) return 1
      return 0
    })
  }, [state.personalityData])

  return (
    <div className="page formation-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/personality')}>← 返回</button>
        <h2 className="page-header-title">选择阵型</h2>
      </div>

      <div className="formation-hint">系统已为你推荐阵型，也可以自由切换</div>

      <div className="formation-list">
        {sortedFormations.map(f => (
          <div
            key={f.name}
            className={`formation-card ${state.formation === f.name ? 'selected' : ''}`}
            onClick={() => select(f.name)}
          >
            <div className="formation-card-left">
              <div className="formation-card-name">{f.name}</div>
              <div className="formation-card-label">{f.label}</div>
              <div className="formation-card-desc">{f.description}</div>
            </div>
            <div className="formation-card-bonuses">
              {f.bonus.offense !== 0 && (
                <span className={`bonus-chip ${f.bonus.offense > 0 ? 'pos' : 'neg'}`}>
                  进攻 {f.bonus.offense > 0 ? '+' : ''}{f.bonus.offense}
                </span>
              )}
              {f.bonus.defense !== 0 && (
                <span className={`bonus-chip ${f.bonus.defense > 0 ? 'pos' : 'neg'}`}>
                  防守 {f.bonus.defense > 0 ? '+' : ''}{f.bonus.defense}
                </span>
              )}
              {f.bonus.control !== 0 && (
                <span className={`bonus-chip ${f.bonus.control > 0 ? 'pos' : 'neg'}`}>
                  控场 {f.bonus.control > 0 ? '+' : ''}{f.bonus.control}
                </span>
              )}
            </div>
            {state.formation === f.name && (
              <div className="formation-selected-mark">✓</div>
            )}
            {state.personalityData?.recommendedFormation === f.name && (
              <div className="formation-recommend-badge">推荐</div>
            )}
          </div>
        ))}
      </div>

      <div className="page-bottom">
        <button className="btn-primary btn-large" onClick={() => navigate('/select')}>
          确认阵型，选ETF球员 →
        </button>
      </div>

      <div className="risk-tip">
        本活动为雪球社区趣味互动内容，不构成任何投资建议。基金有风险，投资需谨慎。
      </div>
    </div>
  )
}
