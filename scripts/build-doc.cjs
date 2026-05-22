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
    children: [new TextRun({ text: '「来战！我的 ETF 世界杯阵容」H5 招商说明书', font: FONT, size: 36, bold: true, color: ACCENT })],
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
  P('「来战！我的 ETF 世界杯阵容」是一款面向雪球社区球友的轻量互动 H5 游戏。用户通过完成 3 题人格测试 → 选择阵型 → 挑选 11 只 ETF 组成"球队"，生成个性化阵容海报，并参与 H5 页面内抽奖赢取雪球周边奖品。'),

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
  bullet('社交裂变：海报二维码扫码进入 + 中奖晒贴，多层裂变路径'),
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
  bullet('付费招商客户的产品在所属位置池中置顶展示（详见招商资源位）'),

  H2('步骤 4：阵容评分 + 海报生成'),
  bullet('系统计算 5 维评分：进攻力 / 防守力 / 控场力 / 平衡度 / 个性值'),
  bullet('给出系统点评（6 种规则文案，随评分变化）'),
  bullet('用户可编辑队名（默认随机生成 30+ 个候选名称）'),
  bullet('一键生成专属阵容海报：11 个球员位置、球场图、5 维评分、点评、奖品提示、雪球品牌二维码'),

  H2('步骤 5：一键发布 + 抽奖'),
  bullet('点「一键发布」：先加自选（付费招商客户的产品）→ 再生成专属阵容海报', 1),
  bullet('海报生成后立即抽奖，即时弹出是否中奖', 1),
  bullet('中奖后，用户可选择到雪球活动主帖发帖晒奖', 1),

  new Paragraph({ children: [new PageBreak()] }),

  // ===== 三、抽奖机制 =====
  H1('三、抽奖机制'),

  H2('3.0 活动时间'),
  bullet('2026.06.12 — 2026.07.20，共 39 天'),

  H2('3.1 抽奖玩法'),
  bullet('活动采用 H5 页面内抽奖（不依赖主贴点赞）'),
  bullet('获得抽奖机会的条件：用户在 H5 完成「加自选 + 生成海报」'),
  bullet('频次：一周一人仅 1 次抽奖机会'),
  bullet('即时性：海报生成后立即抽奖，结果即时弹出（中奖 / 谢谢参与）'),
  bullet('中奖后：用户可选择到雪球活动主帖发帖晒奖'),

  H2('3.2 奖品设置（每周）'),
  bullet('雪球品牌白酒 × 1 瓶（稀有奖）'),
  bullet('雪球品牌棒球帽 × 约 10 顶（常规奖）'),
  bullet('每周奖品数量为参考值，中奖概率按库存 / 参与人数设定'),

  H2('3.3 发奖通知'),
  bullet('用户在 H5 即时得知中奖结果'),
  bullet('中奖球友提供收货信息（可经雪球站内信跟进），由雪球官方统一寄出'),
  bullet('未及时提供 / 地址失效导致无法送达的，视为放弃奖品'),

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

  H2('4.2 资源位 B：招商售卖模型与加自选权益'),
  H3('售卖规则'),
  bullet('每周最多售卖给 2 个付费客户'),
  bullet('每个客户提供 4 只 ETF：前锋 / 中场 / 后卫 / 门将 各 1 只'),
  bullet('价格：10 万元 / 客户 / 周（参考价，最终以媒介报价为准）'),
  bullet('客户产品进入对应位置的 ETF 池，获得选取页与海报曝光'),
  H3('加自选优先级（核心权益）'),
  bullet('用户在 H5 完成「加自选」时，每个客户只有 1 只产品被加入用户的雪球自选'),
  bullet('客户需对自己的 4 只产品排优先级，指定最希望被加自选的 1 个位置'),
  bullet('2 个客户 = 用户共加 2 只自选（来自 2 个不同位置）'),
  bullet('加自选把产品沉淀进用户雪球自选列表，是长期触达资源，为本活动最核心的商业化权益'),
  H3('排他性与下单顺序'),
  bullet('一个客户选定某位置作为加自选优先位后，第二个客户不能再选同一位置'),
  bullet('先下单的客户优先选位置，后下单的客户从剩余位置中选 —— 最终结果与下单顺序强相关'),
  bullet('示例：客户 A 先下单选「前锋」→ 客户 B 只能从中场 / 后卫 / 门将中选'),
  H3('计价建议'),
  bullet('每周席位稀缺（仅 2 个），加自选优先位先到先得'),
  bullet('下单顺序决定优先位选择权，本身即是稀缺性议价点，建议鼓励客户尽早下单'),

  H2('4.3 资源位 C：海报二维码'),
  H3('描述'),
  P('生成的阵容海报右下角自带二维码，扫码进入 H5 活动首页。海报通过用户保存、中奖晒贴传播，二维码就是新用户获取入口。'),
  H3('当前指向'),
  bullet('H5 活动首页（https://jtliuworld-creator.github.io/snowball-etf-h5/）'),
  bullet('可改成招商方品牌官网、雪球公众号关注页、雪球App下载页等任意 URL'),
  bullet('支持给每个招商客户生成独立的"带渠道追踪参数"的二维码，便于复盘'),

  H2('4.4 产品提报与每周更换'),
  bullet('客户每周提报 4 只 ETF（前锋 / 中场 / 后卫 / 门将 各 1 只），并标注加自选优先级'),
  bullet('通过《ETF 厂商产品提报表》（随附 Excel）提报，按位置分类填写'),
  bullet('运营同学按提报表，在后台 / 产品配置中手动更新当周名单'),
  bullet('当前 H5 产品数据以配置文件维护（src/data/etfs.js），已预留接口位，后续接 GET /api/etf-campaign/products 改为后台可视化配置'),
  H3('提报表字段'),
  bullet('位置、ETF 简称、ETF 代码、基金公司、产品一句话简介、风险等级、建议球员技能名、加自选优先级'),
  bullet('五维评分由雪球运营统一设定，近一周涨跌幅由系统接行情接口，厂商均无需填写'),

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
      cell('付费客户产品置顶曝光、其他产品平铺曝光', { width: 3780 }),
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
      cell('一键发布·加自选', { width: 2520 }),
      cell('永久（接 JSBridge 后）', { width: 1620, align: AlignmentType.CENTER }),
      cell('付费客户的优先级产品进入用户雪球自选列表，每次打开雪球都触达', { width: 3780, color: RED }),
    ] }),
  ]),

  new Paragraph({ children: [new PageBreak()] }),

  // ===== 六、一键发布与抽奖 =====
  H1('六、一键发布与抽奖机制'),

  H2('6.1 一键发布流程'),
  P('阵容评分页点「一键发布」，依次自动执行：'),
  numbered('加自选：把本周付费招商客户的产品加入用户雪球自选（每个客户 1 只优先级产品）'),
  numbered('加自选成功后，生成专属阵容海报'),
  numbered('海报生成完成 → 立即触发抽奖 → 即时弹出结果'),
  P('💡 招商客户最核心的商业价值点 —— 用户每次发布，付费客户的优先级 ETF 都会被加入其雪球自选列表，进入长期触达通道。', { run: { italics: true, color: SECOND_ACCENT } }),

  H2('6.2 加自选范围'),
  bullet('只加「付费招商客户」的优先级产品（每周 ≤ 2 个客户，各 1 只），不是阵容全部 11 只'),
  bullet('哪些客户为付费客户、各自加哪只产品，由后台名单决定 —— 接口 GET /api/etf-campaign/sponsors'),
  bullet('排他性：2 个客户的加自选位置不能相同，先下单者优先选位（见 4.2）'),

  H2('6.3 抽奖'),
  bullet('海报生成后立即抽奖，结果即时弹出（中奖 / 谢谢参与）'),
  bullet('一周一人仅 1 次抽奖机会'),
  bullet('奖品：每周雪球白酒 × 1 瓶 + 雪球棒球帽 × 约 10 顶'),
  bullet('中奖后，用户可选择到雪球活动主帖发帖晒奖，形成二次传播'),

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
  bullet('发帖到活动主帖 —— 中奖后引导用户晒奖（建议接雪球发帖 JSBridge）'),
  P('上线时，由雪球研发同学告知具体 native 方法名，前端替换两行代码即可生效。'),

  H2('8.2 后端接口待对接'),
  bullet('GET /api/etf-campaign/products —— ETF 产品池（替换当前 mock 数据）'),
  bullet('POST /api/etf-campaign/lineups —— 用户阵容提交'),
  bullet('POST /api/etf-campaign/lottery —— 抽奖（机会校验 + 中奖结果）'),
  bullet('GET /api/etf-campaign/sponsors —— 本周付费客户 + 各自加自选优先级产品'),
  bullet('ETF 近一周涨跌幅 —— 当前 mock，接行情接口'),

  H2('8.3 部署'),
  bullet('当前测试环境：GitHub Pages（部分网络受 DNS 影响）'),
  bullet('正式上线：建议部署到雪球自有 CDN（腾讯云 / 阿里云）'),
  bullet('构建产物：~440KB 总包（gzip 后 ~120KB），首屏快'),

  // ===== 九、迭代路径 =====
  H1('九、迭代路径'),

  H2('9.1 第 1 期：当前已完成（原型版本）'),
  bullet('完整玩法链路（测试 → 阵型 → 选 ETF → 评分 → 海报）'),
  bullet('招商客户产品置顶展示'),
  bullet('海报二维码导流'),
  bullet('一键发布 + 加自选按钮（占位等接 SDK）'),

  H2('9.2 第 2 期：接接口 + 抽奖'),
  bullet('真实 ETF 产品池 + 近一周涨跌幅'),
  bullet('H5 页面内抽奖（接后端抽奖接口，机会校验 + 中奖概率控制）'),
  bullet('雪球 JSBridge 接通（加自选真实生效）'),

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
      cell('招商售卖模型', { width: 2340 }),
      cell('每周 ≤ 2 个客户，10 万元/客户/周，每客户 4 只产品（前/中/后/门）', { width: 6900 }),
    ] }),
    new TableRow({ children: [
      cell('用户奖励机制', { width: 2340 }),
      cell('H5 页面内抽奖，一周一人 1 次；每周白酒 ×1 + 棒球帽 ×约10', { width: 6900 }),
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
