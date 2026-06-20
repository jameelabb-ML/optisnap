import Logo from './Logo'

export default function Footer() {
  return (
    // LUXURY AMBIENT FOOTER: Translucent base row built with high-contrast text tags
    <footer 
      className="w-full border-t backdrop-blur-md select-none transition-colors duration-300 mt-auto
                 bg-white/40 border-zinc-200/30
                 dark:bg-zinc-950/30 dark:border-zinc-900/60"
    >
      <div className="max-w-2xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo Alignment Box */}
        <div className="opacity-80 hover:opacity-100 transition-opacity duration-200">
          <Logo />
        </div>
        
        {/* Your Original Privacy Notice — Redesigned with premium deep text contrasts */}
        <p className="text-xs text-gray-500 dark:text-zinc-400 font-body text-center sm:text-right leading-relaxed max-w-sm">
          All optimization happens locally.{' '}
          <span className="block sm:inline font-medium text-gray-700 dark:text-zinc-200">
            No data is ever sent to any server.
          </span>
        </p>
      </div>
    </footer>
  )
}
