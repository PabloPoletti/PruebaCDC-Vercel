import { motion } from 'framer-motion'

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="bg-white rounded-lg px-4 py-3 shadow-md">
        <div className="flex items-center gap-1">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-gray-500 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-gray-500 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-gray-500 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  )
}

