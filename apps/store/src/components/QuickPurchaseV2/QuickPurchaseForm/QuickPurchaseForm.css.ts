import { style } from '@vanilla-extract/css'
import { responsiveStyles, tokens, xStack, yStack } from 'ui'

export const wrapper = style([
  yStack({
    gap: 'xs',
  }),
  {
    maxWidth: '30rem',
    marginInline: 'auto',
    padding: tokens.space.xs,
    border: `1px solid ${tokens.colors.borderTranslucent1}`,
    borderRadius: tokens.radius.xl,
    backgroundColor: tokens.colors.backgroundStandard,
    boxShadow: tokens.shadow.card,
    ...responsiveStyles({
      lg: {
        padding: tokens.space.lg,
      },
    }),
  },
])

export const productSingleOption = style([
  xStack({
    gap: 'xs',
    alignItems: 'center',
  }),
  {
    marginBottom: tokens.space.xs,
    ...responsiveStyles({
      lg: {
        gap: tokens.space.sm,
        marginBottom: tokens.space.xs,
      },
    }),
  },
])
