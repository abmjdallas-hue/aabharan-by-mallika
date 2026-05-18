import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#FDF9ED',
          100: '#FAF0CF',
          200: '#F3DC99',
          300: '#EAC863',
          400: '#DDB84A',
          500: '#C9A84C',
          600: '#A07830',
          700: '#7A5A1E',
          800: '#523C12',
          900: '#2A1E06',
        },
        maroon: {
          50:  '#FDF2F2',
          100: '#FDE0E0',
          200: '#FBC0C0',
          300: '#F49090',
          400: '#E05050',
          500: '#8B1A1A',
          600: '#721515',
          700: '#5A1010',
          800: '#420B0B',
          900: '#2A0606',
        },
        ivory:  '#FAF8F3',
        beige:  '#F5EDD8',
        cream:  '#FDF9F0',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
