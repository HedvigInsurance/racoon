export enum HedvigFont {
  HEDVIG_LETTERS_BIG = 'HedvigLetters-Big',
  HEDVIG_LETTERS_SMALL = 'HedvigLetters-Small',
  HEDVIG_LETTERS_STANDARD = 'HedvigLetters-Standard',
}

const FONT_STANDARD = `var(--hedvig-font-standard), sans-serif`
export const fonts = {
  standard: FONT_STANDARD,
  small: 'var(--hedvig-font-small), serif',
  big: 'var(--hedvig-font-big), serif',

  body: FONT_STANDARD,
  heading: FONT_STANDARD,
}

export const fontSizeScale = {
  0: '0.75rem',
  1: '0.875rem',
  2: '1rem',
  3: '1.125rem',
  4: '1.25rem',
  5: '1.5rem',
  6: '2rem',
  7: '2.5rem',
  8: '3rem',
  9: '3.5rem',
  10: '4.5rem',
  11: '6rem',
} as const

export const fontSizes = {
  ...fontSizeScale,
  body: fontSizeScale[2],
  xxs: fontSizeScale[0],
  xs: fontSizeScale[1],
  sm: fontSizeScale[2],
  md: fontSizeScale[3],
  lg: fontSizeScale[4],
  xl: fontSizeScale[5],
  xxl: fontSizeScale[6],
  xxxl: fontSizeScale[8],
} as const

export type FontSizes = keyof typeof fontSizes
