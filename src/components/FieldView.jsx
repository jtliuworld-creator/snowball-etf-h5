import { FORMATIONS } from '../data/formations.js'

const POSITION_COLORS = {
  forward: '#ff6b35',
  midfielder: '#4dabf7',
  defender: '#3a5fcd',
  goalkeeper: '#f5a623',
}

const POSITION_KEYS = ['forward', 'midfielder', 'defender', 'goalkeeper']

export default function FieldView({ formation, selectedEtfs, mini = false }) {
  const fmt = FORMATIONS[formation] || FORMATIONS['4-3-3']
  const size = mini ? 0.65 : 1

  return (
    <div className="field-wrap" style={{ transform: `scale(${size})`, transformOrigin: 'top center' }}>
      <div className="field">
        {/* 场地线条 */}
        <div className="field-center-line" />
        <div className="field-center-circle" />
        <div className="field-penalty-top" />
        <div className="field-penalty-bottom" />
        <div className="field-goal-top" />
        <div className="field-goal-bottom" />

        {/* 球员位置 */}
        {POSITION_KEYS.map(pos => {
          const coords = fmt.positions[pos] || []
          const etf = selectedEtfs?.[pos]
          const color = POSITION_COLORS[pos]
          return coords.map(([x, y], i) => (
            <div
              key={`${pos}-${i}`}
              className="field-player"
              style={{ left: `${x}%`, top: `${y}%`, borderColor: color }}
            >
              <div className="field-player-dot" style={{ background: color }} />
              {i === 0 && etf && (
                <div className="field-player-name">{etf.name}</div>
              )}
              {i > 0 && etf && (
                <div className="field-player-name">{etf.name.slice(0, 5)}</div>
              )}
              {!etf && <div className="field-player-name empty">?</div>}
            </div>
          ))
        })}

        {/* 阵型标签 */}
        <div className="field-formation-label">{formation}</div>
      </div>
    </div>
  )
}
