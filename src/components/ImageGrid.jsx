import { motion, AnimatePresence } from 'framer-motion'
import { useCompression } from '../context/CompressionContext'
import { downloadAll } from '../services/compressionService'
import ImageCard from './ImageCard'

export default function ImageGrid({ hideToolbar = false }) {
  const { images, clearAll, compressAll } = useCompression()

  if (!images || images.length === 0) return null

  const doneImages = images.filter(i => i.status === 'done')
  const pendingImages = images.filter(i => i.status === 'idle' || i.status === 'error')
  const allDone = doneImages.length === images.length
  const hasMultipleDone = doneImages.length > 1

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Toolbar displays ONLY if not hidden by parent layouts */}
      {!hideToolbar && (
        <div className="flex items-center justify-between pb-2 border-b dark:border-zinc-800/60 border-zinc-200/60">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-xs uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Queue ({images.length})
            </span>
            {allDone && <span className="tag text-[10px]">All Done</span>}
          </div>

          <div className="flex items-center gap-2">
            {hasMultipleDone && (
              <motion.button 
                onClick={downloadAll} whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}
                className="relative flex items-center gap-1.5 py-1.5 px-3 rounded-lg border font-display font-semibold text-[10px] uppercase tracking-wider text-accent border-accent bg-accent/10 shadow-[0_0_16px_rgba(0,229,160,0.12)] cursor-pointer select-none"
              >
                Download All
              </motion.button>
            )}
            {pendingImages.length > 0 && (
              <motion.button 
                onClick={() => compressAll(pendingImages.map(i => i.id))} whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}
                className="relative flex items-center gap-1.5 py-1.5 px-3 rounded-lg border font-display font-semibold text-[10px] uppercase tracking-wider text-accent border-accent bg-accent/10 shadow-[0_0_16px_rgba(0,229,160,0.12)] cursor-pointer select-none"
              >
                Compress All
              </motion.button>
            )}
            <motion.button 
              onClick={clearAll} whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}
              className="relative flex items-center gap-1.5 py-1.5 px-3 rounded-lg border font-display font-semibold text-[10px] uppercase tracking-wider text-red-400 border-red-500/20 bg-red-500/10 cursor-pointer select-none"
            >
              Clear
            </motion.button>
          </div>
        </div>
      )}

      {/* Structural Image Layout Grid Canvas */}
      <div className="grid gap-4 grid-cols-1 w-full">
        <AnimatePresence mode="popLayout">
          {images.map(image => (
            <ImageCard key={image.id} image={image} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
