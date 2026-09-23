/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#07090e',
          card: 'rgba(13, 17, 27, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: '#00f5ff',
          neonPink: '#ec4899',
          neonPurple: '#8b5cf6',
          gold: '#f59e0b',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -3px rgba(0, 245, 255, 0.35)',
        'neon-purple': '0 0 25px -3px rgba(139, 92, 246, 0.35)',
        'neon-gold': '0 0 25px -3px rgba(245, 158, 11, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px rgba(0, 245, 255, 0.2)' },
          'to': { boxShadow: '0 0 25px rgba(0, 245, 255, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}
