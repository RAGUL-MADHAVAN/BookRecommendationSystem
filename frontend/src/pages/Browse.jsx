import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Browse() {
  const { user } = useAuth()
  const [allBooks, setAllBooks] = useState([])
  const [trending, setTrending] = useState([])
  const [featured, setFeatured] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const genres = ['All', 'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller', 'Horror', 'Young Adult', 'Dystopian', 'Classic']

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      const res = await api.get('/books')
      const books = res.data.books || []
      setAllBooks(books)
      setTrending(books.filter(b => b.isTrending).slice(0, 6))
      setFeatured(books.find(b => b.rating >= 4.5) || books[0])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = allBooks.filter(book => {
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author?.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGenre && matchesSearch
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section with Featured Book */}
      {featured && (
        <div className="relative h-[600px] overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img 
              src={featured.coverUrl} 
              alt={featured.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              {/* Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">🔥 FEATURED</span>
                {featured.isTrending && <span className="bg-yellow-500 text-slate-900 px-4 py-1.5 rounded-full text-sm font-bold">⭐ TRENDING</span>}
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                {featured.title}
              </h1>

              {/* Author */}
              <p className="text-xl text-slate-300 mb-6">
                by {featured.author?.name || 'Unknown Author'}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-2xl">⭐</span>
                  <span className="text-white text-xl font-bold">{featured.rating || 0}</span>
                </div>
                <div className="text-slate-300 text-lg">📚 {featured.genre}</div>
                <div className="text-slate-300 text-lg">👁️ {featured.reads || 0} reads</div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-lg mb-8 line-clamp-3">
                {featured.description || 'Discover this amazing book and dive into a world of adventure.'}
              </p>

              {/* Actions */}
              <div className="flex gap-4">
                <Link to={`/book/${featured._id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl shadow-purple-500/50"
                  >
                    📖 Read Now
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/20"
                >
                  ℹ️ More Info
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-y border-slate-800/50 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or author..."
                className="w-full bg-slate-800/50 text-white placeholder-slate-400 px-6 py-4 pl-14 rounded-xl border border-slate-700/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-lg"
              />
            </div>
          </div>

          {/* Genre Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-800">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Trending Section */}
        {trending.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">🔥</span>
                Trending Now
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {trending.map((book, idx) => (
                <BookCardComponent key={book._id} book={book} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* All Books */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              {selectedGenre === 'All' ? 'All Books' : `${selectedGenre} Books`}
            </h2>
            <span className="text-slate-400">{filteredBooks.length} books</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl mb-4 block">📚</span>
              <p className="text-slate-400 text-xl">No books found. Try a different search or genre.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {filteredBooks.map((book, idx) => (
                <BookCardComponent key={book._id} book={book} index={idx} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// Beautiful Book Card Component
function BookCardComponent({ book, index }) {
  return (
    <Link to={`/book/${book._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        whileHover={{ y: -8, scale: 1.03 }}
        className="group relative cursor-pointer"
      >
        {/* Book Cover */}
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-sm font-semibold mb-1">{book.author?.name}</p>
              <div className="flex items-center gap-2">
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
  )
}
