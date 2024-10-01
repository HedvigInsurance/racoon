import { style } from '@vanilla-extract/css'
import { tokens, yStack } from 'ui'

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
    margin: 'auto',
    paddingBottom: `calc(${tokens.space[10]} * 1.5)`,
  },
])
