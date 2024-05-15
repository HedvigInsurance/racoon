import { style, styleVariants } from '@vanilla-extract/css'
import { minWidth, themeVars } from 'ui/src/theme'
import { inputBgColor, inputSelectedItemBgColor } from 'ui/src/theme/vars.css'

export const cardHeader = style({
  display: 'grid',
  columnGap: themeVars.space.md,
  alignItems: 'center',
  width: '100%',
  paddingBottom: themeVars.space.lg,
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
  borderRadius: themeVars.radius.md,
  padding: themeVars.space.md,
  backgroundColor: themeVars.colors.opaque1,
  selectors: {
    [`&:has(${cardHeader}:focus-visible)`]: {
      boxShadow: themeVars.shadow.focus,
      borderRadius: themeVars.radius.sm,
    },
  },
  '@media': {
    '(hover: hover)': {
      selectors: {
        [`&:has(${cardHeader}:hover)`]: {
          backgroundColor: themeVars.colors.grayTranslucent200,
        },
      },
    },
    [minWidth.lg]: {
      padding: themeVars.space.lg,
    },
  },
})
export const card = styleVariants({
  edit: [
    cardBase,
    {
      vars: {
        [inputBgColor]: themeVars.colors.backgroundStandard,
        [inputSelectedItemBgColor]: themeVars.colors.opaque1,
      },
    },
  ],
  view: [cardBase],
})

export const cardGreenVariant = style({
  backgroundColor: themeVars.colors.signalGreenFill,
  '@media': {
    '(hover: hover)': {
      selectors: {
        [`&:has(${cardHeader}:hover)`]: {
          backgroundColor: themeVars.colors.green200,
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
  backgroundColor: themeVars.colors.grayTranslucent200,
  cursor: 'pointer',
  '@media': {
    '(hover: hover)': {
      ':hover': {
        backgroundColor: themeVars.colors.grayTranslucent300,
      },
    },
  },
})

export const editButton = style({
  marginBottom: themeVars.space.xs,
})

export const fakeInput = style({
  width: '100%',
  height: '4.5rem',
  padding: themeVars.space.sm,
  borderRadius: themeVars.radius.sm,
  backgroundColor: themeVars.colors.translucent1,
})

export const fakeInputRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const separator = style({
  width: '100%',
  height: 1,
  backgroundColor: themeVars.colors.borderOpaque2,
})

export const compareButtonWrapper = style({
  padding: themeVars.space.md,
})
