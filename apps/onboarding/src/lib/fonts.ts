import localFont from 'next/font/local'

// NOTE:
// - Font loaders have to be const expressions at top level
// - Cannot reference path from packages/ui published version, font path is always local
export const smallFont = localFont({
  src: '../../../../packages/ui/fonts/HedvigLetters-Small.woff2',
  weight: '400',
  fallback: ['serif'],
  variable: '--hedvig-font-small',
  display: 'swap',
})
export const standardFont = localFont({
  src: '../../../../packages/ui/fonts/HedvigLetters-Standard.woff2',
  weight: '400',
  fallback: ['sans-serif'],
  variable: '--hedvig-font-standard',
  display: 'swap',
})
export const bigFont = localFont({
  src: '../../../../packages/ui/fonts/HedvigLetters-Big.woff2',
  weight: '400',
  fallback: ['serif'],
  variable: '--hedvig-font-big',
  display: 'swap',
})
// Apply variables for theme and standard font as default
export const contentFontClassName = [
  smallFont.variable,
  standardFont.variable,
  bigFont.variable,
  standardFont.className,
].join(' ')
