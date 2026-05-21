import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analytics } from '../utils/analytics.js'

export default function Rules() {
  const navigate = useNavigate()

  useEffect(() => { analytics.pageView('rules') }, [])

  return (
    <div className="page rules-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← 返回</button>
        <h2 className="page-header-title">活动规则</h2>
      </div>

      <div className="rules-body">
        <section className="rules-section">
          <h3 className="rules-h3">🎮 怎么玩</h3>
          <ol className="rules-list">
            <li>完成 3 题人格测试，找到你的"老板风格"</li>
            <li>选阵型 + 挑选 4 只 ETF 组成你的球队</li>
            <li>生成专属阵容海报，<b>保存图片</b></li>
            <li>打开<b>雪球活动主贴</b>，在评论区<b>跟帖发布你的海报</b></li>
            <li>球友在主贴下方为你的海报点赞，<b>集赞越多排名越靠前</b></li>
          </ol>
        </section>

        <section className="rules-section">
          <h3 className="rules-h3">❤️ 点赞规则</h3>
          <ul className="rules-list">
            <li>所有点赞均发生在<b>雪球活动主贴评论区</b>，认你海报跟帖的点赞数</li>
            <li>每个用户每天最多为同一条海报点赞 <b>1 次</b></li>
            <li>检测到刷赞 / 小号互赞将取消评奖资格</li>
          </ul>
        </section>

        <section className="rules-section rules-prize">
          <h3 className="rules-h3">🏆 评奖规则</h3>

          <div className="prize-card">
            <div className="prize-card-tag">每日榜</div>
            <div className="prize-card-title">每日点赞 TOP 5</div>
            <div className="prize-card-desc">每日 24:00 结算当日点赞数，TOP 5 各获得：</div>
            <div className="prize-card-reward">🧢 <b>雪球品牌棒球帽</b> × 1 顶</div>
            <div className="prize-card-foot">活动期间每日开奖，名额不累计</div>
          </div>

          <div className="prize-card prize-card-grand">
            <div className="prize-card-tag tag-gold">每周榜</div>
            <div className="prize-card-title">每周点赞 TOP 1</div>
            <div className="prize-card-desc">每周日 24:00 结算本周点赞数，第一名获得：</div>
            <div className="prize-card-reward">🥃 <b>雪球品牌白酒 × 1 瓶</b></div>
            <div className="prize-card-foot">每周开奖 1 名，与每日奖可叠加</div>
          </div>
        </section>

        <section className="rules-section">
          <h3 className="rules-h3">📅 活动时间</h3>
          <p className="rules-p">2026.05.20 — 2026.06.20（共 32 天）</p>
        </section>

        <section className="rules-section">
          <h3 className="rules-h3">📋 注意事项</h3>
          <ul className="rules-list">
            <li>同一用户多次组队，以最新一次提交的阵容计票</li>
            <li>奖品由雪球官方统一发放，请获奖球友及时回复中奖通知</li>
            <li>邮寄地址错误或失效导致无法送达的，视为放弃</li>
            <li>本活动最终解释权归雪球所有</li>
          </ul>
        </section>

        <div className="rules-disclaimer">
          本活动为雪球社区趣味互动内容，不构成任何投资建议。
          基金有风险，投资需谨慎。历史业绩不预示未来表现。
        </div>

        <button className="btn-primary btn-large" onClick={() => navigate('/')}>
          我知道了，开始组队 →
        </button>
      </div>
    </div>
  )
}
