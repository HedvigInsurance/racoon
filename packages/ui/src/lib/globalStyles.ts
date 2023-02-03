import { css } from '@emotion/react'
import { getColor } from './theme/theme'

export const globalStyles = css`
  /***
    The following CSS reset is heavily inspired by:
    https://github.com/elad2412/the-new-css-reset
  ***/

  /*
    Remove all the styles of the "User-Agent-Stylesheet", except for the 'display' property
  */
  *:where(:not(iframe, canvas, img, svg, video):not(svg *)) {
    all: unset;
    display: revert;
  }

  /* Preferred box-sizing model */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }
  @media screen and (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }

  /* Set default font rules and color on body */
  body {
    color: ${getColor('textPrimary')};
    background-color: ${getColor('light')};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Responsive images */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Sane display value for media elements */
  img,
  iframe,
  picture,
  video,
  canvas,
  svg {
    display: block;
  }

  /* Remove default list styles */
  ol,
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Reapply the pointer cursor for anchor tags */
  a,
  button {
    cursor: revert;
  }

  /* Fix the feature of 'hidden' attribute.
   "display:revert;" revert to element instead of attribute */
  :where([hidden]) {
    display: none;
  }
`
