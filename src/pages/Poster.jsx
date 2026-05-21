import { useRef, useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'
import { useGame } from '../context/GameContext.jsx'
import { SCORE_LABELS } from '../utils/scoring.js'
import { FORMATIONS } from '../data/formations.js'
import { analytics } from '../utils/analytics.js'
import { addToWatchlist, shareToFriendCircle } from '../utils/xueqiuBridge.js'
import Logo from '../components/Logo.jsx'

const POS_COLORS = { forward: '#ff6b35', midfielder: '#4dabf7', defender: '#3a5fcd', goalkeeper: '#f5a623' }
const POS_KEYS = ['forward', 'midfielder', 'defender', 'goalkeeper']
const SITE_URL = 'https://jtliuworld-creator.github.io/snowball-etf-h5/'

export default function Poster() {
  const navigate = useNavigate()
  const { state } = useGame()
  const posterRef = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [statusText, setStatusText] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => { analytics.pageView('poster') }, [])

  useEffect(() => {
    if (!state.scores) navigate('/', { replace: true })
  }, [state.scores, navigate])

  // 生成二维码（指向 H5 首页，扫码进 H5 继续玩）
  useEffect(() => {
    QRCode.toDataURL(SITE_URL, {
      margin: 1,
      width: 200,
      color: { dark: '#0a0a0a', light: '#ffffff' },
    }).then(setQrDataUrl).catch(() => {})
  }, [])

  if (!state.scores) return <div className="page poster-page" />

  async function generatePoster() {
    setErrMsg('')
    setGenerating(true)
    setStatusText('准备中…')
    try {
      if (!posterRef.current) throw new Error('海报区域未就绪，请重试')

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
    } catch (e) {
      console.error('[poster] generate failed:', e)
      setErrMsg(`生成失败：${e?.message || e?.toString() || '未知错误'}。建议用系统浏览器（Safari / Chrome）打开`)
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

  // 组合 A：保存海报 + 加自选 + 分享朋友圈
  async function publishCombo() {
    if (!imgSrc) return
    savePoster()
    const codes = POS_KEYS.flatMap(p => (state.selectedEtfs[p] || []).map(e => e.code))
    await addToWatchlist(codes)
    await shareToFriendCircle(imgSrc, state.teamName)
    analytics.shareClick()
  }

  // 组合 B：保存海报参加雪球活动
  function joinActivity() {
    if (!imgSrc) return
    savePoster()
    alert('海报已保存到相册\n请前往「雪球活动主贴」评论区跟帖发布海报，邀请球友点赞冲榜')
  }

  // 11 个球员位置
  const fmt = FORMATIONS[state.formation] || FORMATIONS['4-3-3']
  const allEtfPositions = POS_KEYS.flatMap(pos => {
    const coords = fmt.positions[pos] || []
    const etfList = state.selectedEtfs[pos] || []
    return coords.map(([x, y], i) => ({ pos, x, y, etf: etfList[i] }))
  })

  // ETF 列表（按位置分组）
  const groupedEtfs = useMemo(() => POS_KEYS.map(pos => ({
    pos,
    label: { forward: '前锋', midfielder: '中场', defender: '后卫', goalkeeper: '门将' }[pos],
    list: state.selectedEtfs[pos] || [],
  })), [state.selectedEtfs])

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

          {/* 迷你球场 — 11 个点位 */}
          <div className="poster-field">
            <div className="poster-field-inner">
              <div className="poster-field-line-h" />
              <div className="poster-field-circle" />
              {allEtfPositions.map(({ pos, x, y, etf }, idx) => (
                <div
                  key={`${pos}-${idx}`}
                  className="poster-pos-abs"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="poster-pos-dot" style={{ background: POS_COLORS[pos] }} />
                  {etf && (
                    <div className="poster-pos-name">
                      {etf.name.length > 5 ? etf.name.slice(0, 4) + '…' : etf.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 11 只 ETF 缩略列表 */}
          <div className="poster-etfs-grid">
            {groupedEtfs.map(({ pos, label, list }) => list.length > 0 && (
              <div key={pos} className="poster-etfs-group">
                <span className="poster-etfs-pos" style={{ background: POS_COLORS[pos] }}>{label}</span>
                <span className="poster-etfs-names">{list.map(e => e.name).join(' · ')}</span>
              </div>
            ))}
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
            <div className="poster-prize-line">🧢 每日点赞 TOP 5 · 雪球棒球帽</div>
            <div className="poster-prize-line">🥃 累计点赞 TOP 3 · 雪球白酒一套</div>
          </div>

          <div className="poster-bottom-row">
            <div className="poster-bottom-text">
              <div className="poster-risk">本阵容仅为个人趣味配置展示，不构成投资建议。基金有风险，投资需谨慎。</div>
              <div className="poster-footer">雪球 · 做ETF球队老板</div>
              <div className="poster-qr-hint">扫码进入活动</div>
            </div>
            {qrDataUrl && <img src={qrDataUrl} alt="二维码" className="poster-qr" />}
          </div>
        </div>
      </div>

      {/* 生成后预览 */}
      {imgSrc && (
        <div className="poster-preview">
          <img src={imgSrc} alt="海报预览" className="poster-img" />
        </div>
      )}

      <div className="poster-actions">
        {errMsg && (
          <div className="poster-error">
            ⚠️ {errMsg}
          </div>
        )}
        {!imgSrc ? (
          <>
            <button className="btn-primary btn-large" onClick={generatePoster} disabled={generating}>
              {generating ? (statusText || '生成中...') : '🎨 生成海报'}
            </button>
            {generating && <div className="poster-status">{statusText}</div>}
          </>
        ) : (
          <>
            {/* 主推：保存 + 加自选 + 分享朋友圈 */}
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
      </div>

      <div className="risk-tip">
        本活动为雪球社区趣味互动内容，不构成任何投资建议。基金有风险，投资需谨慎。
      </div>
    </div>
  )
}
