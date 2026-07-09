import { motion } from 'framer-motion'

export default function AnimatedPlayer({ name, role, img }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-20 h-20 bg-gradient-to-br from-[#062b2e] to-[#0a3a3d] rounded-squarish flex items-center justify-center">
        <img src={img} alt={name} className="w-16 h-16 object-cover rounded-squarish"/>
      </motion.div>
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-sm opacity-70">{role}</div>
        <div className="mt-2 text-xs opacity-80">Animated bio preview — click for full player card (coming soon)</div>
      </div>
    </div>
  )
}
