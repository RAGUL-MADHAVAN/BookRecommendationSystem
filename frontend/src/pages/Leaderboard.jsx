import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../lib/api'

// Rank icons/badges
const getRankIcon = (rank) => {
  if (rank === 1) return '🏆'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}

const getRankBadgeColor = (rank) => {
  if (rank === 1) return 'text-yellow-400'
  if (rank === 2) return 'text-slate-300'
  if (rank === 3) return 'text-orange-400'
  return 'text-slate-500'
}

const getTopCardGradient = (rank) => {
  if (rank === 1) return 'from-yellow-400 via-yellow-500 to-amber-600'
  if (rank === 2) return 'from-slate-300 via-slate-400 to-slate-500'
  if (rank === 3) return 'from-orange-400 via-orange-500 to-orange-600'
  return 'from-slate-600 to-slate-700'
}

const getTopCardIcon = (rank) => {
  if (rank === 1) return '🏆'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return '👤'
}

export default function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/leaderboard')
      setUsers(res.data.users || [])
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const topThree = users.slice(0, 3)
  const rest = users.slice(3)

  // Create avatar placeholder with initials
  const getAvatar = (user, size = 'md') => {
    const sizeClasses = {
      sm: 'w-10 h-10 text-sm',
      md: 'w-16 h-16 text-2xl',
      lg: 'w-24 h-24 text-4xl'
    }
    
    if (user.profileImage) {
      return (
        <img 
          src={user.profileImage} 
          alt={user.name}
          className={`${sizeClasses[size]} rounded-full object-cover border-4 border-white/20`}
        />
      )
    }
    
    const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white border-4 border-white/20`}>
        {initials}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-8 md:p-12">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white flex items-center gap-3">
            <span className="text-5xl">🏆</span>
            Leaderboard
          </h1>
          <p className="text-yellow-100 mt-2 text-lg">Compete with other readers and climb to the top!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {loading ? (
          <div className="text-center text-white py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-400">Loading leaderboard...</p>
          </div>
        ) : (
          <>
            {/* Top 3 Readers */}
            {topThree.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>⭐</span>
                    Top Readers
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topThree.map((user, idx) => {
                      const rank = idx + 1
                      return (
                        <motion.div
                          key={user._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1, duration: 0.3 }}
                          className={`relative bg-gradient-to-br ${getTopCardGradient(rank)} rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300`}
                        >
                          {/* Rank Icon Top Corner */}
                          <div className="absolute top-4 right-4 text-4xl opacity-30">
                            {getTopCardIcon(rank)}
                          </div>

                          {/* User Info */}
                          <div className="flex flex-col items-center relative z-10">
                            {/* Avatar */}
                            <div className="mb-4">
                              {getAvatar(user, 'lg')}
                            </div>

                            {/* Name */}
                            <h3 className="text-xl font-bold text-white mb-1 text-center">
                              {user.name}
                            </h3>

                            {/* Level Badge */}
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full mb-4">
                              <span className="text-white font-semibold text-sm">
                                Level {user.rewards?.level || 1}
                              </span>
                            </div>

                            {/* Points */}
                            <div className="text-center mb-3">
                              <div className="text-sm text-white/80 mb-1">Points</div>
                              <div className="text-4xl font-bold text-white">
                                {user.rewards?.points || 0}
                              </div>
                            </div>

                            {/* Books Count */}
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                              <div className="flex items-center gap-2 text-white">
                                <span>📚</span>
                                <span className="font-semibold">
                                  {(user.completed?.length || 0) + (user.reading?.length || 0)} books
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* All Rankings Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700/50">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>📊</span>
                  All Rankings
                </h2>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-700/30 text-slate-400 text-sm font-semibold border-b border-slate-700/50">
                <div className="col-span-1">RANK</div>
                <div className="col-span-5">READER</div>
                <div className="col-span-2">LEVEL</div>
                <div className="col-span-2">POINTS</div>
                <div className="col-span-2">BOOKS</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-700/50">
                {users.map((user, idx) => {
                  const rank = idx + 1
                  const booksCount = (user.completed?.length || 0) + (user.reading?.length || 0)
                  
                  return (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-700/30 transition-colors"
                    >
                      {/* Rank */}
                      <div className="col-span-1 flex items-center">
                        <span className={`text-2xl font-bold ${getRankBadgeColor(rank)}`}>
                          {getRankIcon(rank)}
                        </span>
                      </div>

                      {/* Reader */}
                      <div className="col-span-5 flex items-center gap-3">
                        {getAvatar(user, 'sm')}
                        <span className="text-white font-semibold">{user.name}</span>
                      </div>

                      {/* Level */}
                      <div className="col-span-2 flex items-center">
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Level {user.rewards?.level || 1}
                        </span>
                      </div>

                      {/* Points */}
                      <div className="col-span-2 flex items-center">
                        <span className="text-white font-bold text-lg">{user.rewards?.points || 0}</span>
                      </div>

                      {/* Books */}
                      <div className="col-span-2 flex items-center gap-1">
                        <span className="text-slate-400">📚</span>
                        <span className="text-slate-300 font-semibold">{booksCount}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {users.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  No users on the leaderboard yet. Start reading to be the first!
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
