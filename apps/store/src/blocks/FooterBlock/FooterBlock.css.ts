import { style } from '@vanilla-extract/css'
import { hoverStyles, minWidth, tokens } from 'ui/src/theme'
import { footerBgColor } from 'ui/src/theme/vars.css'

export const wrapperStyle = style({
  backgroundColor: footerBgColor,
  paddingTop: tokens.space.xxl,

  // Clear floating price calculator button
  paddingBottom: tokens.space[10],
})

export const languageSelectForm = style({
  gridColumn: '1 / -1',

  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: tokens.space.md,

  '@media': {
    [minWidth.md]: {
      gridRow: 2,
      gridColumn: '7 / -1',
    },
    [minWidth.xxl]: {
      gridColumn: '7 / span 4',
    },
  },
})

export const disclaimerStyle = style({
  gridColumn: '1 / -1',
  textAlign: 'center',
  '@media': {
    [minWidth.md]: {
      gridRow: 2,
      gridColumn: 'span 6',
      textAlign: 'left',
    },
    [minWidth.xxl]: {
      gridColumn: '3 / span 2',
    },
  },
})

export const gridLayout = style({
  rowGap: tokens.space.xxl,
})

export const gridColumn = style({
  gridColumn: 'span 6',

  '@media': {
    [minWidth.md]: {
      gridColumn: 'span 3',
    },
    [minWidth.xxl]: {
      gridColumn: 'auto / span 2',
      ':first-of-type': { gridColumnStart: 3 },
    },
  },
})

// Potentially reusable
const textLink = style({
  textDecorationColor: tokens.colors.gray400,
  textDecorationThickness: 'clamp(1px, 0.07em, 2px);',
  textUnderlineOffset: 5,

  ...hoverStyles({
    textDecoration: 'underline',
  }),
})

export const footerLink = style([
  textLink,
  {
    display: 'block',
  },
])
