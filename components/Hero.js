import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <header className="bg-gradient-to-r from-[#031027] to-[#041428] p-6 rounded-squarish">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">FIFA 2026 — Fan Hub</div>
          <div className="text-sm opacity-70 mt-1">All official World Cup 2026 matches, teams and player profiles — powered by TheSportsDB & community images.</div>
        </div>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }} className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0ea5a3] to-[#34d399] rounded-squarish flex items-center justify-center text-black font-extrabold">26</div>
        </motion.div>
      </div>
    </header>
  )
}
