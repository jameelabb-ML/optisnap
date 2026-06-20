import { motion } from 'framer-motion'
import { useCompression } from '../context/CompressionContext'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'

export default function Navbar() {
  const { clearAll, images } = useCompression()

  // Clicking the navbar row title smoothly clears the active file queue, taking you back home
  const handleHomeNavigationClick = () => {
    if (images && images.length > 0) {
      if (window.confirm("Return to home screen? This will reset your current compression queue.")) {
        clearAll()
      }
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3.5
                 border-b bg-white/80 border-zinc-200/40 backdrop-blur-xl
                 dark:bg-zinc-950/80 dark:border-zinc-800/40 select-none"
    >
      {/* BRAND INTERACTION LINK ANCHOR */}
      <div onClick={handleHomeNavigationClick} className="cursor-pointer active:scale-98 transition-transform">
        <Logo />
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-accent/10 text-accent border border-accent/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
          100% Private Sandbox
        </span>
        
        <ThemeToggle />
      </div>
    </motion.header>
  )
}
