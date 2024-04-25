import { style } from '@vanilla-extract/css'
import { theme, minWidth } from 'ui/src/theme'

export const card = style({
  padding: theme.space.md,
  border: `1px solid ${theme.colors.borderTranslucent1}`,
  borderRadius: theme.radius.md,
  // TODO: replace this to theme.colors.signalbluefill when we update Uikit colors
  backgroundColor: 'hsl(201, 84%, 90%)',

  '@media': {
    [minWidth.lg]: {
      padding: theme.space.lg,
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
  fontSize: theme.fontSizes.xs,
})

export const priceWrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.space.xl,
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
  columnGap: theme.space.xs,
  paddingBlock: theme.space.md,

  selectors: {
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${theme.colors.borderTranslucent1}`,
    },
  },
})
