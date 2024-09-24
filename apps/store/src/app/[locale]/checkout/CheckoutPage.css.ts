import { style } from '@vanilla-extract/css'
import { yStack } from 'ui'

export const container = style([
  yStack({
    gap: 'xxxl',
    paddingInline: 'md',
    paddingBlock: 'xxl',
  }),
  {
    maxWidth: '500px',
    margin: 'auto',
  },
])
