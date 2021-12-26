const { colorsV3, fonts } = require('@hedviginsurance/brand')

module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: [fonts.FAVORIT, 'sans-serif'],
    },
    extend: {
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.5rem',
        6: '2rem',
        7: '3rem',
        8: '4rem',
        9: '6rem',
      },
      colors: {
        gray: {
          100: colorsV3.gray100,
          200: colorsV3.gray200,
          300: colorsV3.gray300,
          500: colorsV3.gray500,
          700: colorsV3.gray700,
          800: colorsV3.gray800,
          900: colorsV3.gray900,
        },
        purple: {
          100: colorsV3.purple100,
          300: colorsV3.purple300,
          500: colorsV3.purple500,
          700: colorsV3.purple700,
          800: colorsV3.purple800,
          900: colorsV3.purple900,
        },
        red: {
          500: colorsV3.red500,
          600: colorsV3.red600,
        },
      },
      animation: {
        loader: 'loader 0.6s infinite alternate',
        fadeInUp: 'fadeInUp 0.7s cubic-bezier(0.39, 0.575, 0.565, 1)',
      },
      keyframes: {
        loader: {
          to: {
            opacity: 0.5,
            transform: 'translate3d(0, -0.15rem, 0)',
          },
        },
        fadeInUp: {
          from: {
            opacity: 0,
            transform: 'translate3d(0, 100%, 0)',
          },
          to: {
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
          },
        },
      },
    },
  },
  plugins: [],
}
