import { style, createVar } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme/theme.css'

export const indicatorBorderColor = createVar('indicatorBorderColor')
export const indicatorFillColor = createVar('indicatorFillColor')
export const indicatorMarkerColor = createVar('indicatorMarkerColor')

export const icon = style({
  color: indicatorFillColor,
  selectors: {
    '&[data-state=checked]': {
      vars: {
        [indicatorBorderColor]: tokens.colors.signalGreenElement,
        [indicatorFillColor]: tokens.colors.signalGreenElement,
        [indicatorMarkerColor]: tokens.colors.light,
      },
    },
    '&[data-state=unchecked]': {
      vars: {
        [indicatorBorderColor]: tokens.colors.borderTranslucent2,
        [indicatorFillColor]: 'transparent',
        [indicatorMarkerColor]: 'transparent',
      },
    },
    '&[data-disabled][data-state=checked]': {
      vars: {
        [indicatorBorderColor]: tokens.colors.grayTranslucent400,
        [indicatorFillColor]: tokens.colors.grayTranslucent400,
        [indicatorMarkerColor]: tokens.colors.light,
      },
    },
  },
})
