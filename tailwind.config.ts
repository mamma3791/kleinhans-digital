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
          DEFAULT: '#2d6a4f',
          '2': '#1f4d39',
          '3': '#3d7a5e',
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
