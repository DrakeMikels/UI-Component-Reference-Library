import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Source Serif 4"', 'Georgia', 'serif']
      },
      colors: {
        ink: {
          50: '#f7f6f3',
          100: '#eceae5',
          200: '#d7d1c8',
          300: '#b8af9f',
          400: '#998e79',
          500: '#7d725e',
          600: '#655b4a',
          700: '#4d4538',
          800: '#363027',
          900: '#1f1b17'
        },
        pine: {
          50: '#eef6f1',
          100: '#d8eadf',
          200: '#b4d5c0',
          300: '#86ba9c',
          400: '#5a9f7b',
          500: '#3e8361',
          600: '#2f684d',
          700: '#265340',
          800: '#214335',
          900: '#1d372c'
        },
        amberline: '#d6b574'
      },
      boxShadow: {
        card: '0 12px 32px -24px rgba(31, 27, 23, 0.5)'
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 55%), radial-gradient(circle at 80% 0%, rgba(214,181,116,0.18) 0%, rgba(214,181,116,0) 45%)"
      }
    }
  },
  plugins: []
};

export default config;
