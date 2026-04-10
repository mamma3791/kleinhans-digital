import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f5f4ef',
        'cream2': '#eceae3',
        dark: '#1a2420',
        'dark2': '#0f1c15',
        green: {
          DEFAULT: '#3a8a62',
          '2': '#2a6647',
          '3': '#5dbf88',
        },
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
}

export default config
