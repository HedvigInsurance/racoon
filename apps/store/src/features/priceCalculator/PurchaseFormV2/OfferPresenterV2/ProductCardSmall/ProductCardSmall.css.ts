import { style } from '@vanilla-extract/css'
import { tokens, yStack } from 'ui'

export const card = style([
  yStack({ gap: 'md', padding: 'lg' }),
  {
    border: `solid 1px ${tokens.colors.borderTranslucent1}`,
    borderRadius: tokens.radius.xl,
    boxShadow: tokens.shadow.card,
  },
])
