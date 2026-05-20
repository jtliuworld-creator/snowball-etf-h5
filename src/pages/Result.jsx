import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { SCORE_LABELS } from '../utils/scoring.js'
import { analytics } from '../utils/analytics.js'
import FieldView from '../components/FieldView.jsx'
import ScoreBar from '../components/ScoreBar.jsx'

const SCORE_COLORS = {
  offense: '#ff6b35',
  defense: '#3a5fcd',
  control: '#4dabf7',
  balance: '#ffb800',
  personality: '#cc5de8',
}

export default function Result() {
  const navigate = useNavigate()
  const { state, dispatch } = useGame()
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(state.teamName)

  useEffect(() => { analytics.pageView('result') }, [])

  useEffect(() => {
    if (!state.scores) navigate('/', { replace: true })
  }, [state.scores, navigate])

  if (!state.scores) return <div className="page result-page" />


  function saveName() {
    const cleaned = nameInput.replace(/[^一-龥a-zA-Z0-9\s]/g, '').slice(0, 10)
    dispatch({ type: 'SET_TEAM_NAME', payload: cleaned || state.teamName })
    setEditingName(false)
  }

  const etfList = [
    { label: '⚡ 前锋', etf: state.selectedEtfs.forward },
    { label: '💫 中场', etf: state.selectedEtfs.midfielder },
    { label: '🛡️ 后卫', etf: state.selectedEtfs.defender },
    { label: '🥅 门将', etf: state.selectedEtfs.goalkeeper },
  ]

  return (
    <div className="page result-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/select')}>← 返回</button>
        <h2 className="page-header-title">我的ETF阵容</h2>
      </div>

      {/* 队名 */}
      <div className="result-team-name-wrap">
        {editingName ? (
          <div className="team-name-edit">
            <input
              className="team-name-input"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              maxLength={10}
              autoFocus
            />
            <button className="btn-sm" onClick={saveName}>确认</button>
          </div>
        ) : (
          <div className="result-team-name" onClick={() => setEditingName(true)}>
            🏆 {state.teamName} <span className="edit-hint">✏️</span>
          </div>
        )}
        <div className="result-formation-tag">{state.formation} · {state.personalityData?.name || ''}</div>
      </div>

      {/* 球场 */}
      <FieldView formation={state.formation} selectedEtfs={state.selectedEtfs} />

      {/* 已选球员列表 */}
      <div className="result-etf-list">
        {etfList.map(({ label, etf }) => etf && (
          <div key={label} className="result-etf-row">
            <span className="result-etf-pos">{label}</span>
            <span className="result-etf-name">{etf.name}</span>
            <span className="result-etf-company">{etf.fundCompany}</span>
          </div>
        ))}
      </div>

      {/* 评分 */}
      <div className="result-scores">
        <div className="result-scores-title">⚽ 阵容战力评分</div>
        {Object.entries(state.scores).map(([key, val]) => (
          <ScoreBar
            key={key}
            label={SCORE_LABELS[key]}
            value={val}
            color={SCORE_COLORS[key]}
          />
        ))}
      </div>

      {/* 点评 */}
      <div className="result-comment">
        <div className="result-comment-icon">💬</div>
        <p>{state.comment}</p>
      </div>

      <div className="risk-tip-sm">
        阵容评分由活动规则生成，仅用于趣味展示，不代表产品未来表现。
      </div>

      <div className="result-likes-card">
        <div className="rlc-left">
          <div className="rlc-heart">❤️</div>
          <div>
            <div className="rlc-title">想冲榜赢奖品？</div>
            <div className="rlc-hint">保存海报 → 在<b>雪球活动主贴</b>评论区跟帖发布 → 球友点赞</div>
          </div>
        </div>
        <button className="rlc-rules" onClick={() => navigate('/rules')}>奖品规则 →</button>
      </div>

      <div className="result-actions">
        <button className="btn-primary btn-large" onClick={() => navigate('/poster')}>
          🎨 生成分享海报
        </button>
        <button className="btn-ghost" onClick={() => navigate('/rankings')}>
          查看热门榜单 →
        </button>
        <button className="btn-ghost" onClick={() => { dispatch({ type: 'RESET' }); navigate('/') }}>
          重新组队
        </button>
      </div>

      <div className="risk-tip">
        本活动为雪球社区趣味互动内容，不构成任何投资建议。基金有风险，投资需谨慎。
      </div>
    </div>
  )
}
