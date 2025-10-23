import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const { theme, toggle } = useTheme()

  const isActive = (path) => pathname === path

  const NavLink = ({ to, children, icon }) => {
    const active = isActive(to)
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
          theme === 'dark'
            ? active
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
            : active
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        {icon && <span className="text-lg">{icon}</span>}
        <span>{children}</span>
      </Link>
    )
  }

  const onLogout = () => {
    logout()
    nav('/')
  }

  const getAvatar = () => {
    if (user?.profileImage) {
      return (
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/50"
        />
      )
    }
    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white border-2 border-purple-500/50">
        {initials}
      </div>
    )
  }

  return (
    <nav className={`backdrop-blur-sm border-b sticky top-0 z-50 shadow-lg transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-slate-900/95 border-slate-700/50'
        : 'bg-white/95 border-slate-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <span className="text-2xl">📚</span>
            </div>
            <span className={`text-xl font-bold hidden sm:block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>SmartBookHub</span>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-2">
            <NavLink to="/" icon="🏠">Browse</NavLink>
            <NavLink to="/leaderboard" icon="🏆">Leaderboard</NavLink>
            {user && <NavLink to="/profile" icon="👤">Profile</NavLink>}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700/50"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                {/* User Info - Clickable to Profile */}
                <Link
                  to="/profile"
                  className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 hover:bg-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer"
                  title="Go to Profile"
                >
                  {getAvatar()}
                  <span className="text-sm text-white font-medium">{user.name.split(' ')[0]}</span>
                </Link>

                {/* Points & Level Badge */}
                <div className="hidden lg:flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-3 py-1.5 rounded-lg border border-purple-500/30">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white font-bold text-sm">{user.rewards?.points || 0}</span>
                  </div>
                  <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 px-3 py-1.5 rounded-lg border border-cyan-500/30">
                    <span className="text-cyan-300 font-bold text-sm">Lvl {user.rewards?.level || 1}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
