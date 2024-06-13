import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const handledMessage = style({
  maxWidth: '400px',
  margin: 'auto',
  paddingBlock: tokens.space.xxxl,
})

export const wrapper = style({
  maxWidth: '400px',
  margin: 'auto',
})

export const checkbox = style({
  display: 'grid',
  gridTemplateColumns: '1.5rem 1fr',
  rowGap: tokens.space.xxs,
  columnGap: tokens.space.md,
  alignItems: 'center',
  padding: tokens.space.md,
  backgroundColor: tokens.colors.opaque1,
  borderRadius: tokens.radius.md,
  lineHeight: 1.4,
})

export const checkboxRoot = style({
  display: 'flex',
  placeContent: 'center',
  backgroundColor: tokens.colors.opaque1,
  width: '1.5rem',
  height: '1.5rem',
  padding: tokens.space.xxs,
  border: `1.5px solid ${tokens.colors.gray500}`,
  borderRadius: '0.25rem',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: tokens.colors.gray300,
  },

  ':focus': {
    borderColor: tokens.colors.borderOpaque3,
  },

  selectors: {
    '&[data-state="checked"]': {
      backgroundColor: tokens.colors.gray1000,
      borderColor: tokens.colors.gray1000,
    },
  },
})

export const checkboxIndicator = style({
  display: 'flex',
  placeItems: 'center',
  color: tokens.colors.textNegative,
})
