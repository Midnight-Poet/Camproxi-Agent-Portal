/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d7a72',
          600: '#0a635c',
          700: '#084f49',
          100: '#d2ebe8',
          50: '#ecf6f5',
          tint: '#f3f9f8',
        },
        ink: '#14201e',
        camtext: '#2b3a37',
        muted: '#677975',
        faint: '#93a4a0',
        line: '#e7edec',
        line2: '#eef3f2',
        bg: '#f8faf9', // Slightly brightened bg
        surface: '#ffffff',
        ok: { DEFAULT: '#1f9d6b', bg: '#e6f5ee' },
        warn: { DEFAULT: '#c8821a', bg: '#fbf0db' },
        danger: { DEFAULT: '#d2453d', bg: '#fdeceb' },
        gone: { DEFAULT: '#7d8d89', bg: '#eef1f0' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '24px', // Softer edges for premium feel
        md2: '16px',
        sm2: '12px',
      },
      boxShadow: {
        sm2: '0 2px 4px rgba(20,32,30,.04), 0 1px 2px rgba(20,32,30,.02)',
        md2: '0 8px 24px rgba(20,32,30,.06), 0 2px 8px rgba(20,32,30,.03)',
        lg2: '0 16px 48px rgba(20,32,30,.10), 0 4px 16px rgba(20,32,30,.04)',
        glow: '0 0 20px rgba(15, 169, 157, 0.25)', // Primary glow
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'none' },
        },
        pop: {
          '0%': { transform: 'scale(.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        sheetUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'none' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        }
      },
      animation: {
        fadeUp: 'fadeUp .4s cubic-bezier(.16, 1, .3, 1) both',
        pop: 'pop .3s cubic-bezier(.16, 1, .3, 1) both',
        sheetUp: 'sheetUp .4s cubic-bezier(.16, 1, .3, 1) both',
        float: 'float 4s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

