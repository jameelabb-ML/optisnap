/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#00E5A0',
          dim: '#00C488',
          glow: 'rgba(0,229,160,0.15)',
        },
        surface: {
          DEFAULT: '#111113',
          raised: '#18181b',
          overlay: '#1f1f23',
          border: '#2a2a2f',
        },
        light: {
          bg: '#f5f5f0',
          raised: '#ffffff',
          overlay: '#f0f0eb',
          border: '#e2e2dc',
        }
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      backgroundImage: {
        'grid-dark': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'grid-light': 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '32px 32px',
      }
    },
  },
  plugins: [],
}
