import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: "👋 Hi! I'm your AI book assistant. What kind of book are you looking for today?" 
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { id: Date.now(), type: 'user', text: input.trim() }
    setMessages(prev => [...prev, userMessage])
    const query = input.trim().toLowerCase()
    setInput('')
    setLoading(true)

    try {
      // Check for greetings or non-search queries
      const greetings = ['hi', 'hello', 'hey', 'howdy', 'greetings', 'good morning', 'good afternoon', 'good evening']
      const helpQueries = ['help', 'what can you do', 'how to use', 'commands']
      
      if (greetings.some(g => query === g || query.startsWith(g + ' '))) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'bot',
          text: "👋 Hello! I'm your AI book assistant! I can help you find books by:\n\n• Book titles (e.g., 'Harry Potter')\n• Author names (e.g., 'Stephen King')\n• Genres (e.g., 'Fantasy', 'Mystery')\n\nWhat are you looking for today?"
        }])
        setLoading(false)
        return
      }
      
      if (helpQueries.some(h => query.includes(h))) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'bot',
          text: "💡 I can help you discover books! Just type:\n\n📚 Book titles: 'Harry Potter', 'The Hobbit'\n✍️ Authors: 'J.K. Rowling', 'Stephen King'\n🎭 Genres: 'Fantasy', 'Horror', 'Romance'\n\nTry searching now!"
        }])
        setLoading(false)
        return
      }

      // Search for books
      const res = await api.get(`/search?q=${encodeURIComponent(query)}`)
      const { books } = res.data

      if (books && books.length > 0) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: `I found ${books.length} amazing book${books.length > 1 ? 's' : ''} for you! 📚`,
          books
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'bot',
          text: "😕 Hmm, I couldn't find any books matching that. Try searching for:\n\n• Popular titles (e.g., '1984', 'Harry Potter')\n• Authors (e.g., 'George Orwell')\n• Genres (e.g., 'Fantasy', 'Mystery')"
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
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-full shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center group transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="text-white text-3xl"
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="text-3xl"
            >
              🤖
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Pulse effect */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></span>
        )}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-28 right-6 z-40 w-[420px] h-[600px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">AI Book Assistant</h3>
                  <p className="text-white/80 text-xs">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-xs">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-800">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                      {/* Message Bubble */}
                      <div className={`rounded-2xl px-4 py-2 ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-slate-800 text-slate-100'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>

                      {/* Book Cards */}
                      {msg.books && msg.books.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {msg.books.slice(0, 3).map((book) => (
                            <Link
                              key={book._id}
                              to={`/book/${book._id}`}
                              onClick={() => setIsOpen(false)}
                            >
                              <motion.div
                                whileHover={{ scale: 1.02, x: 5 }}
                                className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer group"
                              >
                                <div className="flex gap-3">
                                  <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    className="w-16 h-20 object-cover rounded-lg shadow-lg group-hover:shadow-purple-500/30 transition-shadow"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-purple-400 transition-colors">
                                      {book.title}
                                    </h4>
                                    <p className="text-slate-400 text-xs mt-0.5">
                                      {book.author?.name || 'Unknown'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="bg-purple-600/30 text-purple-300 text-xs px-2 py-0.5 rounded border border-purple-500/30">
                                        {book.genre}
                                      </span>
                                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                                        <span>⭐</span>
                                        <span>{book.rating || 0}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </Link>
                          ))}
                          {msg.books.length > 3 && (
                            <p className="text-slate-400 text-xs text-center mt-2">
                              +{msg.books.length - 3} more books found
                            </p>
                          )}
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
                  <div className="bg-slate-800 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-700/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search books, authors, genres..."
                  disabled={loading}
                  className="flex-1 bg-slate-700/50 text-white px-4 py-3 rounded-xl border border-slate-600/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 placeholder-slate-400 text-sm disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white px-5 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '...' : '→'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
