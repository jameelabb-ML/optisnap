import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

let earlySavedPrompt = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    earlySavedPrompt = e;
  });
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(earlySavedPrompt)
  const [show, setShow] = useState(false)
  
  const [dismissed, setDismissed] = useState(() =>
    sessionStorage.getItem('sc-pwa-dismissed') === 'true'
  )

  useEffect(() => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;

    if (isStandalone) {
      setShow(false)
      return
    }

    // DEV OVERRIDE: If Chrome blocks the event on localhost, force the banner to show anyway after 1 second
    const forceTimeout = setTimeout(() => {
      if (!dismissed) {
        setShow(true);
      }
    }, 1000);

    if (earlySavedPrompt && !dismissed) {
      setDeferredPrompt(earlySavedPrompt);
      setShow(true);
      clearTimeout(forceTimeout);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault()
      earlySavedPrompt = e;
      setDeferredPrompt(e)
      if (!dismissed) setShow(true)
      clearTimeout(forceTimeout);
    }

    const handleAppInstalled = () => {
      setShow(false)
      setDeferredPrompt(null)
      earlySavedPrompt = null;
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      clearTimeout(forceTimeout);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [dismissed])

  const handleInstall = async () => {
    // If the browser event fired correctly, use it
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShow(false)
        setDeferredPrompt(null)
        earlySavedPrompt = null;
      }
    } else {
      // FALLBACK: If Chrome is blocking the event on localhost, show the user how to install it manually
      alert("Chrome is caching this local tab. To install, click the 'Install App' icon inside your browser address bar (top right corner next to the bookmark star)!");
    }
  }

  const handleDismiss = () => {
    setShow(false)
    setDismissed(true)
    sessionStorage.setItem('sc-pwa-dismissed', 'true')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6"
        >
          <div className="rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300
                          dark:border-surface-border border-light-border
                          dark:bg-surface-raised/90 bg-white/90 backdrop-blur-md shadow-2xl shadow-black/40">
            
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm text-gray-900 dark:text-white">
                Install OptiSnap
              </p>
              <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5 font-body">
                Use offline, no browser needed
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <motion.button 
                onClick={handleInstall}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                className="relative flex items-center gap-1.5 py-2 px-3 rounded-xl border
                           font-display font-semibold text-xs uppercase tracking-wider text-accent border-accent bg-accent/10 
                           shadow-[0_0_16px_rgba(0,229,160,0.15)] transition-all duration-200 cursor-pointer select-none"
              >
                Install
              </motion.button>

              <button
                onClick={handleDismiss}
                className="w-6 h-6 flex items-center justify-center text-gray-400 dark:text-white/30 hover:text-red-400 dark:hover:text-red-400 transition-colors duration-200"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
