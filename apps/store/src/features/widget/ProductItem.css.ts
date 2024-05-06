import { style } from '@vanilla-extract/css'
import { minWidth, theme } from 'ui/src/theme'

export const hoverable = style({
  ':hover': {
    cursor: 'pointer',
  },
})

export const card = style({
  borderRadius: theme.radius.md,
  padding: theme.space.md,
  paddingBottom: 0,
  backgroundColor: theme.colors.opaque1,
  '@media': {
    '(hover: hover)': {
      selectors: {
        [`&:has(${hoverable}:hover)`]: {
          backgroundColor: theme.colors.grayTranslucent200,
        },
      },
    },
    [minWidth.lg]: {
      padding: theme.space.lg,
      paddingBottom: `calc(${theme.space.lg} - ${theme.space.md})`,
    },
  },
})

export const cardGreenVariant = style({
  backgroundColor: theme.colors.signalGreenFill,
  '@media': {
    '(hover: hover)': {
      selectors: {
        [`&:has(${hoverable}:hover)`]: {
          backgroundColor: theme.colors.green200,
        },
      },
    },
  },
})

export const cardHeader = style({
  display: 'grid',
  columnGap: theme.space.md,
  alignItems: 'center',
  paddingBottom: theme.space.md,
})

export const cardHeaderRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
})

export const cardFooter = style({
  display: 'grid',
  gridAutoFlow: 'column',
  columnGap: theme.space.xs,
  paddingBottom: theme.space.md,
})

export const deleteButton = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1.5rem',
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  backgroundColor: theme.colors.grayTranslucent200,
  cursor: 'pointer',
  '@media': {
    '(hover: hover)': {
      ':hover': {
        backgroundColor: theme.colors.grayTranslucent300,
      },
    },
  },
})

export const fakeInput = style({
  width: '100%',
  height: '4.5rem',
  padding: theme.space.sm,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.translucent1,
})

export const fakeInputRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const details = style({
  paddingBottom: theme.space.md,
})

export const detailsHeader = style({
  paddingBlock: theme.space.md,
})
