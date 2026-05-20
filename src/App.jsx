import { Routes, Route, Navigate } from 'react-router-dom'
import { GameProvider } from './context/GameContext.jsx'
import Home from './pages/Home.jsx'
import Quiz from './pages/Quiz.jsx'
import Personality from './pages/Personality.jsx'
import Formation from './pages/Formation.jsx'
import Select from './pages/Select.jsx'
import Result from './pages/Result.jsx'
import Poster from './pages/Poster.jsx'
import Rankings from './pages/Rankings.jsx'
import Rules from './pages/Rules.jsx'

export default function App() {
  return (
    <GameProvider>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/personality" element={<Personality />} />
          <Route path="/formation" element={<Formation />} />
          <Route path="/select" element={<Select />} />
          <Route path="/result" element={<Result />} />
          <Route path="/poster" element={<Poster />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </GameProvider>
  )
}
