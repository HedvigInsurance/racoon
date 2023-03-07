import { css } from '@emotion/react'
import { HedvigFont } from './theme/typography'

// Replacement for next/font/local for storybook

const getFonts = () => {
  return Object.values(HedvigFont).map((fontName) => ({
    family: fontName,
    style: 'normal',
    weight: 400,
    src: require(`ui/fonts/${fontName}.woff2`),
    format: 'woff2',
  }))
}

export const storybookFontStyles = css`
  ${getFonts()
    .map(
      (font) => `
    @font-face {
      font-family: ${font.family};
      font-style: ${font.style};
      font-weight: ${font.weight};
      src: url("${font.src}") format("${font.format}");
      font-display: swap;
    }
  `,
    )
    .join('\n')}

  body {
    --hedvig-font-small: ${HedvigFont.HEDVIG_LETTERS_SMALL};
    --hedvig-font-standard: ${HedvigFont.HEDVIG_LETTERS_STANDARD};
    --hedvig-font-big: ${HedvigFont.HEDVIG_LETTERS_BIG};
    font-family: var(--hedvig-font-standard);
  }
`
