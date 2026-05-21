/**
 * 雪球 App JSBridge 占位封装
 *
 * 当前为 mock 实现（H5 单独运行 / 系统浏览器都能跑），上线时由产品同学告知
 * 具体的 native 方法名，将下面的 mock 替换为 window.XueqiuJSBridge?.callHandler(...) 即可。
 */

/* eslint-disable no-alert */

function isInXueqiuApp() {
  return typeof window !== 'undefined' && (
    /xueqiuapp/i.test(navigator.userAgent || '') ||
    !!window.XueqiuJSBridge
  )
}

/**
 * 一键加入雪球自选股
 * @param {string[]} etfCodes - ETF 代码列表
 * @returns {Promise<{ok: boolean, msg?: string}>}
 *
 * 上线时改成调用雪球真实方法，比如：
 *   window.XueqiuJSBridge.callHandler('addToWatchlist', { codes: etfCodes }, cb)
 */
export async function addToWatchlist(etfCodes) {
  console.log('[xueqiuBridge] addToWatchlist', etfCodes)
  // TODO: 上线时替换为雪球真实方法：
  //   window.XueqiuJSBridge.callHandler('addToWatchlist', { codes: etfCodes }, cb)
  // 真实实现里：加自选成功才返回 { ok: true }，失败返回 { ok: false }，
  // 由调用方据此决定是否放行海报生成。
  //
  // 当前为 mock：始终返回成功，保证内测流程不被阻塞。
  if (!etfCodes || etfCodes.length === 0) return { ok: true, count: 0 }
  return { ok: true, count: etfCodes.length }
}

/**
 * 分享到朋友圈
 * @param {Blob|string} image - 图片 Blob 或 dataURL
 * @param {string} title
 * @returns {Promise<{ok: boolean, msg?: string}>}
 *
 * 上线时改成：window.XueqiuJSBridge.callHandler('shareToTimeline', { image, title }, cb)
 */
export async function shareToFriendCircle(image, title = '') {
  console.log('[xueqiuBridge] shareToFriendCircle')
  if (isInXueqiuApp()) {
    // TODO: 接入雪球 native 方法
    return { ok: false, msg: '请联系产品同学接入雪球 shareToTimeline 接口' }
  }
  // H5 fallback: navigator.share（移动浏览器多支持）
  try {
    let blob
    if (typeof image === 'string') {
      const res = await fetch(image)
      blob = await res.blob()
    } else {
      blob = image
    }
    if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'poster.png', { type: 'image/png' })] })) {
      const file = new File([blob], 'poster.png', { type: 'image/png' })
      await navigator.share({ files: [file], title })
      return { ok: true }
    }
    alert('请先保存海报到相册，再去微信朋友圈手动发布\n\n（雪球 App 内会直接调起朋友圈分享）')
    return { ok: true }
  } catch (e) {
    return { ok: false, msg: e?.message || '分享失败' }
  }
}
