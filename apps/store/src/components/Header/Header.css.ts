import { style } from '@vanilla-extract/css'
import { theme } from 'ui'

export const focusableStyles = style({
  cursor: 'pointer',

  ':focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
})
