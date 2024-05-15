import { style } from '@vanilla-extract/css'
import { tokens, minWidth } from 'ui'

export const card = style({
  padding: '0.875rem',
  border: `1px solid ${tokens.colors.borderTranslucent1}`,
  borderRadius: tokens.radius.md,
  // TODO: replace this to tokens.colors.signalbluefill when we update Uikit colors
  backgroundColor: 'hsl(201, 84%, 90%)',

  '@media': {
    [minWidth.md]: {
      padding: tokens.space.md,
    },
    [minWidth.lg]: {
      padding: tokens.space.lg,
    },
  },
})

export const cardHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.space.xs,

  '@media': {
    [minWidth.md]: {
      gap: tokens.space.md,
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

// TODO: remove !important when we don't have issues with vanilla extract duplicated
// styles anymore
export const formField = style({
  backgroundColor: `${tokens.colors.offWhite} !important`,
})

export const priceWrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: tokens.space.sm,
})

export const actionsWrapper = style({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  gap: tokens.space.xs,
  paddingTop: tokens.space.md,
})
