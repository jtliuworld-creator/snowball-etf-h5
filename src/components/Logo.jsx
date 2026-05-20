import logoUrl from '../assets/snowball-logo.png'

/**
 * 雪球 logo — 官方 PNG（带"雪球"文字 + TM 标）
 * @param {number} height — 像素高度。宽度按原图比例自适应。
 * @param {string} variant — 'original'（蓝色透明底）/ 'invert'（强制白色，用在亮底）
 */
export default function Logo({ height = 20, variant = 'original' }) {
  const filterStyle =
    variant === 'invert'
      ? { filter: 'brightness(0) invert(1)' }
      : {}

  return (
    <img
      src={logoUrl}
      alt="雪球"
      className="brand-logo-img"
      style={{ height: `${height}px`, ...filterStyle }}
    />
  )
}
