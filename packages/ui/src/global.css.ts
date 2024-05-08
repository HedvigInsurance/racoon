/***
 The following CSS reset is heavily inspired by:
 https://github.com/elad2412/the-new-css-reset
 ***/

// Remove all the styles of the "User-Agent-Stylesheet", except for the 'display' property
import { globalStyle } from '@vanilla-extract/css'
import { animationAllowed, colors } from './theme'
import {
  bodyBgColor,
  bodyTextColor,
  footerBgColor,
  headerBgTransparentColor,
  inputBgColor,
  inputSelectedItemBgColor,
} from './theme/vars.css'

globalStyle('*:where(:not(iframe, canvas, img, svg, video):not(svg *))', {
  all: 'unset',
  display: 'revert',
})

// Preferred box-sizing model
globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
})

globalStyle('html', {
  WebkitTapHighlightColor: 'transparent',
  '@media': {
    [animationAllowed]: {
      scrollBehavior: 'smooth',
    },
  },
})

globalStyle('body', {
  vars: {
    [bodyBgColor]: colors.backgroundStandard,
    [bodyTextColor]: colors.textPrimary,
    [footerBgColor]: colors.gray100,
    [headerBgTransparentColor]: colors.grayTranslucentDark1000,
    [inputBgColor]: colors.translucent1,
    [inputSelectedItemBgColor]: colors.backgroundStandard,
  },
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  color: bodyTextColor,
  backgroundColor: bodyBgColor,
})

// Responsive images
globalStyle('img', {
  maxWidth: '100%',
  height: 'auto',
})

// Sane display value for media elements
globalStyle('img, iframe, picture, video, canvas, svg', {
  display: 'block',
})

// Remove default list styles
globalStyle('ol, ul', {
  listStyle: 'none',
  margin: 0,
  padding: 0,
})

// Reapply the pointer cursor for anchor tags
globalStyle('a, button', {
  cursor: 'revert',
})

// Fix the feature of 'hidden' attribute.
//   "display:revert;" revert to element instead of attribute
globalStyle(':where([hidden])', {
  display: 'none',
})

// Isolate app stacking context, so it doesn't mess up with portals
globalStyle('#__next', {
  isolation: 'isolate',
})

export default {}
