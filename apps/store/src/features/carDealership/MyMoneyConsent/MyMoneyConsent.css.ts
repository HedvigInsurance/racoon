import { style } from '@vanilla-extract/css'
import { themeVars } from 'ui'

export const consentWrapper = style({
  display: 'grid',
  gridTemplateColumns: '1.5rem 1fr',
  rowGap: themeVars.space.xxs,
  columnGap: themeVars.space.md,
  alignItems: 'center',
  padding: themeVars.space.md,
  backgroundColor: themeVars.colors.opaque1,
  borderRadius: themeVars.radius.md,
  lineHeight: 1.4,
})

export const consentBody = style({
  gridColumn: '2',
})

export const trigger = style({
  marginLeft: themeVars.space.xxs,
  textDecoration: 'underline',
  textDecorationThickness: '1px',
  textUnderlineOffset: '1.5px',

  selectors: {
    '[data-state="open"] &': {
      display: 'none',
    },
  },
})

export const checkboxRoot = style({
  display: 'flex',
  placeContent: 'center',
  backgroundColor: themeVars.colors.opaque1,
  width: '1.5rem',
  height: '1.5rem',
  padding: themeVars.space.xxs,
  border: `1.5px solid ${themeVars.colors.gray500}`,
  borderRadius: '0.25rem',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: themeVars.colors.gray300,
  },

  ':focus': {
    borderColor: themeVars.colors.borderOpaque3,
  },

  selectors: {
    '&[data-state="checked"]': {
      backgroundColor: themeVars.colors.gray1000,
      borderColor: themeVars.colors.gray1000,
    },
  },
})

export const checkboxIndicator = style({
  display: 'flex',
  placeItems: 'center',
  color: themeVars.colors.textNegative,
})
