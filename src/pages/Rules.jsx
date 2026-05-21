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
            <li>选阵型 + 挑选 11 只 ETF 组成你的球队</li>
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
          <h3 className="rules-h3">🏆 评奖规则（按周评奖）</h3>

          <div className="prize-card prize-card-grand">
            <div className="prize-card-tag tag-gold">周榜 第 1 名</div>
            <div className="prize-card-title">每周点赞 TOP 1</div>
            <div className="prize-card-desc">每周日 24:00 结算本周点赞数，第一名获得：</div>
            <div className="prize-card-reward">🥃 <b>雪球品牌白酒 × 1 瓶</b></div>
          </div>

          <div className="prize-card">
            <div className="prize-card-tag">周榜 第 2-5 名</div>
            <div className="prize-card-title">每周点赞 2 / 3 / 4 / 5 名</div>
            <div className="prize-card-desc">本周点赞数排名 2-5 名，各获得：</div>
            <div className="prize-card-reward">🧢 <b>雪球品牌棒球帽</b> × 1 顶</div>
          </div>
        </section>

        <section className="rules-section">
          <h3 className="rules-h3">📅 活动时间</h3>
          <p className="rules-p">2026.06.12 — 2026.07.20（共 39 天）</p>
        </section>

        <section className="rules-section">
          <h3 className="rules-h3">📢 开奖与通知</h3>
          <ul className="rules-list">
            <li>每周获奖名单将通过<b>雪球官方发帖</b>公示</li>
            <li>中奖结果会通过<b>站内信实时通知</b>到获奖球友，请留意站内信</li>
            <li>收到中奖站内信后，请按提示及时回复收货信息</li>
          </ul>
        </section>

        <section className="rules-section">
          <h3 className="rules-h3">📋 注意事项</h3>
          <ul className="rules-list">
            <li>同一用户多次组队，以最新一次提交的阵容计票</li>
            <li>奖品由雪球官方统一发放</li>
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
