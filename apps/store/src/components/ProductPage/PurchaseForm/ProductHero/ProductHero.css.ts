import { style } from '@vanilla-extract/css'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import { theme } from 'ui'

export const wrapper = style([
  sprinkles({ display: 'flex', flexDirection: 'column', alignItems: 'center' }),
  {
    rowGap: theme.space.md,
  },
])

export const pillow = style({
  marginInline: 'auto',
})

export const textWrapper = style({
  rowGap: theme.space.sm,
})
