import { style, styleVariants } from '@vanilla-extract/css'
import { minWidth, theme } from 'ui/src/theme'
import { inputBgColor, inputSelectedItemBgColor } from 'ui/src/theme/vars.css'

export const cardHeader = style({
  display: 'grid',
  columnGap: theme.space.md,
  alignItems: 'center',
  width: '100%',
  paddingBottom: theme.space.lg,
  ':hover': {
    cursor: 'pointer',
  },
})

export const cardHeaderRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
})

const cardBase = style({
  borderRadius: theme.radius.md,
  padding: theme.space.md,
  backgroundColor: theme.colors.opaque1,
  selectors: {
    [`&:has(${cardHeader}:focus-visible)`]: {
      boxShadow: theme.shadow.focus,
      borderRadius: theme.radius.sm,
    },
  },
  '@media': {
    '(hover: hover)': {
      selectors: {
        [`&:has(${cardHeader}:hover)`]: {
          backgroundColor: theme.colors.grayTranslucent200,
        },
      },
    },
    [minWidth.lg]: {
      padding: theme.space.lg,
    },
  },
})
export const card = styleVariants({
  edit: [
    cardBase,
    {
      vars: {
        [inputBgColor]: theme.colors.backgroundStandard,
        [inputSelectedItemBgColor]: theme.colors.opaque1,
      },
    },
  ],
  view: [cardBase],
})

export const cardGreenVariant = style({
  backgroundColor: theme.colors.signalGreenFill,
  '@media': {
    '(hover: hover)': {
      selectors: {
        [`&:has(${cardHeader}:hover)`]: {
          backgroundColor: theme.colors.green200,
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

export const editButton = style({
  marginBottom: theme.space.xs,
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

export const separator = style({
  width: '100%',
  height: 1,
  backgroundColor: theme.colors.borderOpaque2,
})
