import { style } from '@vanilla-extract/css'
import { tokens, minWidth } from 'ui'

export const card = style({
  padding: tokens.space.md,
  border: `1px solid ${tokens.colors.borderTranslucent1}`,
  borderRadius: tokens.radius.md,
  // TODO: replace this to tokens.colors.signalbluefill when we update Uikit colors
  backgroundColor: 'hsl(201, 84%, 90%)',

  '@media': {
    [minWidth.lg]: {
      padding: tokens.space.lg,
    },
  },
})

export const pillowWrapper = style({
  width: '3rem',
  aspectRatio: '1 / 1',
})

export const pillow = style({
  selectors: {
    '&:nth-of-type(2)': {
      marginLeft: 'auto',
    },
  },
})

export const link = style({
  ':hover': {
    textDecoration: 'underline',
  },
})

export const alignedBadge = style({
  alignSelf: 'flex-start',
  marginLeft: 'auto',
  fontSize: tokens.fontSizes.xs,
})

export const priceWrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: tokens.space.xl,
})

export const productDetail = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const productUsp = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: tokens.space.xs,
  paddingBlock: tokens.space.md,

  selectors: {
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${tokens.colors.borderTranslucent1}`,
    },
  },
})
