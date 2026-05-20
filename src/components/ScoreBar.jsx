import { useEffect, useState } from 'react'

export default function ScoreBar({ label, value, color = '#ffb800' }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 50)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div className="score-bar-wrap">
      <div className="score-bar-header">
        <span className="score-bar-label">{label}</span>
        <span className="score-bar-value">{value}</span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${width}%`, background: color, transition: 'width 0.8s cubic-bezier(.4,0,.2,1)' }}
        />
      </div>
    </div>
  )
}
