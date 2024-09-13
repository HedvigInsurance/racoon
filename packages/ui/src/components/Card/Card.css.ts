import { createVar, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { xStack, yStack } from '../../patterns'
import { tokens } from '../../theme'

const cardPadding = createVar()

export const cardRoot = recipe({
  base: [
    yStack({ gap: 'md' }),
    {
      position: 'relative',
      borderRadius: tokens.radius.xl,
      padding: cardPadding,
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
      secondary: {
        background: tokens.colors.surfaceOpaqueSecondary,
      },
    },

    size: {
      md: {
        vars: {
          [cardPadding]: tokens.space.lg,
        },
      },
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
  top: cardPadding,
  insetInlineEnd: cardPadding,
})
