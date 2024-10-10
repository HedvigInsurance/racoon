import { style } from '@vanilla-extract/css'
import { sprinkles } from 'ui'

export const item = style([
  sprinkles({ padding: 'lg' }),
  // We need zero gap to prevent AnimatePresence from causing height jump when element is added/removed
  {
    gap: 'unset',
  },
])
