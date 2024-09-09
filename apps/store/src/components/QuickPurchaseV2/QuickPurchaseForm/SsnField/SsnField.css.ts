import { style } from '@vanilla-extract/css'
import { sprinkles, tokens } from 'ui'
import { MEDIUM_HEIGHT } from '@/components/TextField/TextField.css'

export const fakeInput = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBlock: 'sm',
    paddingLeft: 'md',
    paddingRight: 'sm',
  }),
  {
    height: MEDIUM_HEIGHT,
    backgroundColor: tokens.colors.surfaceOpaquePrimary,
    borderRadius: tokens.radius.md,
  },
])
