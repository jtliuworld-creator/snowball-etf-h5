import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext.jsx'
import { QUIZ_QUESTIONS, PERSONALITIES, calcPersonality } from '../data/quiz.js'
import { analytics } from '../utils/analytics.js'

export default function Quiz() {
  const navigate = useNavigate()
  const { dispatch } = useGame()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [chosen, setChosen] = useState(null)

  useEffect(() => { analytics.pageView('quiz') }, [])

  const q = QUIZ_QUESTIONS[current]
  const total = QUIZ_QUESTIONS.length

  function handleAnswer(type) {
    if (chosen) return
    setChosen(type)
    setTimeout(() => {
      const newAnswers = [...answers, type]
      setAnswers(newAnswers)
      setChosen(null)
      if (current < total - 1) {
        setCurrent(current + 1)
      } else {
        const personalityKey = calcPersonality(newAnswers)
        const personalityData = PERSONALITIES[personalityKey]
        dispatch({ type: 'SET_QUIZ_ANSWERS', payload: newAnswers })
        dispatch({ type: 'SET_PERSONALITY', payload: personalityData })
        dispatch({ type: 'SET_FORMATION', payload: personalityData.recommendedFormation })
        analytics.quizComplete(personalityKey)
        navigate('/personality')
      }
    }, 400)
  }

  return (
    <div className="page quiz-page">
      <div className="quiz-header">
        <button className="btn-back" onClick={() => navigate('/')}>← 返回</button>
        <div className="quiz-progress-wrap">
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${((current) / total) * 100}%` }} />
          </div>
          <span className="quiz-progress-text">{current + 1} / {total}</span>
        </div>
      </div>

      <div className="quiz-body">
        <div className="quiz-number">第 {current + 1} 题</div>
        <h2 className="quiz-question">{q.question}</h2>

        <div className="quiz-options">
          {q.options.map(opt => (
            <button
              key={opt.key}
              className={`quiz-option ${chosen === opt.type ? 'selected' : ''}`}
              onClick={() => handleAnswer(opt.type)}
            >
              <span className="quiz-option-key">{opt.key}</span>
              <span className="quiz-option-text">{opt.text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="risk-tip">
        本活动为雪球社区趣味互动内容，不构成任何投资建议。基金有风险，投资需谨慎。
      </div>
    </div>
  )
}
