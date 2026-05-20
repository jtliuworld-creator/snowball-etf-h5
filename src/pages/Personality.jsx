import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { analytics } from '../utils/analytics.js'

export default function Personality() {
  const navigate = useNavigate()
  const { state } = useGame()
  const pd = state.personalityData

  useEffect(() => { analytics.pageView('personality') }, [])

  useEffect(() => {
    if (!pd) navigate('/', { replace: true })
  }, [pd, navigate])

  if (!pd) return <div className="page personality-page" />


  return (
    <div className="page personality-page">
      <div className="personality-glow" />

      <div className="personality-content">
        <div className="personality-emoji">{pd.emoji}</div>
        <div className="personality-label">你的老板类型</div>
        <h2 className="personality-name">{pd.name}</h2>
        <p className="personality-desc">{pd.description}</p>

        <div className="personality-formation-card">
          <div className="pfc-label">系统推荐阵型</div>
          <div className="pfc-formation">{pd.recommendedFormation}</div>
          <div className="pfc-sublabel">你可以在下一步中更换</div>
        </div>

        <div className="personality-tags">
          {pd.forwardTags.map(t => (
            <span key={t} className="personality-tag">{t}</span>
          ))}
        </div>

        <button className="btn-primary btn-large" onClick={() => navigate('/formation')}>
          确认，开始排兵布阵 →
        </button>
        <button className="btn-ghost" onClick={() => navigate('/quiz')}>
          重新测试
        </button>
      </div>

      <div className="risk-tip">
        本活动为雪球社区趣味互动内容，不构成任何投资建议。基金有风险，投资需谨慎。
      </div>
    </div>
  )
}
