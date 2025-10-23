import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../lib/api'

export default function AuthorDetail() {
  const { id } = useParams()
  const [author, setAuthor] = useState(null)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAuthor()
  }, [id])

  const loadAuthor = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/authors/${id}`)
      setAuthor(res.data.author)
      setBooks(res.data.books || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">✍️</span>
          <p className="text-slate-400 text-xl">Author not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900 via-slate-900 to-slate-950 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtOS45NC04LjA2LTE4LTE4LTE4UzAgOC4wNiAwIDE4czguMDYgMTggMTggMTggMTgtOC4wNiAxOC0xOHptMCAyNGMwLTkuOTQtOC4wNi0xOC0xOC0xOFMwIDMyLjA2IDAgNDJzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4em0yNC0yNGMwLTkuOTQtOC4wNi0xOC0xOC0xOHMtMTggOC4wNi0xOCAxOCA4LjA2IDE4IDE4IDE4IDE4LTguMDYgMTgtMTh6bTAgMjRjMC05Ljk0LTguMDYtMTgtMTgtMThzLTE4IDguMDYtMTggMTggOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Avatar */}
            <div className="mb-6 inline-block">
              {author.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="w-40 h-40 rounded-full object-cover border-4 border-purple-500/50 shadow-2xl"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center border-4 border-purple-500/50 shadow-2xl">
                  <span className="text-6xl font-bold text-white">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {author.name}
            </h1>

            {/* Bio */}
            {author.bio && (
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {author.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center justify-center gap-12 mt-8">
              <div>
                <div className="text-4xl font-bold text-white">{books.length}</div>
                <div className="text-slate-400">Books</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">
                  {author.followers?.length || 0}
                </div>
                <div className="text-slate-400">Followers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">
                  {books.reduce((sum, b) => sum + (b.reads || 0), 0).toLocaleString()}
                </div>
                <div className="text-slate-400">Total Reads</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Books Section */}
      <div className="container mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">📚</span>
            Books by {author.name}
          </h2>
          <span className="text-slate-400">{books.length} books</span>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">📖</span>
            <p className="text-slate-400 text-xl">No books available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {books.map((book, idx) => (
              <Link key={book._id} to={`/book/${book._id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="group cursor-pointer"
                >
                  {/* Book Cover */}
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-400 text-sm">⭐ {book.rating || 0}</span>
                          <span className="text-slate-300 text-xs">{book.reads || 0} reads</span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                      {book.isTrending && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                          🔥 HOT
                        </span>
                      )}
                      {book.rating >= 4.5 && (
                        <span className="bg-yellow-500 text-slate-900 text-xs px-2 py-1 rounded-full font-bold">
                          ⭐ TOP
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold mt-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {book.title}
                  </h3>

                  {/* Genre */}
                  <p className="text-slate-400 text-sm mt-1">{book.genre}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {/* About Section */}
        {author.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>ℹ️</span>
              About the Author
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              {author.bio}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
