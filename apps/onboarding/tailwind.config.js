const { colorsV3 } = require('@hedviginsurance/brand')

module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
}
