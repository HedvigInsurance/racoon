import { style } from '@vanilla-extract/css'
import { minWidth, tokens } from 'ui'

export const cardHeaderButton = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: tokens.space.md,
  alignItems: 'center',
  width: '100%',
  paddingBottom: tokens.space.lg,
  ':hover': {
    cursor: 'pointer',
  },
})

export const card = style({
  borderRadius: tokens.radius.md,
  padding: tokens.space.md,
  backgroundColor: tokens.colors.opaque1,
  selectors: {
    [`&:has(${cardHeaderButton}:focus-visible)`]: {
      boxShadow: tokens.shadow.focus,
      borderRadius: tokens.radius.sm,
    },
  },
  '@media': {
    '(hover: hover)': {
      selectors: {
        [`&:has(${cardHeaderButton}:hover)`]: {
          backgroundColor: tokens.colors.grayTranslucent200,
        },
      },
    },
    [minWidth.lg]: {
      padding: tokens.space.lg,
    },
  },
})

export const cardHeader = style({ position: 'relative' })

export const cardGreenVariant = style({
  backgroundColor: tokens.colors.signalGreenFill,
  '@media': {
    '(hover: hover)': {
      selectors: {
        [`&:has(${cardHeaderButton}:hover)`]: {
          backgroundColor: tokens.colors.green200,
        },
      },
    },
  },
})

export const priceSection = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
})

export const deleteButton = style({
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1.5rem',
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  backgroundColor: tokens.colors.grayTranslucent200,
  cursor: 'pointer',
  ':focus-visible': {
    boxShadow: tokens.shadow.focus,
  },
  '@media': {
    '(hover: hover)': {
      ':hover': {
        backgroundColor: tokens.colors.grayTranslucent300,
      },
    },
  },
})

export const editButton = style({
  marginBottom: tokens.space.xs,
})

export const separator = style({
  width: '100%',
  height: 1,
  backgroundColor: tokens.colors.borderOpaque2,
})
