import { createContext, useContext, useReducer } from 'react'
import { getRandomTeamName } from '../data/etfs.js'

const GameContext = createContext(null)

const initialState = {
  quizAnswers: [],
  personality: null,
  personalityData: null,
  formation: '4-3-3',
  selectedEtfs: { forward: null, midfielder: null, defender: null, goalkeeper: null },
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
      return { ...state, formation: action.payload }
    case 'SET_ETF':
      return {
        ...state,
        selectedEtfs: { ...state.selectedEtfs, [action.position]: action.etf },
      }
    case 'SET_TEAM_NAME':
      return { ...state, teamName: action.payload }
    case 'SET_SCORES':
      return { ...state, scores: action.scores, comment: action.comment }
    case 'RESET':
      return { ...initialState, teamName: getRandomTeamName() }
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
