import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { SCORE_LABELS } from '../utils/scoring.js'
import { analytics } from '../utils/analytics.js'
import Logo from '../components/Logo.jsx'

export default function Poster() {
  const navigate = useNavigate()
  const { state } = useGame()
  const posterRef = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => { analytics.pageView('poster') }, [])

  useEffect(() => {
    if (!state.scores) navigate('/', { replace: true })
  }, [state.scores, navigate])

  if (!state.scores) return <div className="page poster-page" />


  async function generatePoster() {
    setGenerating(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      setImgSrc(canvas.toDataURL('image/png'))
      analytics.posterGenerate()
    } catch (e) {
      console.error(e)
    } finally {
      setGenerating(false)
    }
  }

  function savePoster() {
    if (!imgSrc) return
    const a = document.createElement('a')
    a.href = imgSrc
    a.download = `${state.teamName}-ETF阵容.png`
    a.click()
    analytics.posterSave()
  }

  async function sharePoster() {
    analytics.shareClick()
    if (navigator.share && imgSrc) {
      const res = await fetch(imgSrc)
      const blob = await res.blob()
      const file = new File([blob], 'etf-lineup.png', { type: 'image/png' })
      try { await navigator.share({ files: [file], title: state.teamName }) } catch (_) {}
    }
  }

  const etfList = [
    { label: '前锋', etf: state.selectedEtfs.forward },
    { label: '中场', etf: state.selectedEtfs.midfielder },
    { label: '后卫', etf: state.selectedEtfs.defender },
    { label: '门将', etf: state.selectedEtfs.goalkeeper },
  ]

  const posColors = { forward: '#ff6b35', midfielder: '#4dabf7', defender: '#3a5fcd', goalkeeper: '#f5a623' }
  const posKeys = ['forward', 'midfielder', 'defender', 'goalkeeper']

  return (
    <div className="page poster-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/result')}>← 返回</button>
        <h2 className="page-header-title">生成海报</h2>
      </div>

      {/* 海报内容（用于截图） */}
      <div className="poster-canvas-wrap">
        <div ref={posterRef} className="poster-canvas">
          <div className="poster-top-bar">
            <Logo height={28} />
            <span className="poster-badge">⚽ 做ETF球队老板</span>
          </div>
          <h3 className="poster-team-name">🏆 {state.teamName}</h3>
          <div className="poster-personality">{state.personalityData?.name || ''}</div>
          <div className="poster-formation">{state.formation}</div>

          {/* 迷你球场 */}
          <div className="poster-field">
            <div className="poster-field-inner">
              <div className="poster-field-line-h" />
              <div className="poster-field-circle" />
              {posKeys.map(pos => {
                const etf = state.selectedEtfs[pos]
                return (
                  <div key={pos} className={`poster-pos poster-pos-${pos}`}>
                    <div className="poster-pos-dot" style={{ background: posColors[pos] }} />
                    <div className="poster-pos-name">{etf?.name || '?'}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 评分 */}
          <div className="poster-scores">
            {Object.entries(state.scores).map(([key, val]) => (
              <div key={key} className="poster-score-item">
                <span className="poster-score-label">{SCORE_LABELS[key]}</span>
                <span className="poster-score-val">{val}</span>
              </div>
            ))}
          </div>

          {/* 点评 */}
          <div className="poster-comment">{state.comment}</div>

          <div className="poster-prize-strip">
            <span>🧢 每日点赞 TOP 5 雪球棒球帽</span>
            <span className="poster-prize-sep">·</span>
            <span>🥃 累计 TOP 3 雪球白酒一套</span>
          </div>

          <div className="poster-risk">本阵容仅为个人趣味配置展示，不构成投资建议。基金有风险，投资需谨慎。</div>
          <div className="poster-footer">雪球 · 做ETF球队老板</div>
        </div>
      </div>

      {/* 生成后预览 */}
      {imgSrc && (
        <div className="poster-preview">
          <img src={imgSrc} alt="海报预览" className="poster-img" />
        </div>
      )}

      <div className="poster-actions">
        {!imgSrc ? (
          <button className="btn-primary btn-large" onClick={generatePoster} disabled={generating}>
            {generating ? '生成中...' : '🎨 生成海报'}
          </button>
        ) : (
          <>
            <div className="poster-next-step">
              <div className="pns-title">📌 下一步</div>
              <ol className="pns-list">
                <li>保存海报到相册</li>
                <li>打开<b>雪球活动主贴</b></li>
                <li>在评论区<b>跟帖发布海报</b>，等球友点赞</li>
              </ol>
            </div>
            <button className="btn-primary btn-large" onClick={savePoster}>
              💾 保存到相册
            </button>
            {navigator.share && (
              <button className="btn-ghost" onClick={sharePoster}>
                📤 分享
              </button>
            )}
            <button className="btn-ghost" onClick={() => setImgSrc(null)}>
              重新生成
            </button>
          </>
        )}
      </div>

      <div className="risk-tip">
        本活动为雪球社区趣味互动内容，不构成任何投资建议。基金有风险，投资需谨慎。
      </div>
    </div>
  )
}
