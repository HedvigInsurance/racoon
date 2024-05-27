import { style, styleVariants } from '@vanilla-extract/css'
import { minWidth, theme } from 'ui/src/theme'

export const purchaseFormTop = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: theme.space.xl,
  minHeight: '80vh',
  paddingInline: theme.space.md,
  paddingBottom: theme.space.xl,
  '@media': {
    [minWidth.lg]: { minHeight: 'revert' },
  },
})

export const purchaseFormSection = style({
  position: 'relative',
})

export const purchaseFormStickyButtonWrapper = style({
  paddingInline: theme.space.md,
  '@media': {
    [minWidth.lg]: { display: 'none' },
  },
})

const PURCHASE_FORM_MAX_WIDTH = '21rem'
export const purchaseFormResponsiveBlock = style({
  width: '100%',
  '@media': {
    [minWidth.sm]: {
      width: '100%',
      maxWidth: PURCHASE_FORM_MAX_WIDTH,
      margin: '0 auto',
    },
  },
})

export const purchaseFormHeroWrapper = styleVariants({
  base: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  compact: {
    rowGap: theme.space.xl,
  },
  full: {
    rowGap: theme.space[9],
  },
})

export const purchaseFormPriceLoaderWrapper = style({
  paddingTop: theme.space.xxl,
  maxWidth: '16rem',
  marginInline: 'auto',
})
