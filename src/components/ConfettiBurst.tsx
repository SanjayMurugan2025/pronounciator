import { motion } from 'framer-motion'

export const ConfettiBurst = ({ active }: { active: boolean }) => {
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {[...Array(16)].map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-2 w-2 rounded-full"
          style={{
            backgroundColor: ['#f97316', '#4f46e5', '#22c55e', '#eab308'][index % 4],
          }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: (index % 4) * 40 - 60,
            y: (index % 3) * -30 - 40,
          }}
          transition={{ duration: 1.2 }}
        />
      ))}
    </div>
  )
}
