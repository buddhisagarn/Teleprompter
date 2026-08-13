/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0B0D',
        panel: '#16181C',
        panel2: '#1D2025',
        line: '#2A2D33',
        tally: '#E8342A',
        tallydim: '#5A1C18',
        cue: '#F2A93B',
        hi: '#F5F4F0',
        dim: '#8A8D93',
        dim2: '#54585F',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        latin: ['"Manrope"', 'sans-serif'],
        deva: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        bezel: 'inset 0 0 0 1px #2A2D33, inset 0 2px 12px rgba(0,0,0,0.6)',
      },
      keyframes: {
        'pulse-tally': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.35 },
        },
      },
      animation: {
        'pulse-tally': 'pulse-tally 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
