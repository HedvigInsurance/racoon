import { style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'
import { sprinkles } from 'ui/src/theme/sprinkles.css'

export const productItem = style([
  sprinkles({ display: 'flex', alignItems: 'flex-start' }),
  {
    gap: theme.space.md,
  },
])

export const productItemTitle = sprinkles({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
})
