import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PuzzlesPage from './pages/PuzzlesPage'
import HowToPlayPage from './pages/HowToPlayPage'
import NotFoundPage from './pages/NotFoundPage'
import PuzzlePage from './pages/PuzzlePage'
import ResultPage from './pages/ResultPage'

function App() {
  return (
    <div className="page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main className="main-layout" id="main-content">
        <Routes>
          <Route path="/" element={<PuzzlesPage />} />
          <Route path="/how-to-play" element={<HowToPlayPage />} />
          <Route path="/puzzles/:puzzleId" element={<PuzzlePage />} />
          <Route path="/puzzles/:puzzleId/result" element={<ResultPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
