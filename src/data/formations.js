export const FORMATIONS = {
  '3-4-3': {
    name: '3-4-3',
    label: '进攻压迫型',
    description: '火力全开，三前锋压迫，适合激进进攻风格',
    bonus: { offense: 10, defense: -5, control: 3 },
    positions: {
      forward: [[50, 12], [22, 20], [78, 20]],
      midfielder: [[20, 36], [40, 30], [60, 30], [80, 36]],
      defender: [[25, 52], [50, 48], [75, 52]],
      goalkeeper: [[50, 80]],
    },
  },
  '4-3-3': {
    name: '4-3-3',
    label: '均衡进攻型',
    description: '四后卫稳固后防，三中场控节奏，三前锋保进攻',
    bonus: { offense: 6, defense: 3, control: 5 },
    positions: {
      forward: [[50, 12], [22, 20], [78, 20]],
      midfielder: [[25, 36], [50, 30], [75, 36]],
      defender: [[15, 52], [38, 48], [62, 48], [85, 52]],
      goalkeeper: [[50, 80]],
    },
  },
  '4-4-2': {
    name: '4-4-2',
    label: '经典平衡型',
    description: '经典阵型，攻守平衡，双前锋配四中场',
    bonus: { offense: 3, defense: 5, control: 6 },
    positions: {
      forward: [[32, 14], [68, 14]],
      midfielder: [[15, 34], [38, 28], [62, 28], [85, 34]],
      defender: [[15, 52], [38, 48], [62, 48], [85, 52]],
      goalkeeper: [[50, 80]],
    },
  },
  '5-3-2': {
    name: '5-3-2',
    label: '稳守反击型',
    description: '五后卫超强防守，守住底线再伺机反击',
    bonus: { offense: -3, defense: 10, control: 3 },
    positions: {
      forward: [[32, 12], [68, 12]],
      midfielder: [[25, 32], [50, 26], [75, 32]],
      defender: [[10, 52], [28, 48], [50, 44], [72, 48], [90, 52]],
      goalkeeper: [[50, 80]],
    },
  },
  '4-5-1': {
    name: '4-5-1',
    label: '中场控球型',
    description: '五中场完全掌控节奏，一前锋等待致命一击',
    bonus: { offense: -5, defense: 3, control: 10 },
    positions: {
      forward: [[50, 10]],
      midfielder: [[12, 30], [30, 24], [50, 22], [70, 24], [88, 30]],
      defender: [[15, 52], [38, 48], [62, 48], [85, 52]],
      goalkeeper: [[50, 80]],
    },
  },
}

export const FORMATION_LIST = Object.values(FORMATIONS)

// 每个阵型对应位置需要选几只 ETF（11 人制：守门员永远 1 个）
export function getPositionCounts(formationName) {
  const f = FORMATIONS[formationName] || FORMATIONS['4-3-3']
  return {
    goalkeeper: f.positions.goalkeeper.length,
    defender: f.positions.defender.length,
    midfielder: f.positions.midfielder.length,
    forward: f.positions.forward.length,
  }
}

export const TOTAL_PLAYERS = 11
