import { style } from '@vanilla-extract/css'
import { theme } from 'ui'

export const consentWrapper = style({
  display: 'grid',
  gridTemplateColumns: '1.5rem 1fr',
  rowGap: theme.space.xxs,
  columnGap: theme.space.md,
  alignItems: 'center',
  padding: theme.space.md,
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.md,
  lineHeight: 1.4,
})

export const consentBody = style({
  gridColumn: '2',
})

export const checkboxRoot = style({
  display: 'flex',
  placeContent: 'center',
  backgroundColor: theme.colors.opaque1,
  width: '1.5rem',
  height: '1.5rem',
  padding: theme.space.xxs,
  border: `1.5px solid ${theme.colors.gray500}`,
  borderRadius: '0.25rem',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: theme.colors.gray300,
  },

  ':focus': {
    borderColor: theme.colors.borderOpaque3,
  },

  selectors: {
    '&[data-state="checked"]': {
      backgroundColor: theme.colors.gray1000,
      borderColor: theme.colors.gray1000,
    },
  },
})

export const checkboxIndicator = style({
  display: 'flex',
  placeItems: 'center',
  color: theme.colors.textNegative,
})
