import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#e1306c',
          dark: '#c1275d',
        },
      },
    },
    container: {
      center: true,
      padding: '1rem',
    },
  },
  plugins: [],
} satisfies Config
