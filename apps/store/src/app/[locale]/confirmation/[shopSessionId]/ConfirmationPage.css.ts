import { style } from '@vanilla-extract/css'
import { yStack } from 'ui'

export const container = style([
  yStack({
    gap: {
      _: 'xxl',
      sm: 'xxxl',
    },
    paddingInline: 'md',
    paddingTop: 'xxl',
  }),
  {
    maxWidth: '500px',
    marginInline: 'auto',
  },
])