import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0f14',
        coal: '#171316',
        ember: '#ff4d2e',
        flame: '#ffd447',
        mustard: '#ff9f1c',
        cream: '#fff8e8',
        smoke: '#b7aa96',
        leaf: '#36d399',
        aqua: '#2dd4bf',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,212,71,.28), 0 20px 58px rgba(255,159,28,.24)',
        lift: '0 20px 54px rgba(0,0,0,.38)',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        body: ['Manrope', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
} satisfies Config;
