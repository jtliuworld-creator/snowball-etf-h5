import { createContext, useContext, useReducer } from 'react'
import { getRandomTeamName } from '../data/etfs.js'

const GameContext = createContext(null)

const emptyLineup = () => ({ forward: [], midfielder: [], defender: [], goalkeeper: [] })

const initialState = {
  quizAnswers: [],
  personality: null,
  personalityData: null,
  formation: '4-3-3',
  selectedEtfs: emptyLineup(),
  teamName: getRandomTeamName(),
  scores: null,
  comment: '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_QUIZ_ANSWERS':
      return { ...state, quizAnswers: action.payload }
    case 'SET_PERSONALITY':
      return { ...state, personality: action.payload.key, personalityData: action.payload }
    case 'SET_FORMATION':
      // 切阵型时清空已选（位置数量变了，原选择不再有效）
      return { ...state, formation: action.payload, selectedEtfs: emptyLineup(), scores: null, comment: '' }
    case 'TOGGLE_ETF': {
      // 已选则移除；未选则在该位置追加，上限 = max
      const { etf, max } = action
      const list = state.selectedEtfs[etf.position] || []
      const idx = list.findIndex(e => e.id === etf.id)
      let nextList
      if (idx >= 0) {
        nextList = [...list.slice(0, idx), ...list.slice(idx + 1)]
      } else {
        if (list.length >= max) return state // 该位置已满
        nextList = [...list, etf]
      }
      return {
        ...state,
        selectedEtfs: { ...state.selectedEtfs, [etf.position]: nextList },
      }
    }
    case 'CLEAR_POSITION':
      return {
        ...state,
        selectedEtfs: { ...state.selectedEtfs, [action.position]: [] },
      }
    case 'SET_TEAM_NAME':
      return { ...state, teamName: action.payload }
    case 'SET_SCORES':
      return { ...state, scores: action.scores, comment: action.comment }
    case 'RESET':
      return { ...initialState, selectedEtfs: emptyLineup(), teamName: getRandomTeamName() }
    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
