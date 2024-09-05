import { style } from '@vanilla-extract/css'
import { sprinkles, tokens } from 'ui'

export const tableWrapper = style([
  sprinkles({
    paddingBlock: 'xl',
    paddingInline: 'xl',
  }),
  { backgroundColor: tokens.colors.surfaceOpaquePrimary, borderRadius: tokens.radius.xl },
])
