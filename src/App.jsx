import { ThemeProvider } from './context/ThemeContext'
import { CompressionProvider } from './context/CompressionContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PWAInstallBanner from './components/PWAInstallBanner'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <ThemeProvider>
      <CompressionProvider>
        <div className="flex flex-col min-h-screen dark:bg-surface bg-light-bg transition-colors duration-300">
          <Navbar />
          <div className="flex-1">
            <HomePage />
          </div>
          <Footer />
          <PWAInstallBanner />
        </div>
      </CompressionProvider>
    </ThemeProvider>
  )
}
