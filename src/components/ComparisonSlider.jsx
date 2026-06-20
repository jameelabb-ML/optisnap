import { useComparisonSlider } from '../hooks/useComparisonSlider'

export default function ComparisonSlider({ originalUrl, compressedUrl, alt = 'Image comparison' }) {
  const { position, isDragging, containerRef, handleMouseDown, handleTouchStart } = useComparisonSlider()

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg select-none cursor-col-resize touch-none bg-zinc-100 dark:bg-zinc-900/60"
      style={{ aspectRatio: '16/9', maxHeight: 200 }}
    >
      {/* 1. Optimized Output Raster Image (Bottom Layer Baseline Background) */}
      <img
        src={compressedUrl}
        alt={`${alt} compressed`}
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />

      {/* 2. Original Input Image Layer (FIXED: Safely masked using a crisp CSS inset vector box wrapper) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={originalUrl}
          alt={`${alt} original`}
          className="absolute inset-0 w-full h-full object-contain max-w-none"
          draggable={false}
        />
      </div>

      {/* 3. High-Contrast Center Divider Line Tracker Trail */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 pointer-events-none"
        style={{ left: `${position}%` }}
      />

      {/* 4. Side Text Prompt Explanations (Fades on active dragging) */}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-between w-full px-10 pointer-events-none z-10 transition-opacity duration-300 font-display font-bold text-[10px] uppercase tracking-widest text-white/40
                   ${isDragging ? 'opacity-0' : 'opacity-100'}`}
      >
        <span style={{ transform: position > 35 ? 'none' : 'translateX(-20px)', opacity: position > 35 ? 1 : 0 }} className="transition-all duration-200">← Before</span>
        <span style={{ transform: position < 65 ? 'none' : 'translateX(20px)', opacity: position < 65 ? 1 : 0 }} className="transition-all duration-200">After →</span>
      </div>

      {/* 5. Premium Drag Handle Control Knob */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20
                   w-8 h-8 rounded-full bg-white dark:bg-zinc-900 shadow-2xl flex items-center justify-center
                   border border-zinc-200 dark:border-zinc-800 transition-transform duration-75 select-none
                   ${isDragging ? 'scale-110 shadow-accent/20 border-accent' : 'hover:scale-105'}`}
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Modern multi-grip tactical slider handle indicator */}
        <div className="flex gap-0.5 items-center justify-center pointer-events-none">
          <div className={`w-0.5 h-3 rounded-full transition-colors ${isDragging ? 'bg-accent' : 'bg-zinc-400 dark:bg-zinc-600'}`} />
          <div className={`w-0.5 h-4 rounded-full transition-colors ${isDragging ? 'bg-accent' : 'bg-zinc-500 dark:bg-zinc-500'}`} />
          <div className={`w-0.5 h-3 rounded-full transition-colors ${isDragging ? 'bg-accent' : 'bg-zinc-400 dark:bg-zinc-600'}`} />
        </div>
      </div>

      {/* 6. Clean Typographic Overlay Status Labels */}
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm
                      text-white text-[9px] font-mono tracking-wider uppercase z-10 pointer-events-none border border-white/5">
        Original
      </div>
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm
                      text-accent text-[9px] font-mono tracking-wider uppercase z-10 pointer-events-none border border-accent/10">
        Optimized
      </div>
    </div>
  )
}
