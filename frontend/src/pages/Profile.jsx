import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function Profile(){
  const { user: authUser, updateUser } = useAuth()
  const [me, setMe] = useState(null)
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ name: '', profileImage: '' })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [u, p] = await Promise.all([
          api.get('/auth/me').catch(()=>({ data:null })),
          api.get('/progress').catch(()=>({ data:{ progress: [] }}))
        ])
        if (!mounted) return
        setMe(u.data)
        setFormData({ name: u.data?.name || '', profileImage: u.data?.profileImage || '' })
        setProgress(p.data.progress || [])
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const rewards = me?.rewards || { points:0, level:1, badges:[] }
  const reading = progress.filter(p => !p.completedAt)
  const completed = progress.filter(p => p.completedAt)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB')
      return
    }
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profileImage: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      const res = await api.put('/auth/profile', formData)
      setMe(res.data)
      updateUser(res.data) // Update AuthContext so navbar avatar updates everywhere
      setEditMode(false)
      alert('Profile updated successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to update profile')
    } finally {
      setUploading(false)
    }
  }

  const getAvatar = (size = 'lg') => {
    const sizeClasses = {
      sm: 'w-12 h-12 text-lg',
      md: 'w-20 h-20 text-3xl',
      lg: 'w-32 h-32 text-5xl'
    }
    
    const imgSrc = editMode ? formData.profileImage : me?.profileImage
    
    if (imgSrc) {
      return (
        <img 
          src={imgSrc} 
          alt={me?.name || 'User'}
          className={`${sizeClasses[size]} rounded-full object-cover border-4 border-purple-500/50 shadow-xl`}
        />
      )
    }
    
    const initials = me?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white border-4 border-purple-500/50 shadow-xl`}>
        {initials}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 p-8 md:p-12">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white flex items-center gap-3">
            <span className="text-5xl">👤</span>
            My Profile
          </h1>
          <p className="text-blue-100 mt-2 text-lg">Manage your account and track your reading journey</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {loading ? (
          <div className="text-center text-white py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-400">Loading profile...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className="mb-4 relative">
                    {getAvatar()}
                    {editMode && (
                      <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                        <span className="text-xl">📷</span>
                      </label>
                    )}
                  </div>

                  {/* Edit Form or Display */}
                  {editMode ? (
                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-700/50 text-white px-4 py-2 rounded-lg border border-slate-600/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Profile Image URL (optional)</label>
                        <input
                          type="text"
                          value={formData.profileImage}
                          onChange={(e) => setFormData(prev => ({ ...prev, profileImage: e.target.value }))}
                          placeholder="https://..."
                          className="w-full bg-slate-700/50 text-white px-4 py-2 rounded-lg border border-slate-600/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={uploading}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                        >
                          {uploading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditMode(false)
                            setFormData({ name: me?.name || '', profileImage: me?.profileImage || '' })
                          }}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-1">{me?.name}</h2>
                      <p className="text-slate-400 mb-2">{me?.email}</p>
                      <span className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold border border-purple-500/30 mb-4">
                        {me?.role === 'admin' ? '👑 Admin' : '📚 Reader'}
                      </span>
                      <button
                        onClick={() => setEditMode(true)}
                        className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                      >
                        ✏️ Edit Profile
                      </button>
                    </>
                  )}
                </div>

                {/* Rewards Section */}
                {!editMode && (
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span>🏆</span>
                      Rewards
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-purple-400">{rewards.points}</div>
                        <div className="text-slate-400 text-sm mt-1">Points</div>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-blue-400">{rewards.level}</div>
                        <div className="text-slate-400 text-sm mt-1">Level</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reading Progress Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Currently Reading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📖</span>
                  Currently Reading
                </h3>
                {reading.length === 0 ? (
                  <p className="text-slate-400">No books in progress</p>
                ) : (
                  <div className="space-y-3">
                    {reading.map(p => (
                      <div key={p._id} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold">{p.book?.title || 'Unknown Book'}</span>
                          <span className="text-purple-400 font-bold">{p.percentage}%</span>
                        </div>
                        <div className="mt-2 bg-slate-600/50 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${p.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Completed Books */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>✅</span>
                  Completed Books
                  <span className="ml-auto bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-sm font-semibold border border-green-500/30">
                    {completed.length}
                  </span>
                </h3>
                {completed.length === 0 ? (
                  <p className="text-slate-400">No completed books yet. Start reading to earn rewards!</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {completed.map(p => (
                      <div key={p._id} className="bg-slate-700/30 rounded-lg p-3 hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          <span className="text-white text-sm">{p.book?.title || 'Unknown Book'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
