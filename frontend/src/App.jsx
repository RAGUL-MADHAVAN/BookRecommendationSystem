import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import Quiz from './pages/Quiz'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import Navbar from './components/Navbar'
import ChatbotWidget from './components/ChatbotWidget'
import ProtectedRoute from './components/ProtectedRoute'
import Browse from './pages/Browse'
import BookDetails from './pages/BookDetails'
import AuthorDetail from './pages/AuthorDetail'

export default function App() {
  const location = useLocation()
  const { theme } = useTheme()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100' 
        : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 text-slate-900'
    }`}>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
        <Route path="/book/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
        <Route path="/author/:id" element={<ProtectedRoute><AuthorDetail /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<div style={{padding:24}}>404 Not Found. <Link to="/login">Go to Login</Link></div>} />
      </Routes>
      {!isAuthPage && <ChatbotWidget />}
    </div>
  )
}
