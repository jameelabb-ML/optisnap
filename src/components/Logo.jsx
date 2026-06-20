export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-8 h-8 flex-shrink-0">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="32" height="32" rx="8" fill="#00E5A0" fillOpacity="0.15" />
          <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#00E5A0" strokeOpacity="0.3" />
          <path d="M9 11C9 9.89543 9.89543 9 11 9H18L23 14V21C23 22.1046 22.1046 23 21 23H11C9.89543 23 9 22.1046 9 21V11Z"
            stroke="#00E5A0" strokeWidth="1.5" fill="none" />
          <path d="M18 9V13C18 13.5523 18.4477 14 19 14H23" stroke="#00E5A0" strokeWidth="1.5" />
          <path d="M13 17L16 20L19 17" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 20V13" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <span className="font-display font-bold text-lg tracking-tight dark:text-white text-gray-900">
        Opti<span className="text-accent">Snap</span>
      </span>
    </div>
  )
}
