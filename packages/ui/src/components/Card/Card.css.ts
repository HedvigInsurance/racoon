import { createVar, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { xStack, yStack } from '../../patterns'
import { tokens } from '../../theme'

const cardPadding = createVar()

export const cardRoot = recipe({
  base: {
    position: 'relative',
    padding: cardPadding,
  },
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
      md: [
        yStack({ gap: 'sm' }),
        {
          borderRadius: tokens.radius.md,
          vars: {
            [cardPadding]: tokens.space.md,
          },
        },
      ],
      lg: [
        yStack({ gap: 'md' }),
        {
          borderRadius: tokens.radius.xl,
          vars: {
            [cardPadding]: tokens.space.lg,
          },
        },
      ],
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'lg',
  },
})

export const cardHeader = style([
  xStack({ gap: 'sm' }),
  {
    position: 'relative',
  },
])

export const cardAside = style({
  // @ts-expect-error: Hack to make sure aside content is always absolute. Should probably rething how we achieve this
  // The main reason right now is giving tooltip trigger an explicit relative position, which is overriding this rule
  position: 'absolute !important',
  top: cardPadding,
  insetInlineEnd: cardPadding,
  zIndex: 1,
})
