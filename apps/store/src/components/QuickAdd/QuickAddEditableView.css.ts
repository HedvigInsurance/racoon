import { style } from '@vanilla-extract/css'
import { theme, minWidth } from 'ui/src/theme'

export const card = style({
  padding: theme.space.md,
  border: `1px solid ${theme.colors.borderTranslucent1}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.blueFill1,

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

export const stepperInput = style({
  backgroundColor: theme.colors.offWhite,
})

export const startDateInput = style({
  backgroundColor: theme.colors.offWhite,
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