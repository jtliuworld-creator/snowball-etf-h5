# ETF绿茵阵容挑战 · 交接文档

## 一、搬到新电脑的步骤

```bash
# 1. 把整个项目文件夹拷贝过去（U盘 / AirDrop / 网盘均可）
#    文件夹名：etf世界杯

# 2. 打开终端，进入项目目录
cd ~/Desktop/etf世界杯

# 3. 安装依赖（只需一次）
npm install

# 4. 启动本地开发服务
npm run dev

# 5. 浏览器打开
# http://localhost:5173
```

> node_modules 不需要拷贝，npm install 会重新生成。

---

## 二、项目结构

```
etf世界杯/
├── index.html                  # 入口 HTML（移动端 meta 已配置）
├── package.json                # 依赖：React 18 + React Router 6 + html2canvas
├── vite.config.js              # 构建配置，base: './'
└── src/
    ├── main.jsx                # 入口，HashRouter 包裹（兼容 WebView）
    ├── App.jsx                 # 路由表
    ├── context/
    │   └── GameContext.jsx     # 全局状态（useReducer），所有游戏数据在这
    ├── data/
    │   ├── etfs.js             # ETF 产品池，按位置分4组，每组6-8只
    │   ├── formations.js       # 5种阵型 + 坐标 + 加成数值
    │   └── quiz.js             # 3道测试题 + 人格计算逻辑
    ├── utils/
    │   ├── scoring.js          # 阵容评分 + 点评文案生成
    │   └── analytics.js        # 埋点（console输出）+ localStorage 榜单持久化
    ├── components/
    │   ├── EtfCard.jsx         # ETF 球员卡（完整版 + compact版）
    │   ├── FieldView.jsx       # 足球场SVG阵容图
    │   └── ScoreBar.jsx        # 动画评分条
    ├── pages/
    │   ├── Home.jsx            # 首页
    │   ├── Quiz.jsx            # 人格测试（3题）
    │   ├── Personality.jsx     # 测试结果 + 推荐阵型
    │   ├── Formation.jsx       # 阵型选择（5种）
    │   ├── Select.jsx          # ETF选择（按前锋/中场/后卫/门将4个tab）
    │   ├── Result.jsx          # 阵容结果 + 评分 + 队名编辑
    │   ├── Poster.jsx          # 海报生成（html2canvas截图）
    │   └── Rankings.jsx        # 热门榜单（前锋/中场/后卫/门将/阵型）
    └── styles/
        └── index.css           # 所有样式，CSS变量统一管理
```

---

## 三、页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `#/` | Home | 首页 |
| `#/quiz` | Quiz | 3题人格测试 |
| `#/personality` | Personality | 测试结果 |
| `#/formation` | Formation | 选阵型 |
| `#/select` | Select | 选ETF球员 |
| `#/result` | Result | 阵容+评分 |
| `#/poster` | Poster | 生成海报 |
| `#/rankings` | Rankings | 热门榜单 |

---

## 四、配色方案（已定稿）

深海军蓝 + 金色，CSS变量在 `src/styles/index.css` 顶部：

```css
--bg: #06101f          /* 页面底色 */
--card-bg: rgba(10,26,48,0.88)   /* 卡片底色 */
--accent: #4dabf7      /* 冰蓝，用于tab/标签 */
--gold: #f5a623        /* 金色，用于按钮/标题/评分 */
--text: #ddeeff        /* 正文 */
--text-dim: rgba(221,238,255,0.5)  /* 次要文字 */

/* 位置专属色（不要改，用于区分球员位置） */
--forward: #ff6b35     /* 前锋 橙红 */
--midfielder: #4dabf7  /* 中场 冰蓝 */
--defender: #51cf66    /* 后卫 绿色 */
--goalkeeper: #f5a623  /* 门将 金色 */
```

球场本身保持绿色（草皮），周围 UI 全是海军蓝。

---

## 五、已完成的功能（P0全部）

- [x] 首页 — badge「⚽ 做ETF球队老板」
- [x] 人格测试 — 3题，4种人格（进攻/防守/控球/均衡）
- [x] 人格结果 — 配对推荐阵型
- [x] 阵型选择 — 5种阵型，有加成数值提示
- [x] ETF选择 — 4个位置，共28只ETF，支持赞助权重
- [x] 阵容评分 — 5维评分（进攻力/防守力/控场力/平衡度/个性值）
- [x] 系统点评 — 6种规则文案
- [x] 结果页 — 球场阵容图 + 评分条 + 队名编辑
- [x] 海报生成 — html2canvas 截图，支持保存 / Web Share API
- [x] 热门榜单 — 5个tab，localStorage 持久化 + 预置默认数据
- [x] 埋点 — 全流程事件埋点（console输出，接SDK替换即可）
- [x] 风险提示 — 每页底部
- [x] 合规文案 — 不含"世界杯官方"等敏感表述

---

## 六、待做的事（P1 优先）

### 紧急（上线前必须）
- [ ] **接口对接**：现在产品池是写死的 `etfs.js`，需要换成后端接口 `GET /api/etf-campaign/products`
- [ ] **阵容提交接口**：`POST /api/etf-campaign/lineups`，目前存 localStorage
- [ ] **真实榜单接口**：`GET /api/etf-campaign/rankings`，现在是前端假数据
- [ ] **敏感词过滤**：队名输入框目前只做了长度限制，没有敏感词拦截

### 体验优化
- [ ] 首页加入球场视觉背景动效（现在是静态网格）
- [ ] ETF卡片加入「选中」动效（轻微弹跳）
- [ ] 海报模板优化（当前是基础版，可加更丰富的球场背景图）
- [ ] 加载状态优化（ETF列表加骨架屏）

### P1 功能
- [ ] 好友PK（分享链接带参数，对方看到 vs 视图）
- [ ] 基金公司战术馆（按基金公司筛选产品）
- [ ] KOL示范阵容（固定展示几个明星阵容）
- [ ] 每日热榜推送

---

## 七、ETF产品池扩充方式

在 `src/data/etfs.js` 里，每个 ETF 对象的结构：

```js
{
  id: 'etf_510300',         // 唯一ID，格式 etf_代码
  name: '沪深300ETF',
  code: '510300',
  fundCompany: '华泰柏瑞',
  position: 'midfielder',   // forward / midfielder / defender / goalkeeper
  positionName: '中场',
  skill: '组织核心',         // 球员技能名（自由发挥）
  tags: ['宽基', '大盘蓝筹'],
  description: '一句话介绍',
  riskLevel: '中',           // 极低/低/低中/中低/中/中高/高
  sponsored: true,           // true = 赞助商产品，显示金色「赞助」角标
  sortWeight: 100,           // 数字越大越靠前
  scores: {
    offense: 65,   // 进攻力 0-100
    defense: 60,   // 防守力 0-100
    control: 90,   // 控场力 0-100
    balance: 88,   // 平衡度 0-100
    personality: 45 // 个性值 0-100
  }
}
```

---

## 八、发布（正式上线）

```bash
# 构建生产包
npm run build

# dist/ 文件夹就是产物，直接给服务端部署
# 是纯静态文件，Nginx / CDN 都可以托管
```

构建产物大小：~420KB（gzip后约114KB），首屏加载快。

---

## 九、雪球 WebView 注意事项

- 路由用 `HashRouter`（已配），不依赖服务端路由，WebView 兼容好
- `vite.config.js` 里 `base: './'`，相对路径，CDN 子目录部署不报错
- 海报保存在 iOS WebView 里 `a.click()` 下载可能失效，需要接雪球 JSBridge 的 `saveImage` 方法
- 分享用 `navigator.share`（已做），在 WebView 内建议换成雪球 JSBridge 的分享接口

---

*生成时间：2026-05-20 | 版本：MVP v0.1*
