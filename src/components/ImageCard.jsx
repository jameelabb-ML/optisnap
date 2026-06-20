import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProgressBar from './ProgressBar'
import ComparisonSlider from './ComparisonSlider'
import { formatBytes, calcReduction, downloadBlob } from '../services/compressionService'
import { useCompression } from '../context/CompressionContext'

export default function ImageCard({ image }) {
  const [showComparison, setShowComparison] = useState(false)
  
  // Destructure layout attributes and parameters straight from the core application context state loop
  const { 
    removeImage, compressOne, quality, maxSizeMB, outputFormat, 
    customWidth, customHeight, lockAspectRatio, stripMetadata 
  } = useCompression()

  const reduction = calcReduction(image.originalSize, image.compressedSize)
  const isDone = image.status === 'done'
  const isCompressing = image.status === 'compressing'
  const isError = image.status === 'error'

  // FIXED DYNAMIC EXTENSION DOWNLOADING LOOKUP UTILITY
  const handleDownload = () => {
    if (!image.compressedBlob) return
    
    // Strip original naming tokens (e.g., "vector_icon.svg" -> "vector_icon")
    const nameWithoutExt = image.file.name.replace(/\.[^/.]+$/, '')
    
    // Read actual target compiled MIME signature from inside the generated binary blob container
    const blobMimeType = image.compressedBlob.type || image.file.type
    let extension = 'jpg'
    
    if (blobMimeType === 'image/png') extension = 'png'
    if (blobMimeType === 'image/webp') extension = 'webp'
    if (blobMimeType === 'image/svg+xml') extension = 'svg'

    const finalDownloadName = `${nameWithoutExt}_compressed.${extension}`
    
    // Triggers browser native download pipeline with the correct file name mapping
    downloadBlob(image.compressedBlob, finalDownloadName)
  }

  // Packages your custom configuration parameters right into the individual run processing trigger
  const handleRecompress = () => {
    compressOne(image.id, {
      quality,
      maxSizeMB,
      outputFormat,
      customWidth,
      customHeight,
      lockAspectRatio,
      stripMetadata
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="relative rounded-xl border p-3.5 transition-all duration-300
                 dark:border-zinc-800/80 border-zinc-200/80
                 dark:bg-zinc-900/40 bg-white shadow-sm"
    >
      {/* Header Info Block */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Compact 40px Thumbnail preview box */}
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 dark:bg-zinc-900 bg-zinc-100 border dark:border-zinc-800 border-zinc-200">
            <img src={image.originalUrl} alt={image.file.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-xs text-gray-900 dark:text-zinc-100 truncate" title={image.file.name}>
              {image.file.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-gray-400 dark:text-zinc-500">{formatBytes(image.originalSize)}</span>
              {isDone && (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-300 dark:text-zinc-700">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                  <span className="text-[10px] font-mono text-accent font-bold">{formatBytes(image.compressedSize)}</span>
                  <span className={`text-[9px] font-mono font-black px-1 py-0.5 rounded tracking-wide ${reduction > 0 ? 'bg-accent/10 text-accent' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {reduction > 0 ? `-${reduction}%` : '~0%'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Medium Profile Action Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isDone && (
            <button 
              onClick={() => setShowComparison(v => !v)}
              className={`flex items-center justify-center w-7 h-7 rounded-lg border transition-all duration-200
                         ${showComparison 
                           ? 'border-accent bg-accent/10 text-accent shadow-[0_0_10px_rgba(0,229,160,0.1)]' 
                           : 'dark:border-zinc-800 border-zinc-200 text-gray-400 dark:text-zinc-500 hover:text-accent dark:hover:text-accent hover:border-accent/30'}`}
              title="Toggle Split-Screen Comparison Preview Slider"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="18" /><rect x="14" y="3" width="7" height="18" /></svg>
            </button>
          )}

          {isDone && (
            <motion.button onClick={handleDownload} whileTap={{ scale: 0.95 }} className="w-7 h-7 flex items-center justify-center rounded-lg border border-accent bg-accent/10 text-accent cursor-pointer transition-colors hover:bg-accent/15" title="Download Optimized Output Image File">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            </motion.button>
          )}

          {(isError || image.status === 'idle') && (
            <motion.button onClick={handleRecompress} whileTap={{ scale: 0.95 }} className="h-7 px-2.5 flex items-center justify-center gap-1 rounded-lg border border-accent bg-accent/10 text-accent font-display font-bold text-[10px] uppercase tracking-wider cursor-pointer" title="Process/Compress Image Asset">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" /></svg>
              <span>Run</span>
            </motion.button>
          )}

          <button
            onClick={() => removeImage(image.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 dark:text-zinc-500 hover:text-red-400 dark:hover:text-red-400 transition-colors"
            title="Remove from Workspace List Queue"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      </div>

      {/* Automated Progress Bar Fade Mechanism */}
      <AnimatePresence>
        {isCompressing && (
          <motion.div 
            initial={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="mt-2.5 overflow-hidden"
          >
            <ProgressBar progress={image.progress} status={image.status} />
          </motion.div>
        )}
      </AnimatePresence>

      {isError && <p className="text-[10px] text-red-400 mt-1 font-mono">{image.error || 'Compression failed'}</p>}

      {/* Comparison Split Slider view frame box */}
      {isDone && image.compressedUrl && showComparison && (
        <div className="mt-3 overflow-hidden rounded-lg border dark:border-zinc-800 border-zinc-100 max-h-[200px]">
          <ComparisonSlider originalUrl={image.originalUrl} compressedUrl={image.compressedUrl} alt={image.file.name} />
        </div>
      )}
    </motion.div>
  )
}
