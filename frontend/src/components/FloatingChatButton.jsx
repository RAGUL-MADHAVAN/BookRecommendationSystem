import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function FloatingChatButton() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link
        to="/chatbot"
        className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110"
        title="Open Book Assistant"
      >
        <span className="text-3xl">🤖</span>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-3 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-700">
          Chat with Book Assistant
        </div>
        
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></span>
      </Link>
    </motion.div>
  )
}
