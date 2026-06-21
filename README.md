# OptiSnap

> Private, offline-ready image compression — entirely in your browser.

![SafeCompress](https://img.shields.io/badge/PWA-Ready-00E5A0?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square)

## Features

- **100% Private** — Images never leave your device
- **Drag & Drop** — Drop multiple images at once
- **Format Support** — PNG, JPG, JPEG, WEBP
- **Compression Controls** — Quality slider + Low / Medium / High presets
- **Before/After Comparison** — Interactive drag slider
- **Size Stats** — Original size, compressed size, % reduction
- **Download** — Individual or batch download
- **Progress Indicator** — Real-time compression progress per image
- **Dark / Light Mode** — System preference aware, toggleable
- **Installable PWA** — Works offline after install
- **Responsive** — Mobile-first design

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool |
| TailwindCSS 3 | Styling |
| Framer Motion 11 | Animations |
| browser-image-compression | Core compression |
| vite-plugin-pwa | PWA / Service Worker |

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   ├── Logo.jsx            # Brand logo
│   ├── Hero.jsx            # Landing hero section
│   ├── ThemeToggle.jsx     # Dark/light mode button
│   ├── UploadZone.jsx      # Drag & drop upload area
│   ├── CompressionControls.jsx  # Quality slider + presets
│   ├── ImageGrid.jsx       # Grid of all uploaded images
│   ├── ImageCard.jsx       # Single image result card
│   ├── ComparisonSlider.jsx # Before/after interactive slider
│   ├── ProgressBar.jsx     # Compression progress indicator
│   ├── PWAInstallBanner.jsx # Install prompt banner
│   └── Footer.jsx          # Page footer
├── pages/
│   └── HomePage.jsx        # Main page layout
├── hooks/
│   ├── useDropZone.js      # Drag & drop logic
│   └── useComparisonSlider.js  # Slider drag logic
├── services/
│   └── compressionService.js   # browser-image-compression wrapper
├── context/
│   ├── ThemeContext.jsx    # Theme state
│   └── CompressionContext.jsx  # Global compression state
├── utils/
│   └── helpers.js          # Utility functions
└── styles/
    └── globals.css         # Global styles + Tailwind
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## PWA / Offline Usage

After building and deploying (or running `npm run preview`):

1. Visit the app in Chrome / Edge / Safari
2. Click **Install** in the address bar or the in-app banner
3. SafeCompress is now installed as a native-feeling app
4. Works fully offline — no internet needed after installation

## Design

Inspired by TinyPNG, Vercel, and Linear. Aesthetic: refined dark-mode minimalism with an electric-green accent (`#00E5A0`). Typography: Syne (display) + DM Sans (body) + JetBrains Mono (technical values).

## License

MIT
