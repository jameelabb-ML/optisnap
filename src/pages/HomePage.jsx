import { useCompression } from '../context/CompressionContext'
import Hero from '../components/Hero'
import UploadZone from '../components/UploadZone'
import CompressionControls from '../components/CompressionControls'
import ImageGrid from '../components/ImageGrid'
import { motion, AnimatePresence } from 'framer-motion'

export default function HomePage() {
  const { images, clearAll, compressAll } = useCompression()
  
  const hasImages = images && images.length > 0
  const pendingImages = images?.filter(i => i.status === 'idle' || i.status === 'error') || []
  
  // CONDITIONAL RULE: Batch operations row appears ONLY when 2 or more files exist in the queue
  const showBulkControls = images && images.length >= 2

  return (
    <main className="h-screen w-full flex flex-col lg:flex-row bg-[#fbfbfa] dark:bg-[#080809] transition-colors duration-300 overflow-hidden">
      
      <AnimatePresence mode="wait">
        {!hasImages ? (
          /* =========================================================================
             STAGE 1: YOUR EXACT HERO LANDING VIEW (Fades away seamlessly upon upload)
             ========================================================================= */
          <motion.div 
            key="landing-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="flex-1 h-screen w-full relative flex flex-col items-center justify-center select-none overflow-y-auto pb-12"
          >
            {/* Renders your exact Hero Component with title, gradient layout, and metrics */}
            <div className="w-full">
              <Hero />
            </div>

            {/* Upload Dropzone centered directly underneath your Hero metrics layout */}
            <div className="max-w-lg w-full px-6 mx-auto -mt-6 relative z-10 shadow-2xl dark:shadow-black/20 shadow-zinc-200/50">
              <UploadZone compact={false} />
            </div>
          </motion.div>
        ) : (
          /* =========================================================================
             STAGE 2: DESKTOP STUDIO CONSOLE (Zero Layout Shifting)
             ========================================================================= */
          <motion.div 
            key="active-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 w-full h-full flex flex-col lg:flex-row overflow-hidden"
          >
            {/* 
                SIDEBAR SIDE FIXED PANEL BLOCK 
                Forces rigid pixel boundary constraints to safeguard sliding alignment.
            */}
            <div className="w-full lg:w-[350px] xl:w-[360px] flex-shrink-0 flex flex-col justify-between 
                            border-b lg:border-b-0 lg:border-r border-zinc-200/60 dark:border-zinc-800/60
                            bg-white dark:bg-[#0c0c0e]/95 backdrop-blur-xl px-5 py-5 pt-24 h-auto lg:h-screen z-20">
              
              <div className="flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-thin">
                <div className="flex flex-col gap-1 border-b border-zinc-200/60 dark:border-zinc-800/40 pb-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-500">Dashboard Sidebar</span>
                    <span className="text-[9px] font-mono font-bold text-accent px-1.5 py-0.5 rounded bg-accent/10 border border-accent/10 uppercase tracking-wider">Console Online</span>
                  </div>
                </div>

                <div className="w-full">
                  <CompressionControls />
                </div>
              </div>

              {/* DYNAMIC TASK CONTROLLER FOOTER: Displays ONLY if 2 or more files inhabit queue list */}
              {showBulkControls && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/40 flex flex-col gap-2"
                >
                  <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest px-0.5 mb-0.5">
                    Batch Options ({images.length} files loaded)
                  </span>
                  
                  <div className="flex gap-2 w-full">
                    {pendingImages.length > 0 && (
                      <button 
                        onClick={() => compressAll(pendingImages.map(i => i.id))}
                        className="flex-1 flex items-center justify-center py-2 h-9 rounded-xl border font-display font-bold text-[10px] uppercase tracking-wider text-accent border-accent bg-accent/10 shadow-[0_0_12px_rgba(0,229,160,0.08)] cursor-pointer transition-all hover:bg-accent/15 active:scale-95 select-none"
                      >
                        Compress All
                      </button>
                    )}
                    
                    <button 
                      onClick={clearAll}
                      className="flex-1 flex items-center justify-center py-2 h-9 rounded-xl border font-display font-bold text-[10px] uppercase tracking-wider text-red-500 border-red-200 bg-red-50/50 dark:border-red-500/20 dark:bg-red-500/5 shadow-[0_0_12px_rgba(239,68,68,0.02)] cursor-pointer transition-all hover:bg-red-500/10 active:scale-95 select-none"
                    >
                      Clear All
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* 
                INDEPENDENT SCROLL CONSOLE PREVIEW CANVAS 
                FIXED VISIBILITY: Upgraded layout envelope from max-w-2xl to max-w-5xl 
                to reveal a spacious, premium desktop-first workspace screen.
            */}
            <div className="flex-1 w-full h-full pt-24 px-6 lg:px-10 pb-12 overflow-y-auto bg-transparent z-10">
              <div className="max-w-5xl mx-auto flex flex-col gap-5">
                {/* Compact Dropzone Header Row */}
                <div className="opacity-90 hover:opacity-100 transition-opacity duration-200 shadow-sm shadow-zinc-200/5">
                  <UploadZone compact={true} />
                </div>
                
                {/* Image Grid Canvas List View */}
                <ImageGrid hideToolbar={true} />
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}
