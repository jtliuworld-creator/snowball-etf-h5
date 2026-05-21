import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { useGame } from '../context/GameContext.jsx'
import { SCORE_LABELS } from '../utils/scoring.js'
import { analytics } from '../utils/analytics.js'
import { addToWatchlist, shareToFriendCircle } from '../utils/xueqiuBridge.js'
import FieldView from '../components/FieldView.jsx'
import ScoreBar from '../components/ScoreBar.jsx'
import PosterCanvas from '../components/PosterCanvas.jsx'

const SCORE_COLORS = {
  offense: '#ff6b35',
  defense: '#3a5fcd',
  control: '#4dabf7',
  balance: '#ffb800',
  personality: '#cc5de8',
}

const POS_META = {
  forward: { label: '⚡ 前锋', color: '#ff6b35' },
  midfielder: { label: '💫 中场', color: '#4dabf7' },
  defender: { label: '🛡️ 后卫', color: '#3a5fcd' },
  goalkeeper: { label: '🥅 门将', color: '#f5a623' },
}

const POS_KEYS = ['forward', 'midfielder', 'defender', 'goalkeeper']

export default function Result() {
  const navigate = useNavigate()
  const { state, dispatch } = useGame()
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(state.teamName)

  // 海报生成相关 state
  const posterRef = useRef(null)
  const actionsRef = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [statusText, setStatusText] = useState('')

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

  const etfRows = POS_KEYS.flatMap(pos => {
    const list = state.selectedEtfs[pos] || []
    return list.map((etf, i) => ({ ...POS_META[pos], etf, isFirst: i === 0 }))
  })

  async function generatePoster() {
    setErrMsg('')
    setGenerating(true)
    setStatusText('准备中…')
    try {
      if (!posterRef.current) throw new Error('海报区域未就绪')

      setStatusText('等待图片加载…')
      const imgs = posterRef.current.querySelectorAll('img')
      await Promise.all(
        Array.from(imgs).map(img =>
          img.complete && img.naturalHeight !== 0
            ? Promise.resolve()
            : new Promise(res => {
                img.onload = res
                img.onerror = res
                setTimeout(res, 3000)
              })
        )
      )

      setStatusText('正在渲染海报…')
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 15000,
        logging: false,
      })

      setStatusText('生成图片…')
      const dataUrl = canvas.toDataURL('image/png')
      if (!dataUrl || dataUrl === 'data:,') throw new Error('生成的图片为空')

      setImgSrc(dataUrl)
      analytics.posterGenerate()
      setStatusText('')
      // 滚到操作区让用户看到 3 按钮
      setTimeout(() => actionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (e) {
      console.error('[poster] generate failed:', e)
      setErrMsg(`生成失败：${e?.message || '未知错误'}。建议用系统浏览器（Safari / Chrome）打开`)
      setStatusText('')
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

  // 一键发布：保存 + 加自选 + 分享朋友圈
  async function publishCombo() {
    if (!imgSrc) return
    savePoster()
    const codes = POS_KEYS.flatMap(p => (state.selectedEtfs[p] || []).map(e => e.code))
    await addToWatchlist(codes)
    await shareToFriendCircle(imgSrc, state.teamName)
    analytics.shareClick()
  }

  // 保存海报参加雪球活动（跟帖主贴）
  function joinActivity() {
    if (!imgSrc) return
    savePoster()
    alert('海报已保存到相册\n请前往「雪球活动主贴」评论区跟帖发布海报，邀请球友点赞冲榜')
  }

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

      {/* 已选球员列表（11 只） */}
      <div className="result-etf-list">
        {etfRows.map(({ label, color, etf, isFirst }, idx) => (
          <div key={`${etf.id}-${idx}`} className="result-etf-row">
            <span className="result-etf-pos" style={{ color, visibility: isFirst ? 'visible' : 'hidden' }}>
              {label}
            </span>
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

      {/* 操作区 */}
      <div ref={actionsRef} className="result-actions">
        {errMsg && <div className="poster-error">⚠️ {errMsg}</div>}

        {!imgSrc ? (
          <button className="btn-primary btn-large" onClick={generatePoster} disabled={generating}>
            {generating ? (statusText || '生成中...') : '🎨 生成分享海报'}
          </button>
        ) : (
          <>
            {/* 海报预览 */}
            <div className="poster-preview">
              <img src={imgSrc} alt="海报预览" className="poster-img" />
            </div>

            {/* 主推：一键发布 */}
            <button className="btn-primary btn-large btn-combo" onClick={publishCombo}>
              <span className="combo-title">🎁 一键发布</span>
              <span className="combo-sub">💾 保存海报 · ⭐ 加自选 · 💬 分享朋友圈</span>
            </button>

            {/* 次级：参加活动 */}
            <button className="btn-ghost btn-large-ghost" onClick={joinActivity}>
              💾 保存海报参加活动
              <span className="ghost-sub">跟帖到雪球主贴拿奖品</span>
            </button>

            {/* 兜底：重新生成 */}
            <button className="btn-ghost" onClick={() => setImgSrc(null)}>
              🔄 重新生成
            </button>
          </>
        )}

        <button className="btn-ghost" onClick={() => { dispatch({ type: 'RESET' }); navigate('/') }}>
          重新组队
        </button>
      </div>

      <div className="risk-tip">
        本活动为雪球社区趣味互动内容，不构成任何投资建议。基金有风险，投资需谨慎。
      </div>

      {/* 隐藏的海报画布 — 用于 html2canvas 截图，永远不出现在用户视野里 */}
      <div className="poster-offscreen">
        <PosterCanvas ref={posterRef} />
      </div>
    </div>
  )
}
