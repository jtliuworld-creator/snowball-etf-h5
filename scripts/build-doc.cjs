const fs = require('fs')
const path = require('path')
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak,
} = require('docx')

// ---- 配置 ----
const FONT = '微软雅黑' // 中文友好；Mac 上没有会回退到系统中文字体
const ACCENT = 'D4A017' // 帝王金
const SECOND_ACCENT = '2A85E0' // 雪球蓝
const RED = 'E63946'
const DARK = '0A0A0A'

const border = { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' }
const borders = { top: border, bottom: border, left: border, right: border }

// ---- 工具函数 ----
function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 100 },
    ...opts,
    children: [new TextRun({ text, font: FONT, size: opts.size || 22, ...opts.run })],
  })
}

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, font: FONT, size: 32, bold: true })],
  })
}

function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: DARK })],
  })
}

function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 220, after: 120 },
    children: [new TextRun({ text, font: FONT, size: 22, bold: true, color: SECOND_ACCENT })],
  })
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: FONT, size: 22 })],
  })
}

function numbered(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: FONT, size: 22 })],
  })
}

function cell(text, opts = {}) {
  return new TableCell({
    borders,
    width: { size: opts.width || 2340, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [new TextRun({ text, font: FONT, size: opts.size || 20, bold: opts.bold, color: opts.color })],
      }),
    ],
  })
}

function table(columnWidths, rows) {
  const totalWidth = columnWidths.reduce((s, w) => s + w, 0)
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths,
    rows,
  })
}

// ---- 文档内容 ----
const sections = [
  // ===== 封面 =====
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 240 },
    children: [new TextRun({ text: '「做 ETF 球队老板」H5 招商说明书', font: FONT, size: 44, bold: true, color: ACCENT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: '雪球社区互动活动 · 内部说明文档', font: FONT, size: 24, color: '666666' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: '版本：v1.0  |  发布日期：2026-05-21', font: FONT, size: 22, color: '999999' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: '当前体验链接：https://jtliuworld-creator.github.io/snowball-etf-h5/', font: FONT, size: 22, color: SECOND_ACCENT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: '（建议使用 Safari / Chrome 浏览器打开，移动端体验最佳）', font: FONT, size: 18, color: '999999', italics: true })],
  }),
  new Paragraph({ children: [new PageBreak()] }),

  // ===== 一、项目概况 =====
  H1('一、项目概况'),

  H2('1.1 项目定位'),
  P('「做 ETF 球队老板」是一款面向雪球社区球友的轻量互动 H5 游戏。用户通过完成 3 题人格测试 → 选择阵型 → 挑选 11 只 ETF 组成"球队"，最终生成一张个性化阵容海报，跟帖到雪球活动主贴下方集赞冲榜。'),

  H2('1.2 产品形态'),
  bullet('载体：移动端 H5（375 - 430px 适配各机型）'),
  bullet('运行环境：系统浏览器 + 雪球 App 内置 WebView'),
  bullet('技术栈：React 18 + Vite + html2canvas + qrcode'),
  bullet('部署：静态站点托管（当前 GitHub Pages，正式上线接入雪球 CDN）'),

  H2('1.3 目标用户'),
  bullet('雪球社区已有用户：基金/ETF 投资者，对组合配置感兴趣'),
  bullet('对比体育赛事 + 投资策略的跨界群体'),
  bullet('社交传播节点：愿意分享投资观点的活跃用户'),

  H2('1.4 商业价值'),
  bullet('品牌曝光：用户在选 ETF、生成海报、扫码传播每个环节都接触招商方品牌'),
  bullet('精准触达：用户已表明对 ETF 投资感兴趣，是基金公司目标客群'),
  bullet('社交裂变：海报跟帖到主贴 + 朋友圈分享 + 二维码扫码进入，三层裂变路径'),
  bullet('一键自选：用户可一键将 11 只 ETF 加入雪球自选列表，长期触达'),

  // ===== 二、核心玩法 =====
  H1('二、核心玩法（5 步参与）'),

  P('用户从首页开始走完整个体验，全程约 3-5 分钟：', { run: { italics: true, color: '666666' } }),

  H2('步骤 1：完成 3 题人格测试'),
  bullet('3 道选择题，每题 4 个选项，定位用户的"老板风格"'),
  bullet('4 种人格画像：进攻型 / 防守型 / 控球型 / 均衡型'),
  bullet('系统据此推荐最匹配阵型'),

  H2('步骤 2：选择阵型（5 种）'),
  table([2160, 2160, 2160, 2160], [
    new TableRow({
      tableHeader: true,
      children: [
        cell('阵型', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2160 }),
        cell('配置', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2160 }),
        cell('风格定位', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2160 }),
        cell('属性加成', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2160 }),
      ],
    }),
    new TableRow({ children: [
      cell('3-4-3', { width: 2160, align: AlignmentType.CENTER, bold: true }),
      cell('3 前 + 4 中 + 3 后 + 1 门', { width: 2160 }),
      cell('进攻压迫型', { width: 2160 }),
      cell('进攻 +10 / 防守 -5 / 控场 +3', { width: 2160 }),
    ] }),
    new TableRow({ children: [
      cell('4-3-3', { width: 2160, align: AlignmentType.CENTER, bold: true }),
      cell('3 前 + 3 中 + 4 后 + 1 门', { width: 2160 }),
      cell('均衡进攻型', { width: 2160 }),
      cell('进攻 +6 / 防守 +3 / 控场 +5', { width: 2160 }),
    ] }),
    new TableRow({ children: [
      cell('4-4-2', { width: 2160, align: AlignmentType.CENTER, bold: true }),
      cell('2 前 + 4 中 + 4 后 + 1 门', { width: 2160 }),
      cell('经典平衡型', { width: 2160 }),
      cell('进攻 +3 / 防守 +5 / 控场 +6', { width: 2160 }),
    ] }),
    new TableRow({ children: [
      cell('5-3-2', { width: 2160, align: AlignmentType.CENTER, bold: true }),
      cell('2 前 + 3 中 + 5 后 + 1 门', { width: 2160 }),
      cell('稳守反击型', { width: 2160 }),
      cell('进攻 -3 / 防守 +10 / 控场 +3', { width: 2160 }),
    ] }),
    new TableRow({ children: [
      cell('4-5-1', { width: 2160, align: AlignmentType.CENTER, bold: true }),
      cell('1 前 + 5 中 + 4 后 + 1 门', { width: 2160 }),
      cell('中场控球型', { width: 2160 }),
      cell('进攻 -5 / 防守 +3 / 控场 +10', { width: 2160 }),
    ] }),
  ]),

  H2('步骤 3：选择 11 只 ETF 组成阵容'),
  bullet('按所选阵型，从 4 个位置（前锋 / 中场 / 后卫 / 门将）的产品池里挑选共 11 只 ETF'),
  bullet('每只产品展示：位置 / 名称 / 基金公司 / 代码 / 近一周涨跌幅 / 一句话简介 / 风险等级'),
  bullet('每个位置选满自动跳到下一位置；可点击已选 ETF 取消'),
  bullet('每个位置的第一只产品自带「今日推荐」金色徽章（详见招商资源位）'),

  H2('步骤 4：阵容评分 + 海报生成'),
  bullet('系统计算 5 维评分：进攻力 / 防守力 / 控场力 / 平衡度 / 个性值'),
  bullet('给出系统点评（6 种规则文案，随评分变化）'),
  bullet('用户可编辑队名（默认随机生成 30+ 个候选名称）'),
  bullet('一键生成专属阵容海报：11 个球员位置、球场图、5 维评分、点评、奖品提示、雪球品牌二维码'),

  H2('步骤 5：发布到雪球活动主贴'),
  bullet('海报生成后给用户 3 个操作按钮（详见下方"互动机制"章节）：'),
  bullet('一键发布：保存海报到相册 + 一键加 11 只 ETF 到雪球自选 + 分享到朋友圈', 1),
  bullet('保存海报参加活动：保存图片，引导用户跟帖到雪球活动主贴', 1),
  bullet('重新生成：返回修改阵容', 1),

  new Paragraph({ children: [new PageBreak()] }),

  // ===== 三、奖励机制 =====
  H1('三、奖励机制'),

  H2('3.0 活动时间'),
  bullet('2026.06.12 — 2026.07.20，共 39 天'),

  H2('3.1 每日榜 TOP 5'),
  bullet('结算节点：每日 24:00'),
  bullet('计票口径：当日在雪球活动主贴下用户海报跟帖的点赞数'),
  bullet('奖品：雪球品牌棒球帽 × 1 顶'),
  bullet('每日 5 名得主'),

  H2('3.2 每周榜 TOP 1'),
  bullet('结算节点：每周日 24:00'),
  bullet('计票口径：本周累计点赞数'),
  bullet('奖品：雪球品牌白酒 × 1 瓶'),
  bullet('每周开奖 1 名，与每日奖可叠加'),

  H2('3.3 获奖名额规则'),
  bullet('日度奖：同一用户每周最多获得 1 次。一周内多次进入日榜 TOP 5，从第 2 次起名额顺延给下一名；下一周重新计算，可再获 1 次'),
  bullet('周度奖：同一用户在整个活动期内最多获得 1 次。若再次成为周榜第一，奖品顺延给第二名'),
  bullet('日度奖与周度奖互不影响，可同时获得'),

  H2('3.4 点赞规则'),
  bullet('所有点赞均发生在雪球活动主贴评论区，认用户海报跟帖的点赞数'),
  bullet('每个用户每天最多为同一条海报点赞 1 次'),
  bullet('检测到刷赞 / 小号互赞将取消评奖资格'),

  H2('3.5 开奖与发奖通知'),
  bullet('开奖公示：每天发布一篇雪球帖子，公示当日 / 当周获奖人员名单'),
  bullet('实时通知：获奖结果通过雪球「站内信」实时发送给获奖球友'),
  bullet('实物发放：获奖球友收到站内信后，按提示回复收货信息，由雪球官方统一寄出'),
  bullet('未及时回复 / 地址失效导致无法送达的，视为放弃奖品'),

  // ===== 四、招商资源位 =====
  H1('四、招商资源位（重点）'),

  P('当前 H5 提供 3 类核心招商资源位，每类资源位可独立计价：', { run: { italics: true, color: '666666' } }),

  H2('4.1 资源位 A：ETF 产品池'),
  H3('描述'),
  P('每个位置（前锋 / 中场 / 后卫 / 门将）的产品候选池由若干 ETF 组成，用户从中挑选组队。每只 ETF 在选取页和阵容海报上获得高频曝光。'),
  P('后台维护一份完整 ETF 名单（目前约 40-50 只产品），按位置分类。前端展示池从该名单中按位置取数；招商客户的产品通过运营后台标记进入对应位置池。', { run: { italics: true, color: '666666' } }),
  H3('当前 H5 演示池容量'),
  table([2340, 2340, 2340, 2340], [
    new TableRow({
      tableHeader: true,
      children: [
        cell('位置', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2340 }),
        cell('演示池大小', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2340 }),
        cell('单次组队需选', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2340 }),
        cell('后台名单', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2340 }),
      ],
    }),
    new TableRow({ children: [
      cell('前锋', { width: 2340, align: AlignmentType.CENTER }),
      cell('9 只', { width: 2340, align: AlignmentType.CENTER }),
      cell('1-3 只（按阵型）', { width: 2340, align: AlignmentType.CENTER }),
      cell('运营维护', { width: 2340, align: AlignmentType.CENTER, color: SECOND_ACCENT }),
    ] }),
    new TableRow({ children: [
      cell('中场', { width: 2340, align: AlignmentType.CENTER }),
      cell('9 只', { width: 2340, align: AlignmentType.CENTER }),
      cell('3-5 只（按阵型）', { width: 2340, align: AlignmentType.CENTER }),
      cell('运营维护', { width: 2340, align: AlignmentType.CENTER, color: SECOND_ACCENT }),
    ] }),
    new TableRow({ children: [
      cell('后卫', { width: 2340, align: AlignmentType.CENTER }),
      cell('7 只', { width: 2340, align: AlignmentType.CENTER }),
      cell('3-5 只（按阵型）', { width: 2340, align: AlignmentType.CENTER }),
      cell('运营维护', { width: 2340, align: AlignmentType.CENTER, color: SECOND_ACCENT }),
    ] }),
    new TableRow({ children: [
      cell('门将', { width: 2340, align: AlignmentType.CENTER }),
      cell('5 只', { width: 2340, align: AlignmentType.CENTER }),
      cell('恒定 1 只', { width: 2340, align: AlignmentType.CENTER }),
      cell('运营维护', { width: 2340, align: AlignmentType.CENTER, color: SECOND_ACCENT }),
    ] }),
  ]),
  P('当前 H5 演示池合计：30 只 ETF。正式上线时由后台 40-50 只名单驱动。', { run: { bold: true } }),

  H3('单只产品展示信息'),
  bullet('位置标签（带颜色识别）'),
  bullet('ETF 名称'),
  bullet('基金公司'),
  bullet('代码'),
  bullet('近一周涨跌幅（当前 mock，上线前接行情接口）'),
  bullet('一句话简介（合作方自定义，限 30 字）'),
  bullet('风险等级'),
  bullet('技能名（如"爆发突击" / "稳健守护"等趣味标签，合作方自定义）'),

  H2('4.2 资源位 B：招商「跑马灯」轮转头牌位'),
  H3('机制说明'),
  P('已付费的招商客户占据每个位置 ETF 列表的头部「头牌位」。每个客户在所属位置贡献一只「头牌产品」，按轮转顺序排列。排在第一位的产品自带「今日推荐」金色徽章 + 渐变光晕背景。'),
  bullet('活动第 1 天：头牌位按招商客户签约顺序排列'),
  bullet('从第 2 天起：整体「跑马灯式」轮转一位 —— 原第一位移到末位，其余依次前移'),
  bullet('保证每个招商客户在轮转周期内，都能轮到「第一位 / 今日推荐」的曝光'),
  H3('轮转示例（假设 A=华夏、B=易方达、C=富国 三家签约）'),
  table([1560, 2520, 2520, 2520], [
    new TableRow({
      tableHeader: true,
      children: [
        cell('日期', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 1560 }),
        cell('第一位（今日推荐）', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2520 }),
        cell('第二位', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2520 }),
        cell('第三位', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2520 }),
      ],
    }),
    new TableRow({ children: [
      cell('第 1 天', { width: 1560, align: AlignmentType.CENTER, bold: true }),
      cell('华夏', { width: 2520, align: AlignmentType.CENTER, color: ACCENT, bold: true }),
      cell('易方达', { width: 2520, align: AlignmentType.CENTER }),
      cell('富国', { width: 2520, align: AlignmentType.CENTER }),
    ] }),
    new TableRow({ children: [
      cell('第 2 天', { width: 1560, align: AlignmentType.CENTER, bold: true }),
      cell('易方达', { width: 2520, align: AlignmentType.CENTER, color: ACCENT, bold: true }),
      cell('富国', { width: 2520, align: AlignmentType.CENTER }),
      cell('华夏', { width: 2520, align: AlignmentType.CENTER }),
    ] }),
    new TableRow({ children: [
      cell('第 3 天', { width: 1560, align: AlignmentType.CENTER, bold: true }),
      cell('富国', { width: 2520, align: AlignmentType.CENTER, color: ACCENT, bold: true }),
      cell('华夏', { width: 2520, align: AlignmentType.CENTER }),
      cell('易方达', { width: 2520, align: AlignmentType.CENTER }),
    ] }),
    new TableRow({ children: [
      cell('第 4 天', { width: 1560, align: AlignmentType.CENTER, bold: true }),
      cell('（回到第 1 天，循环往复）', { width: 7560, align: AlignmentType.CENTER, color: '999999' }),
    ] }),
  ]),
  H3('计价建议'),
  bullet('轮转头牌位是核心商业化资源 —— 每个签约客户都能轮到"第一位"曝光，公平且稀缺'),
  bullet('客户数越少，每家轮到"第一位"的频次越高（如 3 家签约 = 每 3 天轮到 1 次第一位）'),
  bullet('建议按"签约席位数"定价：席位越少单价越高（稀缺性溢价）'),
  bullet('名单顺序、轮转周期均可由运营后台配置'),

  H2('4.3 资源位 C：海报二维码'),
  H3('描述'),
  P('生成的阵容海报右下角自带二维码，扫码进入 H5 活动首页。海报通过用户跟帖、朋友圈分享传播，二维码就是新用户获取入口。'),
  H3('当前指向'),
  bullet('H5 活动首页（https://jtliuworld-creator.github.io/snowball-etf-h5/）'),
  bullet('可改成招商方品牌官网、雪球公众号关注页、雪球App下载页等任意 URL'),
  bullet('支持给每个招商客户生成独立的"带渠道追踪参数"的二维码，便于复盘'),

  // ===== 五、用户曝光路径 =====
  H1('五、用户曝光路径'),

  P('用户从打开 H5 到完成发布，会经过以下品牌曝光节点：', { run: { italics: true, color: '666666' } }),

  table([720, 2520, 1620, 3780], [
    new TableRow({
      tableHeader: true,
      children: [
        cell('节点', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 720 }),
        cell('页面', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 2520 }),
        cell('曝光时长', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 1620 }),
        cell('曝光元素', { shading: 'F0F0F0', bold: true, align: AlignmentType.CENTER, width: 3780 }),
      ],
    }),
    new TableRow({ children: [
      cell('1', { width: 720, align: AlignmentType.CENTER, bold: true }),
      cell('选 ETF 页（前锋）', { width: 2520 }),
      cell('30-60 秒', { width: 1620, align: AlignmentType.CENTER }),
      cell('第一位「今日推荐」品牌曝光、其他 7 只产品平铺曝光', { width: 3780 }),
    ] }),
    new TableRow({ children: [
      cell('2', { width: 720, align: AlignmentType.CENTER, bold: true }),
      cell('选 ETF 页（中场）', { width: 2520 }),
      cell('30-60 秒', { width: 1620, align: AlignmentType.CENTER }),
      cell('同上', { width: 3780 }),
    ] }),
    new TableRow({ children: [
      cell('3', { width: 720, align: AlignmentType.CENTER, bold: true }),
      cell('选 ETF 页（后卫）', { width: 2520 }),
      cell('30-60 秒', { width: 1620, align: AlignmentType.CENTER }),
      cell('同上', { width: 3780 }),
    ] }),
    new TableRow({ children: [
      cell('4', { width: 720, align: AlignmentType.CENTER, bold: true }),
      cell('选 ETF 页（门将）', { width: 2520 }),
      cell('15-30 秒', { width: 1620, align: AlignmentType.CENTER }),
      cell('同上', { width: 3780 }),
    ] }),
    new TableRow({ children: [
      cell('5', { width: 720, align: AlignmentType.CENTER, bold: true }),
      cell('阵容评分页', { width: 2520 }),
      cell('1-2 分钟', { width: 1620, align: AlignmentType.CENTER }),
      cell('11 只 ETF 名称+公司清单 + 球场 11 圆点', { width: 3780 }),
    ] }),
    new TableRow({ children: [
      cell('6', { width: 720, align: AlignmentType.CENTER, bold: true }),
      cell('海报', { width: 2520 }),
      cell('反复传播（不限）', { width: 1620, align: AlignmentType.CENTER }),
      cell('海报上 11 只产品名称 + 二维码（每次截图被点开都是一次曝光）', { width: 3780 }),
    ] }),
    new TableRow({ children: [
      cell('7', { width: 720, align: AlignmentType.CENTER, bold: true }),
      cell('一键加自选', { width: 2520 }),
      cell('永久（接 JSBridge 后）', { width: 1620, align: AlignmentType.CENTER }),
      cell('11 只产品永久进入用户雪球自选列表，每次打开雪球都触达', { width: 3780, color: RED }),
    ] }),
  ]),

  new Paragraph({ children: [new PageBreak()] }),

  // ===== 六、互动机制（发布 / 加自选 / 分享） =====
  H1('六、海报发布互动机制'),

  P('用户生成海报后，会看到三个并列的操作按钮：'),

  H2('6.1 主推：🎁 一键发布（金色高亮按钮）'),
  P('用户点击一次，依次自动执行：'),
  numbered('保存海报到相册'),
  numbered('一键将 11 只 ETF 加入雪球自选列表（接 JSBridge）'),
  numbered('调起朋友圈分享面板（接 JSBridge）'),
  P('💡 这个按钮是招商客户最看重的环节 —— 用户一键完成"保存→加自选→朋友圈"三个动作，11 只 ETF（含招商方产品）一次性进入用户的自选股长期触达通道。', { run: { italics: true, color: SECOND_ACCENT } }),

  H2('6.2 次级：💾 保存海报参加活动'),
  P('为不想加自选/分享朋友圈的用户提供单独通道：只保存图片，引导用户跟帖到雪球活动主贴评论区集赞冲奖。'),

  H2('6.3 兜底：🔄 重新生成'),
  P('若用户不满意当前阵容，可返回继续修改。'),

  // ===== 七、品牌资产 =====
  H1('七、品牌资产 & 视觉规范'),

  H2('7.1 主题色（黑金红）'),
  bullet('主底色：极夜黑 #0A0A0A（A 股语境无绿主色，避开"跌"色）'),
  bullet('强调色：帝王金 #FFB800（按钮、关键数字、品牌标题）'),
  bullet('热量色：炽烈红 #E63946（涨幅、高分、警示）'),
  bullet('冷却色：冰蓝 #4DABF7 / 深靛蓝 #3A5FCD（中场/后卫位置识别）'),

  H2('7.2 雪球 Logo'),
  bullet('海报顶部固定展示官方雪球 logo（蓝白透明 PNG）'),
  bullet('首页顶部展示雪球 logo 作为品牌锚点'),

  H2('7.3 字体 & 排版'),
  bullet('系统字体优先：苹方（iOS）/ 微软雅黑（Android）'),
  bullet('信息层级：金色加粗 → 白色主文 → 灰色次要'),

  H2('7.4 视觉风格定位'),
  P('黑金红配色 + 足球场绿底 → 兼顾"奢华金融"与"体育竞技"双重质感。区别于纯娱乐 H5 的轻快感，也避免传统金融的严肃感。适合传播到雪球社区高净值用户群。'),

  // ===== 八、技术对接 =====
  H1('八、技术对接（给雪球研发同学）'),

  H2('8.1 雪球 App JSBridge 占位'),
  P('当前 H5 已预留两个雪球 JSBridge 调用点，封装在 src/utils/xueqiuBridge.js：'),
  bullet('addToWatchlist(codes) —— 一键加自选'),
  bullet('shareToFriendCircle(image, title) —— 分享到朋友圈'),
  P('上线时，由雪球研发同学告知具体 native 方法名，前端替换两行代码即可生效。'),

  H2('8.2 后端接口待对接（标记 // TODO 的位置）'),
  bullet('GET /api/etf-campaign/products —— ETF 产品池（替换当前 mock 数据）'),
  bullet('POST /api/etf-campaign/lineups —— 用户阵容提交'),
  bullet('GET /api/etf-campaign/rankings —— 真实点赞榜单'),
  bullet('GET /api/etf-campaign/sponsors —— 招商客户名单（用于轮值）'),
  bullet('ETF 近一周涨跌幅 —— 当前 mock，接行情接口'),

  H2('8.3 部署'),
  bullet('当前测试环境：GitHub Pages（部分网络受 DNS 影响）'),
  bullet('正式上线：建议部署到雪球自有 CDN（腾讯云 / 阿里云）'),
  bullet('构建产物：~440KB 总包（gzip 后 ~120KB），首屏快'),

  // ===== 九、迭代路径 =====
  H1('九、迭代路径'),

  H2('9.1 第 1 期：当前已完成（招商案使用版本）'),
  bullet('完整玩法链路（测试 → 阵型 → 选 ETF → 评分 → 海报 → 跟帖）'),
  bullet('招商跑马灯轮转头牌位 + 今日推荐徽章'),
  bullet('海报二维码导流'),
  bullet('一键加自选 + 朋友圈分享按钮（占位等接 SDK）'),

  H2('9.2 第 2 期：接接口后'),
  bullet('真实 ETF 产品池 + 近一周涨跌幅'),
  bullet('真实点赞计数（替换 localStorage mock）'),
  bullet('真实榜单数据'),
  bullet('雪球 JSBridge 接通（加自选 + 朋友圈分享真实生效）'),

  H2('9.3 第 3 期：商业化扩展'),
  bullet('支持每个招商客户独立的渠道追踪二维码'),
  bullet('支持"基金公司战术馆"专题入口（一家公司专属页面）'),
  bullet('KOL / 大 V 同款阵容预设展示'),
  bullet('好友 PK 模式（链接带阵容 ID，可对比）'),

  // ===== 附录：联系人 =====
  H1('附录：当前对接信息'),

  table([2340, 6900], [
    new TableRow({ children: [
      cell('项目', { width: 2340, shading: 'F0F0F0', bold: true }),
      cell('信息', { width: 6900, shading: 'F0F0F0', bold: true }),
    ] }),
    new TableRow({ children: [
      cell('当前体验链接', { width: 2340 }),
      cell('https://jtliuworld-creator.github.io/snowball-etf-h5/', { width: 6900, color: SECOND_ACCENT }),
    ] }),
    new TableRow({ children: [
      cell('代码仓库', { width: 2340 }),
      cell('https://github.com/jtliuworld-creator/snowball-etf-h5', { width: 6900, color: SECOND_ACCENT }),
    ] }),
    new TableRow({ children: [
      cell('技术栈', { width: 2340 }),
      cell('React 18 / Vite / html2canvas / qrcode', { width: 6900 }),
    ] }),
    new TableRow({ children: [
      cell('当前演示池规模', { width: 2340 }),
      cell('30 只（前 9 + 中 9 + 后 7 + 门 5）；后台名单约 40-50 只', { width: 6900 }),
    ] }),
    new TableRow({ children: [
      cell('单次组队产品数', { width: 2340 }),
      cell('11 只（按阵型分配）', { width: 6900 }),
    ] }),
    new TableRow({ children: [
      cell('招商轮转机制', { width: 2340 }),
      cell('跑马灯轮转头牌位，签约席位数可配置', { width: 6900 }),
    ] }),
    new TableRow({ children: [
      cell('开奖与通知', { width: 2340 }),
      cell('每日发帖公示名单 + 站内信实时通知获奖球友', { width: 6900 }),
    ] }),
  ]),

  new Paragraph({ spacing: { before: 400 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: '— END —', font: FONT, size: 22, color: '999999', italics: true })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
    children: [new TextRun({ text: '如有疑问，请联系项目负责人', font: FONT, size: 20, color: 'AAAAAA' })],
  }),
]

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 32, bold: true, color: ACCENT },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 26, bold: true, color: DARK },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 22, bold: true, color: SECOND_ACCENT },
        paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
      ] },
      { reference: 'numbers', levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: sections,
  }],
})

const outPath = path.join(__dirname, '..', 'ETF球队老板H5招商说明书.docx')
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer)
  console.log(`✓ written: ${outPath}`)
})
