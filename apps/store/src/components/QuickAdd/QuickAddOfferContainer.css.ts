import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'
import { sprinkles } from 'ui/src/theme/sprinkles.css'

export const quickAddSection = style([
  sprinkles({ display: 'flex', flexDirection: 'column' }),
  {
    rowGap: theme.space.md,
  },
])
