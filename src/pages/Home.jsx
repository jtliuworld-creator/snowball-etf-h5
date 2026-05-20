import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { analytics } from '../utils/analytics.js'
import Logo from '../components/Logo.jsx'

export default function Home() {
  const navigate = useNavigate()
  const { dispatch } = useGame()

  useEffect(() => { analytics.pageView('home') }, [])

  function handleStart() {
    dispatch({ type: 'RESET' })
    analytics.quizStart()
    navigate('/quiz')
  }

  return (
    <div className="page home-page">
      <div className="home-field-bg">
        <div className="home-field-lines" />
      </div>

      <div className="home-topbar">
        <Logo height={26} />
        <button className="home-rules-link" onClick={() => navigate('/rules')}>游戏规则 →</button>
      </div>

      <div className="home-content">
        <div className="home-badge">⚽ 做ETF球队老板</div>
        <h1 className="home-title">做自己的<br /><span className="home-title-accent">ETF球队老板</span></h1>
        <p className="home-subtitle">选前锋、配中场、稳后防<br />搭出你的ETF冠军阵容</p>

        <div className="home-cards-preview">
          <div className="home-preview-card forward">前锋<br /><small>科技成长</small></div>
          <div className="home-preview-card midfielder">中场<br /><small>宽基核心</small></div>
          <div className="home-preview-card defender">后卫<br /><small>红利低波</small></div>
          <div className="home-preview-card goalkeeper">门将<br /><small>黄金压舱</small></div>
        </div>

        <button className="btn-primary btn-large" onClick={handleStart}>
          ⚡ 开始组队
        </button>
        <button className="btn-ghost" onClick={() => navigate('/rankings')}>
          查看热门ETF球员榜 →
        </button>

        <div className="home-prize-teaser" onClick={() => navigate('/rules')}>
          <div className="home-prize-title">🏆 5 步参与，集赞赢奖</div>
          <div className="home-prize-row">
            <span className="prize-num">1</span>
            <span className="prize-text">3 题测试找你的"老板风格"</span>
          </div>
          <div className="home-prize-row">
            <span className="prize-num">2</span>
            <span className="prize-text">选阵型 + 配 4 只 ETF 组成球队</span>
          </div>
          <div className="home-prize-row">
            <span className="prize-num">3</span>
            <span className="prize-text">生成海报，跟帖到雪球活动主贴</span>
          </div>
          <div className="home-prize-row">
            <span className="prize-num">4</span>
            <span className="prize-text">🧢 每日点赞 TOP 5 得<b>雪球棒球帽</b></span>
          </div>
          <div className="home-prize-row">
            <span className="prize-num">5</span>
            <span className="prize-text">🥃 累计点赞 TOP 3 得<b>雪球白酒一套</b></span>
          </div>
          <div className="home-prize-cta">查看完整规则 →</div>
        </div>
      </div>

      <div className="risk-tip">
        本活动为雪球社区趣味互动内容，不构成任何投资建议。基金有风险，投资需谨慎。
      </div>
    </div>
  )
}
