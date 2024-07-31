import { createVar, style } from '@vanilla-extract/css'
import { tokens, yStack } from 'ui'

export const labelBackground = createVar('cardRadioGroupLabelBackground')

export const item = style([
  yStack({ gap: 'sm' }),
  {
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.opaque1,
    padding: tokens.space.md,
    cursor: 'pointer',

    vars: {
      [tokens.colors.buttonSecondary]: tokens.colors.grayTranslucentDark900,
      [tokens.colors.buttonSecondaryHover]: tokens.colors.grayTranslucentDark800,
      [labelBackground]: tokens.colors.grayTranslucent100,
    },

    selectors: {
      '&[data-state=checked]': {
        backgroundColor: tokens.colors.buttonPrimary,
        vars: {
          [tokens.colors.textPrimary]: tokens.colors.textNegative,
          [tokens.colors.textSecondary]: tokens.colors.gray500,
          [labelBackground]: tokens.colors.grayTranslucentDark900,
        },
      },
    },
  },
])

export const indicatorBorderColor = createVar('indicatorBorderColor')
export const indicatorInnerColor = createVar('indicatorInnerColor')

export const indicator = style({
  vars: {
    [indicatorBorderColor]: tokens.colors.borderTranslucent2,
    [indicatorInnerColor]: tokens.colors.light,
  },
  selectors: {
    '&[data-state=checked]': {
      color: tokens.colors.signalGreenElement,
    },
    '&[data-state=unchecked]': {
      color: 'transparent',
      vars: {
        [indicatorInnerColor]: 'transparent',
      },
    },
  },
})
