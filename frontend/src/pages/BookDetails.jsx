import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function BookDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [similarBooks, setSimilarBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [progressPct, setProgressPct] = useState(0)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [reviewMsg, setReviewMsg] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    load()
  }, [id])

  const load = async () => {
    setLoading(true)
    try {
      const [b, r] = await Promise.all([
        api.get(`/books/${id}`),
        api.get(`/reviews/book/${id}`)
      ])
      setBook(b.data.book)
      setReviews(r.data.reviews || [])
      
      // Load similar books (same genre)
      if (b.data.book?.genre) {
        const similar = await api.get(`/books?genre=${b.data.book.genre}`)
        setSimilarBooks((similar.data.books || []).filter(sb => sb._id !== id).slice(0, 6))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = async () => {
    const res = await api.get(`/quizzes/book/${id}`).catch(() => null)
    setQuiz(res?.data?.quiz || { questions: [] })
    setAnswers([])
    setResult(null)
  }

  const submitQuiz = async () => {
    const res = await api.post('/quizzes/submit', { bookId: id, answers })
    setResult(res.data)
    try { await api.post('/progress', { bookId: id, percentage: 100 }) } catch {}
  }

  const onAnswer = (qi, oi) => {
    const arr = [...answers]
    arr[qi] = oi
    setAnswers(arr)
  }

  const updateProgress = async (percentage) => {
    try {
      await api.post('/progress', { bookId: id, percentage })
      alert(`Progress updated to ${percentage}%!`)
    } catch (err) {
      alert('Failed to update progress')
    }
  }

  const submitReview = async () => {
    setReviewMsg('')
    try {
      await api.post('/reviews', { bookId: id, rating: review.rating, comment: review.comment })
      setReviewMsg('✅ Review submitted successfully!')
      setReview({ rating: 5, comment: '' })
      load()
    } catch (err) {
      setReviewMsg(err?.response?.data?.message || '❌ Failed to submit review')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">📚</span>
          <p className="text-slate-400 text-xl">Book not found</p>
        </div>
      </div>
    )
  }

  const canSubmitQuiz = quiz && quiz.questions?.length > 0 && answers.length === quiz.questions.length

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        {/* Background with blur */}
        <div className="absolute inset-0">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover scale-110 blur-2xl opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950"></div>
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="flex gap-8 w-full">
            {/* Book Cover */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0"
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-64 h-96 object-cover rounded-2xl shadow-2xl border-4 border-white/10"
              />
            </motion.div>

            {/* Book Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex-1"
            >
              {/* Badges */}
              <div className="flex items-center gap-3 mb-4">
                {book.isTrending && (
                  <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                    🔥 TRENDING
                  </span>
                )}
                {book.rating >= 4.5 && (
                  <span className="bg-yellow-500 text-slate-900 px-4 py-1.5 rounded-full text-sm font-bold">
                    ⭐ TOP RATED
                  </span>
                )}
                <span className="bg-purple-600/30 text-purple-300 px-4 py-1.5 rounded-full text-sm font-bold border border-purple-500/30">
                  {book.genre}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                {book.title}
              </h1>

              {/* Author */}
              <p className="text-xl text-slate-300 mb-6">
                by {book.author?._id ? (
                  <Link to={`/author/${book.author._id}`} className="text-purple-400 font-semibold hover:underline">
                    {book.author.name}
                  </Link>
                ) : (
                  <span className="text-slate-400">Unknown Author</span>
                )}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-3xl">⭐</span>
                  <div>
                    <div className="text-white text-2xl font-bold">{Number(book.rating || 0).toFixed(1)}</div>
                    <div className="text-slate-400 text-xs">Rating</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 text-3xl">👁️</span>
                  <div>
                    <div className="text-white text-2xl font-bold">{book.reads || 0}</div>
                    <div className="text-slate-400 text-xs">Reads</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 text-3xl">💬</span>
                  <div>
                    <div className="text-white text-2xl font-bold">{reviews.length}</div>
                    <div className="text-slate-400 text-xs">Reviews</div>
                  </div>
                </div>
              </div>

              {/* Progress Tracking */}
              {user && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="dark:text-slate-300 text-slate-700 font-semibold">Reading Progress:</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{progressPct}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full dark:bg-slate-700/50 bg-slate-200 rounded-full h-3 overflow-hidden border dark:border-slate-600/50 border-slate-300">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      className="h-full bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-full"
                    />
                  </div>

                  {/* Progress Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateProgress(0)}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg text-sm"
                    >
                      🔄 Reset
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateProgress(25)}
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg text-sm"
                    >
                      📖 25% Started
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateProgress(50)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg text-sm"
                    >
                      📚 50% Halfway
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateProgress(75)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg text-sm"
                    >
                      📕 75% Almost Done
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateProgress(100)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg text-sm"
                    >
                      ✅ 100% Complete
                    </motion.button>
                    {book.contentUrl && (
                      <motion.a
                        href={book.contentUrl}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold border border-white/20 text-sm"
                      >
                        🔗 Read Book
                      </motion.a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dark:bg-slate-900/50 bg-white/70 backdrop-blur-sm border-b dark:border-slate-800/50 border-slate-200 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            {['overview', 'reviews', 'quiz'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold capitalize transition-all relative text-lg ${
                  activeTab === tab
                    ? 'dark:text-white text-slate-900'
                    : 'dark:text-slate-300 text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-12">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8"
              >
                <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-4 flex items-center gap-2">
                  <span>📖</span>
                  Description
                </h2>
                <p className="dark:text-slate-300 text-slate-700 leading-relaxed text-lg">
                  {book.description || 'No description available for this book.'}
                </p>
              </motion.div>

              {/* Similar Books */}
              {similarBooks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="dark:bg-slate-800/50 bg-white backdrop-blur-sm rounded-2xl border dark:border-slate-700/50 border-slate-200 p-8"
                >
                  <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-6 flex items-center gap-2">
                    <span>📚</span>
                    Similar Books
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {similarBooks.map(sb => (
                      <Link key={sb._id} to={`/book/${sb._id}`}>
                        <motion.div
                          whileHover={{ y: -4 }}
                          className="group cursor-pointer"
                        >
                          <img
                            src={sb.coverUrl}
                            alt={sb.title}
                            className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg group-hover:shadow-purple-500/30 transition-shadow"
                          />
                          <h3 className="text-white font-semibold mt-2 text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
                            {sb.title}
                          </h3>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Tracker */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Reading Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Progress %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={progressPct}
                        onChange={(e) => setProgressPct(Number(e.target.value))}
                        className="w-full bg-slate-700/50 text-white px-4 py-2 rounded-lg border border-slate-600/50 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => updateProgress(Math.max(0, Math.min(100, progressPct)))}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-3 rounded-lg font-semibold transition-all"
                    >
                      Update Progress
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Book Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Book Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Author</span>
                    <span className="text-white font-semibold">{book.author?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Genre</span>
                    <span className="text-white font-semibold">{book.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rating</span>
                    <span className="text-white font-semibold">⭐ {Number(book.rating || 0).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reads</span>
                    <span className="text-white font-semibold">{book.reads || 0}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-4xl">
            {/* Write Review */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">✍️ Write a Review</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => setReview(s => ({ ...s, rating: n }))}
                          className={`text-3xl ${review.rating >= n ? 'text-yellow-400' : 'text-slate-600'} hover:scale-110 transition-transform`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-2 block">Your Thoughts</label>
                    <textarea
                      value={review.comment}
                      onChange={(e) => setReview(s => ({ ...s, comment: e.target.value }))}
                      placeholder="Share your thoughts about this book..."
                      className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-slate-600/50 focus:border-purple-500 focus:outline-none min-h-[120px] resize-none"
                    />
                  </div>
                  <button
                    onClick={submitReview}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                  >
                    Submit Review
                  </button>
                  {reviewMsg && (
                    <p className="text-sm text-slate-300">{reviewMsg}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Reviews List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">💬 User Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                            {r.user?.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="text-white font-semibold">{r.user?.name || 'Anonymous'}</div>
                            <div className="text-yellow-400 text-sm">{'⭐'.repeat(r.rating)}</div>
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-300">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">🎯 Book Quiz</h2>
                {!quiz && (
                  <button
                    onClick={startQuiz}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Start Quiz
                  </button>
                )}
              </div>

              {quiz ? (
                quiz.questions?.length > 0 ? (
                  <div className="space-y-6">
                    {quiz.questions.map((q, qi) => (
                      <div key={qi} className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
                        <h3 className="text-white font-semibold text-lg mb-4">{qi + 1}. {q.q}</h3>
                        <div className="space-y-3">
                          {q.options.map((opt, oi) => (
                            <label
                              key={oi}
                              className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                                answers[qi] === oi
                                  ? 'bg-purple-600/30 border-2 border-purple-500'
                                  : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q${qi}`}
                                checked={answers[qi] === oi}
                                onChange={() => onAnswer(qi, oi)}
                                className="w-5 h-5"
                              />
                              <span className="text-white">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      disabled={!canSubmitQuiz}
                      onClick={submitQuiz}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-700 text-white px-8 py-4 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
                    >
                      {result ? '✅ Submitted' : 'Submit Quiz'}
                    </button>

                    {result && (
                      <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6 text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-3xl font-bold text-white mb-3">Quiz Complete!</h3>
                        <p className="text-green-300 text-2xl mb-4">Score: {result.score} / {result.total}</p>
                        {result.bonusPoints !== undefined && (
                          <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                            <p className="text-yellow-300 font-bold text-lg">🏆 +{result.bonusPoints} Bonus Points!</p>
                            <p className="text-yellow-200 text-sm mt-1">{result.message}</p>
                          </div>
                        )}
                        <p className="text-slate-400 text-sm mt-4">Check the leaderboard to see your new rank!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">No quiz available for this book.</p>
                )
              ) : (
                <p className="text-slate-400 text-center py-8">Click "Start Quiz" to begin!</p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
