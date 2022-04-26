import { css } from '@emotion/react'
import { colorsV3, fonts, getCdnFontFaces } from '@hedviginsurance/brand'

export const globalStyles = css`
  ${getCdnFontFaces()}

  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  **,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    color: ${colorsV3.gray900};
    background-color: ${colorsV3.gray100};
    font-family: ${fonts.HEDVIG_LETTERS_STANDARD}, sans-serif;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 400;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: inherit;
    &:hover,
    &:focus {
      color: inherit;
    }
  }

  input,
  button {
    font-size: inherit;
  }
`
