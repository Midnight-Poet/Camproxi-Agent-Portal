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
        bg: '#f5f8f7',
        ok: { DEFAULT: '#1f9d6b', bg: '#e6f5ee' },
        warn: { DEFAULT: '#c8821a', bg: '#fbf0db' },
        danger: { DEFAULT: '#d2453d', bg: '#fdeceb' },
        gone: { DEFAULT: '#7d8d89', bg: '#eef1f0' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        md2: '14px',
        sm2: '10px',
      },
      boxShadow: {
        sm2: '0 1px 2px rgba(20,32,30,.05), 0 1px 3px rgba(20,32,30,.04)',
        md2: '0 4px 14px rgba(20,32,30,.07), 0 2px 6px rgba(20,32,30,.04)',
        lg2: '0 12px 34px rgba(20,32,30,.12)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0.35', transform: 'translateY(9px)' },
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
      },
      animation: {
        fadeUp: 'fadeUp .32s cubic-bezier(.2,.7,.3,1) both',
        pop: 'pop .2s ease both',
        sheetUp: 'sheetUp .26s cubic-bezier(.2,.7,.3,1) both',
      },
    },
  },
  plugins: [],
};

