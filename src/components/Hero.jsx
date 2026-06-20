import { motion } from 'framer-motion'

const stats = [
  { label: 'Privacy', value: '100%' },
  { label: 'In-Browser', value: 'Local' },
  { label: 'Formats', value: '4+' },
]

export default function Hero() {
  return (
    <section className="relative pt-32 pb-12 px-6 text-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-dark dark:bg-grid-dark light:bg-grid-light bg-grid opacity-100" />

      {/* Glow orb */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full
                      bg-accent/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-4"
        >
          <span className="tag">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="#00E5A0" strokeWidth="1.5" />
              <path d="M3 5l1.5 1.5L7 3.5" stroke="#00E5A0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Your images never leave your device
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display font-bold text-5xl sm:text-6xl leading-[1.1] mb-5 text-gradient"
        >
          Optimize images,<br />keep your privacy.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg dark:text-white/50 text-gray-500 max-w-xl mx-auto mb-10 font-body"
        >
          Fast, secure browser-based image compression and conversion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-center gap-8"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-2xl text-accent">{s.value}</div>
              <div className="text-xs dark:text-white/40 text-gray-400 mt-0.5 font-mono">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
