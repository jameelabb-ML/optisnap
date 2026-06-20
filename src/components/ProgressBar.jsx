import { motion } from 'framer-motion'

export default function ProgressBar({ progress = 0, status = 'idle' }) {
  const isCompressing = status === 'compressing'
  const isDone = status === 'done'
  const isError = status === 'error'

  const color = isError ? '#ef4444' : '#00E5A0'

  return (
    <div className="w-full my-2">
      {/* VISUAL FIX: Swapped to explicit high-contrast zinc classes and increased thickness to h-1.5 */}
      <div className="relative h-1.5 dark:bg-zinc-800 bg-zinc-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${isDone ? 100 : isError ? 100 : progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ backgroundColor: color }}
          className="absolute left-0 top-0 h-full rounded-full"
        />

        {/* Shimmer on compressing */}
        {isCompressing && (
          <motion.div
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ left: 0 }}
          />
        )}
      </div>

      {isCompressing && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-mono text-accent mt-1"
        >
          Compressing… {Math.round(progress)}%
        </motion.p>
      )}
    </div>
  )
}
