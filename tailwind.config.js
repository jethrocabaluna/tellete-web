/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      primary: {
        DEFAULT: 'var(--primary)',
        light: {
          DEFAULT: 'var(--primary)',
          overlay: 'var(--primary-overlay)',
        },
        dark: {
          DEFAULT: 'var(--primary-dark)',
          overlay: 'var(--primary-dark-overlay)',
        },
      },
      secondary: {
        DEFAULT: 'var(--secondary)',
        light: 'var(--secondary)',
        dark: 'var(--secondary-dark)',
      },
      success: 'var(--success)',
      info: 'var(--info)',
      warning: 'var(--warning)',
      danger: 'var(--danger)',
    },
    extend: {
      height: {
        128: '512px',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
