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

export const Wrapper = style({
  width: '3rem',
  aspectRatio: '1 / 1',
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

// TODO: remove !important when we don't have issues with vanilla extract duplicated
// styles anymore
export const formField = style({
  backgroundColor: `${theme.colors.offWhite} !important`,
})

export const priceWrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.sm,
})

export const actionsWrapper = style({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  gap: theme.space.xs,
})
