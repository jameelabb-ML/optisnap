import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useCompression } from '../context/CompressionContext'

const PRESETS = [
  { id: 'low',    label: 'Low',    desc: 'Smallest',  quality: 0.40, display: '40%' },
  { id: 'medium', label: 'Medium', desc: 'Balanced',  quality: 0.70, display: '70%' },
  { id: 'high',   label: 'High',   desc: 'Best',      quality: 0.90, display: '90%' },
]

const FORMATS = [
  { id: 'original', label: 'Original' },
  { id: 'png',      label: 'PNG' },
  { id: 'jpeg',     label: 'JPG' },
  { id: 'webp',     label: 'WebP' }
]

export default function CompressionControls() {
  const { 
    quality, preset, maxSizeMB, setQuality, setPreset, setMaxSize, 
    outputFormat, setOutputFormat, customWidth, setCustomWidth, 
    customHeight, setCustomHeight, lockAspectRatio, setLockAspectRatio 
  } = useCompression()

  const [isLocked, setIsLocked] = useState(lockAspectRatio ?? true)
  const [aspectRatio, setAspectRatio] = useState(1.777)
  
  // Flag to block recursive updates while typing
  const isUpdatingRef = useRef(false)

  // Track initial image load to set the core fallback aspect ratio baseline
  useEffect(() => {
    if (customWidth && customHeight && !isUpdatingRef.current) {
      setAspectRatio(customWidth / customHeight)
    }
  }, [customWidth, customHeight])

  const handlePresetSelect = (p) => {
    setPreset(p.id)
    setQuality(p.quality)
  }

  // Handle Width change while preserving global sync or lock ratios
  const handleWidthChange = (val) => {
    if (isUpdatingRef.current) return
    isUpdatingRef.current = true
    
    setCustomWidth?.(val)
    if (isLocked && val && setCustomHeight && aspectRatio) {
      setCustomHeight(Math.round(val / aspectRatio))
    }
    
    isUpdatingRef.current = false
  }

  // Handle Height change while preserving global sync or lock ratios
  const handleHeightChange = (val) => {
    if (isUpdatingRef.current) return
    isUpdatingRef.current = true

    setCustomHeight?.(val)
    if (isLocked && val && setCustomWidth && aspectRatio) {
      setCustomWidth(Math.round(val * aspectRatio))
    }

    isUpdatingRef.current = false
  }

  const currentQuality = quality || 0.7
  const currentMaxSize = maxSizeMB || 1
  const currentFormat = outputFormat || 'original'

  const qualityRangePercent = ((currentQuality - 0.1) / (1 - 0.1)) * 100
  const sizeRangePercent = ((currentMaxSize - 0.1) / (5 - 0.1)) * 100
  
  // Comprehensive styling variables that thoroughly target and disable browser focus and mobile webkit highlight overlays
  const clearTap = "outline-none focus:outline-none select-none active:bg-transparent focus-within:outline-none focus:ring-0 [-webkit-tap-highlight-color:transparent]"

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <h2 className="font-display font-semibold text-[10px] mb-3 text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
          Compression Settings
        </h2>

                {/* Presets */}
        <div className="grid grid-cols-3 gap-1.5 mb-4" style={{ WebkitTapHighlightColor: 'transparent' }}>
          {PRESETS.map((p) => (
            <motion.button
              key={p.id} 
              type="button" 
              onClick={() => handlePresetSelect(p)} 
              whileTap={{ scale: 0.97 }}
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
              className={`relative flex flex-col items-center gap-0 py-2 px-1.5 rounded-xl border transition-all duration-200 text-center select-none cursor-pointer outline-none focus:outline-none
                          ${preset === p.id
                            ? 'border-accent bg-accent/5 shadow-[0_0_12px_rgba(0,229,160,0.1)]'
                            : 'dark:border-zinc-800/50 border-zinc-200/50 dark:hover:border-accent/20 hover:border-accent/20 bg-transparent'
                          }`}
            >
              {preset === p.id && <motion.div layoutId="preset-indicator" className="absolute inset-0 rounded-xl bg-accent/5" />}
              <span className={`font-display font-bold text-[11px] relative z-10 ${preset === p.id ? 'text-accent' : 'text-gray-800 dark:text-zinc-200'}`}>
                {p.label}
              </span>
              <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-body relative z-10">{p.desc}</span>
              <span className="font-mono text-[9px] text-accent/60 relative z-10">{p.display}</span>
            </motion.button>
          ))}
        </div>


                {/* OUTPUT FORMAT SELECTION ROW */}
        <div className="mb-4">
          <label className="font-display font-medium text-[11px] text-gray-600 dark:text-zinc-400 block mb-1.5 select-none">
            Output Format
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 select-none">
            {FORMATS.map((f) => (
              <button
                key={f.id} 
                type="button" 
                onClick={() => setOutputFormat && setOutputFormat(f.id)}
                className={`py-1.5 px-1 text-center text-[10px] font-bold rounded-lg transition-all duration-150 cursor-pointer select-none outline-none focus:outline-none focus-visible:outline-none border border-transparent
                            ${currentFormat === f.id
                              ? 'bg-gray-200/80 dark:bg-zinc-800 text-accent font-extrabold shadow-none border-zinc-300/50 dark:border-zinc-700/50'
                              : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 bg-transparent'
                            }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>



        {/* CUSTOM RESOLUTION INPUT MECHANISM */}
        <div className="mb-4 border-t border-b border-zinc-200/60 dark:border-zinc-800/40 py-3.5">
          <div className="flex items-center justify-between mb-2">
            <label className="font-display font-medium text-[11px] text-gray-600 dark:text-zinc-400">
              Dimensions (Pixels)
            </label>
            <button 
              type="button" 
              onClick={() => { 
                const next = !isLocked; 
                setIsLocked(next); 
                setLockAspectRatio?.(next); 
                if (next && customWidth && customHeight) {
                  setAspectRatio(customWidth / customHeight);
                }
              }}
              className={`text-[10px] font-mono tracking-wide transition-colors cursor-pointer ${clearTap} ${isLocked ? 'text-accent font-semibold' : 'text-gray-400 dark:text-zinc-500'}`}
            >
              {isLocked ? '🔒 Locked Aspect' : '🔓 Unlocked'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-gray-400 dark:text-zinc-500 uppercase px-0.5">Width</span>
              <input 
                type="number" placeholder="Original" value={customWidth || ''} 
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || null)}
                className="w-full bg-gray-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 font-mono text-xs dark:text-white text-gray-900 focus:outline-none focus:border-accent/40"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-gray-400 dark:text-zinc-500 uppercase px-0.5">Height</span>
              <input 
                type="number" placeholder="Original" value={customHeight || ''} 
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || null)}
                className="w-full bg-gray-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 font-mono text-xs dark:text-white text-gray-900 focus:outline-none focus:border-accent/40"
              />
            </div>
          </div>
        </div>

        {/* Quality Slider */}
        <div className={`mb-3.5 transition-opacity duration-200 ${currentFormat === 'png' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center justify-between mb-1">
            <label className="font-display font-medium text-[11px] text-gray-600 dark:text-zinc-400">Quality</label>
            <span className="font-mono text-[11px] text-accent font-semibold">{Math.round(currentQuality * 100)}%</span>
          </div>
          <div className="relative w-full h-4 flex items-center">
            <div className="absolute left-0 right-0 h-1 rounded-full dark:bg-zinc-800 bg-zinc-200 pointer-events-none" />
            <div className="absolute left-0 h-1 rounded-l-full bg-accent pointer-events-none" style={{ width: `calc(${qualityRangePercent}% + (9px - (${qualityRangePercent} * 18px / 100)))` }} />
            <input
              type="range" min="0.1" max="1" step="0.05" value={currentQuality} disabled={currentFormat === 'png'}
              onChange={(e) => { setQuality(parseFloat(e.target.value)); if (setPreset) setPreset('custom') }}
              className="absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer z-10"
              style={{ WebkitAppearance: 'none', background: 'transparent' }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 dark:text-zinc-500 font-mono mt-0.5">
            <span>10% Smallest</span>
            <span>100% Original</span>
          </div>
        </div>

        {/* Max Size Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-display font-medium text-[11px] text-gray-600 dark:text-zinc-400">Max file size</label>
            <span className="font-mono text-[11px] text-accent font-semibold">{currentMaxSize} MB</span>
          </div>
          <div className="relative w-full h-4 flex items-center">
            <div className="absolute left-0 right-0 h-1 rounded-full dark:bg-zinc-800 bg-zinc-200 pointer-events-none" />
                         <div className="absolute left-0 h-1 rounded-l-full bg-accent pointer-events-none" style={{ width: `calc(${sizeRangePercent}% + (9px - (${sizeRangePercent} * 18px / 100)))` }} />
            <input
              type="range" min="0.1" max="5" step="0.1" value={currentMaxSize}
              onChange={(e) => setMaxSize(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer z-10"
              style={{ WebkitAppearance: 'none', background: 'transparent' }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 dark:text-zinc-500 font-mono mt-0.5">
            <span>0.1 MB</span>
            <span>5 MB</span>
          </div>
        </div>
      </div>
    </div>
  )
}
