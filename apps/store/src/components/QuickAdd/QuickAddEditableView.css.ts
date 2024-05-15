import { style } from '@vanilla-extract/css'
import { themeVars, minWidth } from 'ui/src/theme'

export const card = style({
  padding: '0.875rem',
  border: `1px solid ${themeVars.colors.borderTranslucent1}`,
  borderRadius: themeVars.radius.md,
  // TODO: replace this to themeVars.colors.signalbluefill when we update Uikit colors
  backgroundColor: 'hsl(201, 84%, 90%)',

  '@media': {
    [minWidth.md]: {
      padding: themeVars.space.md,
    },
    [minWidth.lg]: {
      padding: themeVars.space.lg,
    },
  },
})

export const cardHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: themeVars.space.xs,

  '@media': {
    [minWidth.md]: {
      gap: themeVars.space.md,
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
  fontSize: themeVars.fontSizes.xs,
})

// TODO: remove !important when we don't have issues with vanilla extract duplicated
// styles anymore
export const formField = style({
  backgroundColor: `${themeVars.colors.offWhite} !important`,
})

export const priceWrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: themeVars.space.sm,
})

export const actionsWrapper = style({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  gap: themeVars.space.xs,
  paddingTop: themeVars.space.md,
})
