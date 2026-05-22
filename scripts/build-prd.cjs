const fs = require('fs')
const path = require('path')
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak, TableOfContents,
} = require('docx')

const FONT = '微软雅黑'
const GOLD = 'D4A017'
const BLUE = '2A85E0'
const RED = 'C0392B'
const DARK = '1A1A1A'
const GREY = '666666'

const bd = { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' }
const borders = { top: bd, bottom: bd, left: bd, right: bd }

function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 100 },
    ...opts,
    children: [new TextRun({ text, font: FONT, size: opts.size || 21, ...opts.run })],
  })
}
function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 180 }, pageBreakBefore: true,
    children: [new TextRun({ text, font: FONT, size: 30, bold: true, color: GOLD })],
  })
}
function H1NoBreak(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 180 },
    children: [new TextRun({ text, font: FONT, size: 30, bold: true, color: GOLD })],
  })
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2, spacing: { before: 260, after: 140 },
    children: [new TextRun({ text, font: FONT, size: 24, bold: true, color: DARK })],
  })
}
function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 110 },
    children: [new TextRun({ text, font: FONT, size: 21, bold: true, color: BLUE })],
  })
}
function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'b', level },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: FONT, size: 21 })],
  })
}
function numbered(text) {
  return new Paragraph({
    numbering: { reference: 'n', level: 0 }, spacing: { after: 60 },
    children: [new TextRun({ text, font: FONT, size: 21 })],
  })
}
function note(text) {
  return new Paragraph({
    spacing: { after: 100 }, shading: { fill: 'FFF6E0', type: ShadingType.CLEAR },
    children: [new TextRun({ text, font: FONT, size: 19, color: GREY, italics: true })],
  })
}
function cell(text, opts = {}) {
  return new TableCell({
    borders, width: { size: opts.width, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    children: (Array.isArray(text) ? text : [text]).map(t =>
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [new TextRun({ text: String(t), font: FONT, size: opts.size || 19, bold: opts.bold, color: opts.color })],
      })
    ),
  })
}
function table(colW, rows) {
  return new Table({
    width: { size: colW.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: colW, rows,
  })
}
function headerRow(labels, colW) {
  return new TableRow({
    tableHeader: true,
    children: labels.map((l, i) => cell(l, { width: colW[i], shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER })),
  })
}

const C = [] // content array

// ===== 封面 =====
C.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { before: 1400, after: 200 },
  children: [new TextRun({ text: '「来战！我的 ETF 世界杯阵容」', font: FONT, size: 40, bold: true, color: GOLD })],
}))
C.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 360 },
  children: [new TextRun({ text: 'H5 活动 · 产研交接文档', font: FONT, size: 30, bold: true, color: DARK })],
}))
C.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 100 },
  children: [new TextRun({ text: '版本 v1.0  |  交接日期 2026-05-22', font: FONT, size: 21, color: GREY })],
}))
C.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 100 },
  children: [new TextRun({ text: '体验链接：https://jtliuworld-creator.github.io/snowball-etf-h5/', font: FONT, size: 21, color: BLUE })],
}))
C.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 100 },
  children: [new TextRun({ text: '代码仓库：https://github.com/jtliuworld-creator/snowball-etf-h5', font: FONT, size: 21, color: BLUE })],
}))
C.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { before: 300 },
  children: [new TextRun({ text: '本文档面向产品 / 研发同学，用于活动从原型移交到正式开发。', font: FONT, size: 19, color: GREY, italics: true })],
}))

// ===== 目录 =====
C.push(new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text: '目录', font: FONT, size: 30, bold: true, color: GOLD })] }))
C.push(new TableOfContents('目录', { hyperlink: true, headingStyleRange: '1-3' }))

// ========== 一、项目概述 ==========
C.push(H1('一、项目概述'))
C.push(H2('1.1 当前状态'))
C.push(bullet('已完成可交互 MVP 原型，全流程跑通（人格测试 → 阵型 → 选 ETF → 评分 → 海报）'))
C.push(bullet('前端数据为 mock（写死在 src/data/ 下），点赞数据为 localStorage 模拟'))
C.push(bullet('已托管在 GitHub Pages 用于内测；正式上线需迁移到雪球自有 CDN'))
C.push(bullet('交接目标：产研团队接手，对接真实接口、雪球 JSBridge，完成上线'))

C.push(H2('1.2 技术栈'))
C.push(bullet('前端框架：React 18 + React Router 6（HashRouter，兼容 WebView）'))
C.push(bullet('构建工具：Vite 5'))
C.push(bullet('海报生成：html2canvas（DOM 截图）'))
C.push(bullet('二维码：qrcode'))
C.push(bullet('构建产物：纯静态文件（HTML/JS/CSS），约 440KB（gzip 后约 120KB）'))

C.push(H2('1.3 目录结构'))
C.push(P('src/ 下主要文件：', { run: { color: GREY } }))
const dirRows = [
  ['data/etfs.js', 'ETF 产品池（mock）+ 队名池'],
  ['data/formations.js', '5 种阵型 + 坐标 + 加成 + 位置数量'],
  ['data/quiz.js', '3 道测试题 + 4 种人格 + 人格计算'],
  ['utils/scoring.js', '阵容 5 维评分 + 点评文案'],
  ['utils/sponsorRotation.js', '招商客户跑马灯轮转 + 付费客户判断'],
  ['utils/xueqiuBridge.js', '雪球 JSBridge 占位（加自选 / 分享朋友圈）'],
  ['utils/analytics.js', '埋点 + 点赞 mock + 榜单 localStorage'],
  ['context/GameContext.jsx', '全局状态（useReducer）'],
  ['pages/', 'Home / Quiz / Personality / Formation / Select / Result / Rules / Rankings'],
  ['components/', 'EtfCard / FieldView / ScoreBar / Logo / PosterCanvas'],
]
const dW = [3200, 6160]
C.push(table(dW, [
  headerRow(['文件', '说明'], dW),
  ...dirRows.map(r => new TableRow({ children: [cell(r[0], { width: dW[0] }), cell(r[1], { width: dW[1] })] })),
]))

// ========== 二、活动说明 ==========
C.push(H1('二、活动说明'))
C.push(H2('2.1 活动定位'))
C.push(P('「来战！我的 ETF 世界杯阵容」是面向雪球社区球友的轻量互动 H5。用户通过完成人格测试、选阵型、挑选 11 只 ETF 组成"球队"，生成专属阵容海报，跟帖到雪球活动主贴下方集赞冲榜赢奖品。'))
C.push(H2('2.2 目标用户'))
C.push(bullet('雪球社区已有用户，对 ETF / 基金组合配置感兴趣'))
C.push(bullet('体育赛事 + 投资策略的跨界兴趣人群'))
C.push(H2('2.3 活动时间'))
C.push(bullet('2026.06.12 — 2026.07.20，共 39 天'))
C.push(H2('2.4 运行环境'))
C.push(bullet('移动端 H5，适配 320 - 430px 各机型'))
C.push(bullet('雪球 App 内置 WebView + 系统浏览器（Safari / Chrome）'))
C.push(bullet('已做 safe-area-inset 适配（iOS 刘海 / 灵动岛）'))

// ========== 三、完整玩法流程 ==========
C.push(H1('三、完整玩法流程'))
C.push(P('用户完整体验路径（约 3-5 分钟）：', { run: { color: GREY } }))
C.push(numbered('首页 → 点「开始组队」'))
C.push(numbered('人格测试：3 道选择题 → 系统计算"老板类型"'))
C.push(numbered('人格结果页：展示人格画像 + 推荐阵型'))
C.push(numbered('阵型选择：5 种阵型，推荐阵型置顶'))
C.push(numbered('选 ETF 球员：按阵型挑满 11 只（4 个位置）'))
C.push(numbered('阵容结果页：5 维评分 + 系统点评'))
C.push(numbered('一键发布：加自选（付费客户产品）→ 生成海报'))
C.push(numbered('海报生成后立即抽奖，即时弹出是否中奖'))
C.push(numbered('中奖后可选择到雪球活动主帖发帖晒奖'))

C.push(H2('页面路由表'))
const rtW = [2400, 2400, 4560]
const rtRows = [
  ['#/', 'Home', '首页'],
  ['#/quiz', 'Quiz', '3 题人格测试'],
  ['#/personality', 'Personality', '人格结果 + 推荐阵型'],
  ['#/formation', 'Formation', '阵型选择'],
  ['#/select', 'Select', '选 11 只 ETF'],
  ['#/result', 'Result', '评分 + 海报 + 一键发布'],
  ['#/rules', 'Rules', '活动规则'],
  ['#/rankings', 'Rankings', '热门 ETF 榜单（mock）'],
]
C.push(table(rtW, [
  headerRow(['路由', '页面', '说明'], rtW),
  ...rtRows.map(r => new TableRow({ children: [
    cell(r[0], { width: rtW[0], align: AlignmentType.CENTER }),
    cell(r[1], { width: rtW[1], align: AlignmentType.CENTER }),
    cell(r[2], { width: rtW[2] }),
  ] })),
]))

// ========== 四、页面与文案明细 ==========
C.push(H1('四、页面与文案明细'))
C.push(note('以下文案均为当前线上版本实际文案，产研可直接复用；如需调整请同步本文档。'))

C.push(H2('4.1 首页 Home'))
C.push(bullet('顶部：雪球 logo + 「游戏规则 →」入口'))
C.push(bullet('活动标签：⚽ 雪球 ETF 世界杯'))
C.push(bullet('主标题：来战！我的 ETF 世界杯阵容'))
C.push(bullet('副标题：选前锋、配中场、稳后防 / 搭出你的 ETF 冠军阵容'))
C.push(bullet('4 个位置预览卡：前锋·科技成长 / 中场·宽基核心 / 后卫·红利低波 / 门将·黄金压舱'))
C.push(bullet('主按钮：⚡ 开始组队'))
C.push(bullet('次按钮：查看热门 ETF 球员榜 →'))
C.push(bullet('玩法卡（点击进规则页）：①3 题测试找"老板风格" ②选阵型+配 11 只 ETF ③一键发布加自选+生成海报 ④海报生成后立即抽奖 ⑤一周一次机会，抽帽子 / 白酒'))

C.push(H2('4.2 人格测试 Quiz'))
C.push(P('3 道单选题，每题 4 个选项，每个选项对应一种人格类型（aggressive / control / defensive / balanced）。'))
const quizData = [
  ['第 1 题', '如果市场突然大涨，你最担心什么？',
    'A 怕没上车，踏空了行情（进攻）｜B 怕追高，买在顶部（控球）｜C 怕波动太大，拿不住（防守）｜D 怕看不懂方向，不知该如何配置（均衡）'],
  ['第 2 题', '你的球队更像哪种风格？',
    'A 全力进攻，追求进球（进攻）｜B 中场控球，掌控节奏（控球）｜C 稳守反击，后发制人（防守）｜D 攻守均衡，全面发展（均衡）'],
  ['第 3 题', '你最想要哪种 ETF 球员？',
    'A 爆发力强，能带来超额收益（进攻）｜B 基本盘稳，宽基指数为核心（控球）｜C 防守能力强，低波动少亏钱（防守）｜D 关键时刻能救命，对冲风险（均衡）'],
]
const qW = [1200, 3200, 4960]
C.push(table(qW, [
  headerRow(['题号', '题目', '选项（括号内为对应人格）'], qW),
  ...quizData.map(r => new TableRow({ children: [
    cell(r[0], { width: qW[0], align: AlignmentType.CENTER, bold: true }),
    cell(r[1], { width: qW[1] }),
    cell(r[2], { width: qW[2] }),
  ] })),
]))
C.push(H3('人格计算逻辑'))
C.push(bullet('统计 3 题答案落在 4 种人格上的次数'))
C.push(bullet('取次数最多的人格；若并列，按优先级 均衡 > 控球 > 防守 > 进攻 取第一个'))

C.push(H2('4.3 人格结果 Personality'))
C.push(P('4 种人格画像，每种对应一个推荐阵型：'))
const pW = [1800, 1100, 2700, 1400, 2360]
const pRows = [
  ['进攻狂人型老板', '⚡', '敢于进攻，资源放前锋线，追求进攻弹性与机会捕捉', '3-4-3', '科技成长 / AI / 半导体'],
  ['大师控球型老板', '🎯', '重视节奏，用宽基、中证系列中场资产掌控组合', '4-5-1', '宽基 / 指数 / 均衡'],
  ['稳守反击型老板', '🛡️', '相信守得住才有冠军，强化后防（红利/低波/债券/黄金）', '5-3-2', '红利 / 低波 / 防御'],
  ['均衡控场型老板', '⚖️', '宽基为中场核心，搭配少量进攻与防守资产', '4-3-3', '均衡 / 宽基 / 混合'],
]
C.push(table(pW, [
  headerRow(['人格', 'emoji', '画像描述', '推荐阵型', '前锋偏好标签'], pW),
  ...pRows.map(r => new TableRow({ children: r.map((v, i) =>
    cell(v, { width: pW[i], align: i === 1 || i === 3 ? AlignmentType.CENTER : AlignmentType.LEFT, bold: i === 0 })) })),
]))

C.push(H2('4.4 阵型选择 Formation'))
C.push(P('5 种阵型，推荐阵型自动置顶并默认选中。每种阵型给阵容带来固定属性加成。'))
const fW = [1400, 2600, 2000, 3360]
const fRows = [
  ['3-4-3', '3 前 + 4 中 + 3 后 + 1 门', '进攻压迫型', '进攻 +10 / 防守 -5 / 控场 +3'],
  ['4-3-3', '3 前 + 3 中 + 4 后 + 1 门', '均衡进攻型', '进攻 +6 / 防守 +3 / 控场 +5'],
  ['4-4-2', '2 前 + 4 中 + 4 后 + 1 门', '经典平衡型', '进攻 +3 / 防守 +5 / 控场 +6'],
  ['5-3-2', '2 前 + 3 中 + 5 后 + 1 门', '稳守反击型', '进攻 -3 / 防守 +10 / 控场 +3'],
  ['4-5-1', '1 前 + 5 中 + 4 后 + 1 门', '中场控球型', '进攻 -5 / 防守 +3 / 控场 +10'],
]
C.push(table(fW, [
  headerRow(['阵型', '位置配置', '风格', '属性加成'], fW),
  ...fRows.map(r => new TableRow({ children: r.map((v, i) =>
    cell(v, { width: fW[i], align: i < 2 ? AlignmentType.CENTER : AlignmentType.LEFT, bold: i === 0 })) })),
]))

C.push(H2('4.5 选 ETF 球员 Select'))
C.push(bullet('按所选阵型，从 4 个位置池里挑选共 11 只 ETF'))
C.push(bullet('顶部 4 个 slot + 标签 tab 显示各位置进度（如 前锋 2/3）'))
C.push(bullet('底部进度条：前锋 X/Y · 中场 X/Y · 后卫 X/Y · 门将 X/Y'))
C.push(bullet('选满某位置自动跳下一个未满位置；点击已选卡片可取消'))
C.push(bullet('每个位置第一只 ETF 带「今日推荐」金色徽章（招商轮转，见 5.5）'))
C.push(bullet('ETF 卡片展示：位置标签 / 名称 / 基金公司 / 代码 / 近一周涨跌幅 / 一句话简介 / 风险等级 / 技能名'))
C.push(bullet('底部按钮：未选满显示「还需选 N 只」，选满显示「生成阵容评分 →」'))

C.push(H2('4.6 阵容结果 Result'))
C.push(bullet('队名：默认随机生成，可点击编辑（限 10 字，过滤特殊字符）'))
C.push(bullet('球场图：按阵型坐标渲染 11 个球员圆点 + ETF 名称'))
C.push(bullet('已选球员列表：11 只 ETF 按位置分组展示'))
C.push(bullet('阵容战力评分：5 维评分条（见 5.4）'))
C.push(bullet('系统点评：6 种规则文案之一（见 5.4）'))
C.push(bullet('一键发布：加自选 → 生成海报 → 立即抽奖（见第六章）'))
C.push(bullet('抽奖结果即时弹出；中奖后可选择到雪球活动主帖发帖晒奖'))
C.push(note('当前线上原型 Result 页仍为旧版「点赞冲榜」交互（一键发布 / 分享朋友圈 / 重新组队）。抽奖玩法以本文档第六章为准，待产研重构。'))

C.push(H2('4.7 活动规则 Rules'))
C.push(P('独立页面 #/rules，首页右上角「游戏规则 →」进入。包含：怎么玩、点赞规则、评奖规则、活动时间、开奖与通知、注意事项。完整规则见第六章。'))

// ========== 五、核心机制详解 ==========
C.push(H1('五、核心机制详解'))

C.push(H2('5.1 ETF 数据结构'))
C.push(P('每只 ETF 对象字段（src/data/etfs.js）：'))
const eW = [2000, 1700, 5660]
const eRows = [
  ['id', 'string', '唯一 ID，格式 etf_代码'],
  ['name', 'string', 'ETF 简称（展示在卡片 / 海报）'],
  ['code', 'string', '6 位交易代码'],
  ['fundCompany', 'string', '基金公司（用于招商轮转分组）'],
  ['position', 'string', 'forward / midfielder / defender / goalkeeper'],
  ['skill', 'string', '球员技能名（趣味标签，如"爆发突击"）'],
  ['tags', 'string[]', '产品标签（当前卡片已不展示，保留字段）'],
  ['description', 'string', '一句话简介（≤30 字）'],
  ['riskLevel', 'string', '极低/低/低中/中低/中/中高/高'],
  ['sponsored', 'boolean', '是否招商产品'],
  ['sortWeight', 'number', '排序权重，越大越靠前'],
  ['scores', 'object', '5 维评分 offense/defense/control/balance/personality（0-100）'],
]
C.push(table(eW, [
  headerRow(['字段', '类型', '说明'], eW),
  ...eRows.map(r => new TableRow({ children: [
    cell(r[0], { width: eW[0] }), cell(r[1], { width: eW[1], align: AlignmentType.CENTER }), cell(r[2], { width: eW[2] }),
  ] })),
]))
C.push(note('近一周涨跌幅：当前由 etf.id 哈希出 mock 值，上线需接行情接口替换（src/components/EtfCard.jsx 的 getWeeklyChange）。'))

C.push(H2('5.2 阵容 5 维评分算法'))
C.push(P('评分维度：进攻力 / 防守力 / 控场力 / 平衡度 / 个性值。计算逻辑（src/utils/scoring.js）：'))
C.push(bullet('取阵容内 11 只 ETF 各维度评分的平均值'))
C.push(bullet('进攻力 / 防守力 / 控场力：在均值基础上叠加所选阵型的属性加成'))
C.push(bullet('平衡度：均值基础上，阵容选满 11 只额外 +5'))
C.push(bullet('个性值：直接取均值'))
C.push(bullet('所有维度上限 100'))

C.push(H3('系统点评文案（6 条规则，按优先级匹配）'))
C.push(bullet('个性值 ≥ 80：你的阵容很有个人审美，不是全跟热门走。你更像一位有自己战术想法的球队老板。'))
C.push(bullet('平衡度 ≥ 85：这是一套进可攻、退可守的成熟阵容……'))
C.push(bullet('控场力 ≥ 80：你的阵容中场很厚，节奏感很强……'))
C.push(bullet('进攻力 ≥ 80 且 防守力 < 65：你的阵容火力很猛，像一支前场压迫型球队……'))
C.push(bullet('防守力 ≥ 80 且 进攻力 < 65：你的阵容防守很稳，像一支擅长守住底线的球队……'))
C.push(bullet('兜底：你搭建了一支有自己特色的球队，进可攻、退可守，等待属于你的高光时刻。'))

C.push(H2('5.3 招商售卖模型'))
C.push(H3('售卖规则'))
C.push(bullet('每周最多售卖给 2 个付费客户'))
C.push(bullet('每个客户提供 4 只 ETF：前锋 / 中场 / 后卫 / 门将 各 1 只'))
C.push(bullet('价格：10 万元 / 客户 / 周'))
C.push(bullet('8 只产品（2 客户 × 4 只）进入对应位置的 ETF 池，获得展示曝光'))
C.push(H3('加自选优先级'))
C.push(bullet('每个客户对自己的 4 只产品排优先级，指定最希望被加自选的 1 个位置'))
C.push(bullet('用户在 H5 完成「加自选」时，每个客户只有 1 只产品被加入自选 —— 即该客户优先级最高位置的那只'))
C.push(bullet('2 个客户 = 用户共加 2 只自选（来自 2 个不同位置）'))
C.push(H3('排他性与下单顺序'))
C.push(bullet('一个客户选定某个位置类型作为加自选优先位后，第二个客户不能再选同一位置类型'))
C.push(bullet('先下单的客户优先选位置，后下单的客户只能从剩余位置中选 —— 最终结果与下单顺序强相关'))
C.push(bullet('示例：客户 A 先下单选「前锋」→ 客户 B 下单时只能从中场 / 后卫 / 门将中选'))
C.push(note('H5 侧只负责按后端返回的"本周付费客户 + 各自加自选产品"执行加自选；排他性、下单顺序判定由运营后台 / 招商侧处理。接口见第七章。'))

C.push(H2('5.4 海报生成'))
C.push(bullet('用 html2canvas 截取隐藏的 PosterCanvas 组件，scale 2，输出约 960px 宽 PNG'))
C.push(bullet('海报内容：雪球 logo / 队名 / 阵型 / 球场 11 圆点 / 11 只 ETF 分组列表 / 5 维评分 / 系统点评 / 二维码'))
C.push(bullet('二维码内容为 H5 首页 URL，扫码可进入活动；上线可改为带渠道追踪参数的 URL'))
C.push(bullet('海报生成完成即触发抽奖（见第六章），结果即时弹出'))

// ========== 六、抽奖玩法与规则 ==========
C.push(H1('六、抽奖玩法与规则'))
C.push(note('重要变更：原"跟帖主贴集赞冲榜"玩法因实现限制已取消，改为 H5 页面内抽奖。本章为最新玩法，产研以此为准。'))

C.push(H2('6.1 玩法说明'))
C.push(numbered('完成 3 题人格测试，找到你的"老板风格"'))
C.push(numbered('选阵型 + 挑选 11 只 ETF 组成你的球队'))
C.push(numbered('点「一键发布」：加自选 → 生成海报'))
C.push(numbered('海报生成后立即抽奖，即时知道是否中奖'))
C.push(numbered('中奖后可选择到雪球活动主帖发帖晒奖'))

C.push(H2('6.2 抽奖机制'))
C.push(bullet('抽奖在 H5 页面内进行，不再依赖主贴点赞'))
C.push(bullet('获得抽奖机会的条件：用户在 H5 完成「加自选 + 生成海报」'))
C.push(bullet('频次：一周一人仅 1 次抽奖机会'))
C.push(bullet('即时性：海报生成完成后立即触发抽奖，结果即时弹出（中奖 / 谢谢参与），无抽奖动画'))
C.push(bullet('中奖后：用户可选择到雪球活动主帖发帖晒奖'))
C.push(bullet('抽奖各环节需完整埋点（获得机会、抽奖触发、中奖结果、去主帖发帖）'))

C.push(H2('6.3 奖品设置'))
const prW = [2600, 3000, 3760]
C.push(table(prW, [
  headerRow(['奖品', '每周数量（参考）', '说明'], prW),
  new TableRow({ children: [
    cell('雪球品牌白酒', { width: prW[0], bold: true, color: GOLD }),
    cell('1 瓶 / 周', { width: prW[1], align: AlignmentType.CENTER }),
    cell('稀有奖', { width: prW[2] }),
  ] }),
  new TableRow({ children: [
    cell('雪球品牌棒球帽', { width: prW[0], bold: true }),
    cell('约 10 顶 / 周', { width: prW[1], align: AlignmentType.CENTER }),
    cell('常规奖', { width: prW[2] }),
  ] }),
]))
C.push(note('每周奖品数量为参考值，具体中奖概率由产研按奖品库存 / 参与人数设定。'))

C.push(H2('6.4 中奖与发奖'))
C.push(bullet('用户在 H5 即时得知中奖结果'))
C.push(bullet('中奖球友需提供收货信息，由雪球官方统一寄出实物奖品'))
C.push(bullet('收货信息可通过雪球站内信跟进收集'))
C.push(bullet('未及时提供 / 地址失效导致无法送达的，视为放弃'))

C.push(H2('6.5 一键发布与加自选机制'))
C.push(P('「一键发布」是获得抽奖机会的关键动作，依次执行：'))
C.push(numbered('加自选：把本周付费招商客户的产品加入雪球自选（每个客户 1 只，见 5.3）'))
C.push(numbered('生成海报'))
C.push(numbered('海报生成完成 → 触发抽奖 → 即时弹出结果'))
C.push(note('加自选的产品由后端接口返回（每个付费客户 1 只优先级产品），H5 照单加入；非阵容全部 11 只。加自选为雪球 JSBridge 调用，见第七章。'))

// ========== 七、待接入（产研重点） ==========
C.push(H1('七、待接入项（产研重点）'))
C.push(H2('7.1 后端接口'))
const apiW = [3400, 5960]
const apiRows = [
  ['GET /api/etf-campaign/products', 'ETF 产品池，替换 src/data/etfs.js mock'],
  ['GET /api/etf-campaign/sponsors', '本周付费客户 + 各自加自选的优先级产品（H5 照单加自选）'],
  ['POST /api/etf-campaign/lineups', '用户阵容提交（当前存 localStorage）'],
  ['POST /api/etf-campaign/lottery', '抽奖：校验本周机会、执行抽奖、返回中奖结果'],
  ['GET /api/etf-campaign/lottery/status', '查询用户本周是否已用过抽奖机会'],
  ['行情接口', 'ETF 近一周涨跌幅，替换 EtfCard.js 的 getWeeklyChange mock'],
]
C.push(table(apiW, [
  headerRow(['接口 / 数据源', '用途'], apiW),
  ...apiRows.map(r => new TableRow({ children: [cell(r[0], { width: apiW[0] }), cell(r[1], { width: apiW[1] })] })),
]))

C.push(H2('7.2 雪球 JSBridge'))
C.push(P('src/utils/xueqiuBridge.js 已封装占位方法，上线时替换为雪球 native 真实调用：'))
C.push(bullet('addToWatchlist(codes)：加自选。真实实现需在加自选成功时返回 { ok: true }，失败返回 { ok: false }，由调用方据此决定是否放行后续生成海报 / 抽奖。'))
C.push(bullet('海报保存：iOS WebView 内 a.click() 下载可能失效，建议接雪球 saveImage JSBridge。'))
C.push(bullet('发帖到活动主帖：中奖后引导用户去主帖晒奖，建议接雪球发帖 JSBridge（携带海报图）。'))

C.push(H2('7.3 其他上线前事项'))
C.push(bullet('队名输入框：当前仅长度限制 + 特殊字符过滤，需补敏感词拦截'))
C.push(bullet('抽奖：需接后端抽奖接口，含"一周一人一次"机会校验、中奖概率 / 库存控制'))
C.push(bullet('部署：从 GitHub Pages 迁移到雪球自有 CDN（vite.config.js base 已设为相对路径）'))
C.push(bullet('埋点：src/utils/analytics.js 当前 console 输出，需替换为真实埋点 SDK；抽奖全链路埋点必做'))

// ========== 八、合规文案 ==========
C.push(H1NoBreak('八、合规与风险提示文案'))
C.push(P('全站使用的风险提示 / 免责文案，请勿随意删改：'))
C.push(bullet('页面底部：本活动为雪球社区趣味互动内容，不构成任何投资建议。基金有风险，投资需谨慎。'))
C.push(bullet('选 ETF 页：页面展示的 ETF 仅作为活动候选，不代表收益承诺或投资建议。基金有风险，投资需谨慎。'))
C.push(bullet('评分页：阵容评分由活动规则生成，仅用于趣味展示，不代表产品未来表现。'))
C.push(bullet('海报：本阵容仅为个人趣味配置展示，不构成投资建议。基金有风险，投资需谨慎。'))
C.push(bullet('规则页：本活动为雪球社区趣味互动内容，不构成任何投资建议。基金有风险，投资需谨慎。历史业绩不预示未来表现。'))

C.push(new Paragraph({ spacing: { before: 400 } }))
C.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: '— 文档结束 —', font: FONT, size: 20, color: '999999', italics: true })],
}))

const doc = new Document({
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONT, size: 21 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 30, bold: true, color: GOLD },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 24, bold: true, color: DARK },
        paragraph: { spacing: { before: 260, after: 140 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 21, bold: true, color: BLUE },
        paragraph: { spacing: { before: 200, after: 110 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'b', levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 560, hanging: 280 } } } },
      ] },
      { reference: 'n', levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 560, hanging: 280 } } } },
      ] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1320, bottom: 1440, left: 1320 } } },
    children: C,
  }],
})

const out = path.join(__dirname, '..', 'ETF世界杯H5产研交接文档.docx')
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(out, buf); console.log('✓ written:', out) })
