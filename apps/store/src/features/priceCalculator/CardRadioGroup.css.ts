import { createVar, style } from '@vanilla-extract/css'
import { tokens, yStack } from 'ui'

export const labelBackground = createVar('cardRadioGroupLabelBackground')

export const item = style([
  yStack({ gap: 'sm' }),
  {
    borderRadius: tokens.radius.md,
    padding: tokens.space.md,
    cursor: 'pointer',

    vars: {
      [tokens.colors.buttonSecondary]: tokens.colors.grayTranslucentDark900,
      [tokens.colors.buttonSecondaryHover]: tokens.colors.grayTranslucentDark800,
      [labelBackground]: tokens.colors.grayTranslucent100,
    },

    selectors: {
      '&[data-state=checked]': {
        vars: {
          [tokens.colors.textPrimary]: tokens.colors.textNegative,
          [tokens.colors.textSecondary]: tokens.colors.gray500,
          [labelBackground]: tokens.colors.grayTranslucentDark900,
        },
      },
    },
  },
])
