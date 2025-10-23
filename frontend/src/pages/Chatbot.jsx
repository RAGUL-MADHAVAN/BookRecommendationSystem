import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'
import { Link } from 'react-router-dom'

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: "👋 Hi! I'm your book assistant. Tell me what you're looking for - a theme, genre, author, or book title!" 
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { id: Date.now(), type: 'user', text: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await api.get(`/search?q=${encodeURIComponent(input.trim())}`)
      const { books } = res.data

      if (books && books.length > 0) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: `I found ${books.length} book${books.length > 1 ? 's' : ''} for you:`,
          books
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'bot',
          text: "😕 Sorry, I couldn't find any books matching your query. Try searching for a different theme, author, or title!"
        }])
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: "⚠️ Oops! Something went wrong. Please try again."
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">🤖</span>
            Book Assistant
          </h1>
          <p className="text-blue-100 mt-2">Ask me about any book, author, or genre!</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          
          {/* Messages Area */}
          <div className="h-[calc(100vh-340px)] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-700">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                    {/* Message Bubble */}
                    <div className={`rounded-2xl px-5 py-3 ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-slate-700/50 text-slate-100 border border-slate-600/50'
                    }`}>
                      <p className="text-sm md:text-base">{msg.text}</p>
                    </div>

                    {/* Book Cards */}
                    {msg.books && msg.books.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {msg.books.map((book) => (
                          <motion.div
                            key={book._id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Link to={`/book/${book._id}`}>
                              <div className="group bg-slate-800/80 rounded-xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1">
                                {/* Book Cover */}
                                <div className="relative h-48 overflow-hidden bg-slate-700">
                                  <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  {/* Badges */}
                                  <div className="absolute top-2 left-2 flex gap-2">
                                    {book.isTrending && (
                                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                                        🔥 Trending
                                      </span>
                                    )}
                                    {book.rating >= 4.5 && (
                                      <span className="bg-yellow-500 text-slate-900 text-xs px-2 py-1 rounded-full font-semibold">
                                        ⭐ Featured
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Book Info */}
                                <div className="p-4">
                                  <h3 className="font-bold text-white text-sm mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
                                    {book.title}
                                  </h3>
                                  <p className="text-slate-400 text-xs mb-2">
                                    by {book.author?.name || 'Unknown'}
                                  </p>
                                  
                                  {/* Genre Tags */}
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {book.genre && (
                                      <span className="bg-purple-600/30 text-purple-300 text-xs px-2 py-1 rounded-md border border-purple-500/30">
                                        {book.genre}
                                      </span>
                                    )}
                                  </div>

                                  {/* Stats */}
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                      <span>⭐</span>
                                      <span className="font-semibold">{book.rating || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <span>👁️</span>
                                      <span>{book.reads || 0}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-slate-700/50 rounded-2xl px-5 py-3 border border-slate-600/50">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700/50 bg-slate-800/80 backdrop-blur-sm p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a book name, author, or theme..."
                disabled={loading}
                className="flex-1 bg-slate-700/50 text-white px-5 py-3 rounded-xl border border-slate-600/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-slate-400 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/50 disabled:hover:shadow-none"
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
