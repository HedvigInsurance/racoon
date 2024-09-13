import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { xStack, yStack } from '../../patterns'
import { sprinkles, tokens } from '../../theme'

export const cardRoot = recipe({
  base: [
    yStack({ gap: 'md' }),
    {
      borderRadius: tokens.radius.xl,
    },
  ],
  variants: {
    variant: {
      primary: {
        background: tokens.colors.backgroundStandard,
        border: '1px solid',
        borderColor: tokens.colors.borderPrimary,
        boxShadow: tokens.shadow.card,
      },
    },
    size: {
      md: sprinkles({ padding: 'lg' }),
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export const cardHeader = style([
  xStack({ gap: 'sm' }),
  {
    position: 'relative',
  },
])

export const cardAside = style({
  position: 'absolute',
  top: 0,
  insetInlineEnd: 0,
})
