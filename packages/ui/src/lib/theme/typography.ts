import { fonts as hedvigFonts } from '@hedviginsurance/brand'

export const fonts: Record<string, string> = {
  standard: `'${hedvigFonts.HEDVIG_LETTERS_STANDARD}', sans-serif`,
  small: `'${hedvigFonts.HEDVIG_LETTERS_SMALL}', serif`,
  big: `'${hedvigFonts.HEDVIG_LETTERS_BIG}', serif`,
}
fonts.body = fonts.standard
fonts.heading = fonts.standard

export const fontSizes: Record<number | string, string> = {
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
}

// Add more alaises when we have more hi-fi designs
fontSizes.body = fontSizes[2]
