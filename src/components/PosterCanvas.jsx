import { useEffect, useState, forwardRef } from 'react'
import QRCode from 'qrcode'
import { useGame } from '../context/GameContext.jsx'
import { SCORE_LABELS } from '../utils/scoring.js'
import { FORMATIONS } from '../data/formations.js'
import Logo from './Logo.jsx'

const POS_COLORS = { forward: '#ff6b35', midfielder: '#4dabf7', defender: '#3a5fcd', goalkeeper: '#f5a623' }
const POS_KEYS = ['forward', 'midfielder', 'defender', 'goalkeeper']
const POS_LABELS = { forward: '前锋', midfielder: '中场', defender: '后卫', goalkeeper: '门将' }
const SITE_URL = 'https://jtliuworld-creator.github.io/snowball-etf-h5/'

/**
 * 海报内容（用 html2canvas 截图的 DOM）
 * 在 Result 页隐藏渲染，等用户点"生成海报"时由 html2canvas 抓取
 */
const PosterCanvas = forwardRef(function PosterCanvas(_, ref) {
  const { state } = useGame()
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    QRCode.toDataURL(SITE_URL, {
      margin: 1,
      width: 200,
      color: { dark: '#0a0a0a', light: '#ffffff' },
    }).then(setQrDataUrl).catch(() => {})
  }, [])

  if (!state.scores) return null

  const fmt = FORMATIONS[state.formation] || FORMATIONS['4-3-3']
  const allEtfPositions = POS_KEYS.flatMap(pos => {
    const coords = fmt.positions[pos] || []
    const etfList = state.selectedEtfs[pos] || []
    return coords.map(([x, y], i) => ({ pos, x, y, etf: etfList[i] }))
  })

  const groupedEtfs = POS_KEYS.map(pos => ({
    pos,
    label: POS_LABELS[pos],
    list: state.selectedEtfs[pos] || [],
  }))

  return (
    <div ref={ref} className="poster-canvas">
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
        <div className="poster-prize-line">🥃 每周点赞 TOP 1 · 雪球白酒一瓶</div>
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
  )
})

export default PosterCanvas
