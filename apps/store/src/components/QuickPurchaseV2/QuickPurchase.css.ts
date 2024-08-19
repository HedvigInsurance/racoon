import { style } from '@vanilla-extract/css'
import { tokens } from 'ui'

export const wrapper = style({
  selectors: {
    '&[data-nested="false"]': {
      paddingInline: tokens.space.md,
    },
  },
})
