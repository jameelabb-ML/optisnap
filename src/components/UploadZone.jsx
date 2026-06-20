import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropZone } from '../hooks/useDropZone'
import { useCompression } from '../context/CompressionContext'

export default function UploadZone({ compact = false }) {
  const fileInputRef = useRef(null)
  const { addImages, compressAll } = useCompression()

  const { isDragging, error, handlers, handleFileInput } = useDropZone(async (files) => {
    if (!files || files.length === 0) return
    const newImages = addImages(files)
    await compressAll(newImages.map(i => i.id))
  })

  return (
    <div className="w-full">
      <motion.div
        {...handlers}
        animate={{
          scale: isDragging ? 1.01 : 1,
          borderColor: isDragging ? '#00E5A0' : undefined,
        }}
        transition={{ duration: 0.2 }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 select-none
                    ${compact ? 'p-5' : 'p-10'}
                    ${isDragging
                      ? 'border-accent bg-accent/5 shadow-[0_0_40px_rgba(0,229,160,0.15)]'
                      : 'dark:border-zinc-800/80 border-zinc-200/80 dark:hover:border-accent/40 hover:border-accent/40'
                    }
                    dark:bg-zinc-900/10 bg-zinc-50/40`}
      >
        <div className={`flex items-center justify-center gap-4 ${compact ? 'flex-row text-left' : 'flex-col text-center'}`}>
          <motion.div
            animate={{ y: isDragging ? -4 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative flex-shrink-0"
          >
            <div className={`rounded-xl flex items-center justify-center transition-colors duration-300
                            ${compact ? 'w-10 h-10' : 'w-14 h-14'}
                            ${isDragging ? 'bg-accent/20' : 'dark:bg-zinc-900 bg-zinc-200/60'}
                            group-hover:bg-accent/10`}>
              <svg width={compact ? "18" : "24"} height={compact ? "18" : "24"} viewBox="0 0 24 24" fill="none"
                stroke={isDragging ? '#00E5A0' : 'currentColor'}
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className={isDragging ? 'text-accent' : 'dark:text-white/40 text-gray-400 group-hover:text-accent transition-colors'}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            {isDragging && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute inset-0 rounded-xl border border-accent"
              />
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <p className={`font-display font-semibold dark:text-white text-gray-900 truncate
                           ${compact ? 'text-sm mb-0' : 'text-base mb-1'}`}>
              {isDragging ? 'Drop images here' : compact ? 'Click to add more images' : 'Drop images or click to upload'}
            </p>
            {!compact && (
              <p className="text-xs dark:text-white/40 text-gray-400 font-body">
                PNG, JPG, WEBP, SVG · Multiple vectors supported
              </p>
            )}
          </div>

          {!compact && (
            <div className="flex items-center gap-1.5 mt-1">
              {['PNG', 'JPG', 'WEBP', 'SVG'].map(fmt => (
                <span key={fmt} className="px-2 py-0.5 rounded text-[10px] font-mono
                                           dark:bg-zinc-900 bg-zinc-200/50
                                           dark:text-white/30 text-gray-400 border dark:border-zinc-800/40 border-zinc-200/40">
                  {fmt}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* INJECTED TARGET MIME TYPES FOR COMPATIBLE VECTOR RECOGNITION */}
        <input
          ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileInput}
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        />
      </motion.div>

      {/* Error alert toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mt-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
