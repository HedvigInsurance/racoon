import { style } from '@vanilla-extract/css'
import { colors } from 'ui/src/theme'
import {
  bodyBgColor,
  bodyTextColor,
  footerBgColor,
  headerBgTransparentColor,
} from 'ui/src/theme/vars.css'

export const wrapper = style({
  minHeight: '100vh',
  isolation: 'isolate',
  selectors: {
    '&:has(main[data-dark-background=true])': {
      vars: {
        [bodyBgColor]: colors.dark,
        [bodyTextColor]: colors.textNegative,
        [footerBgColor]: colors.dark,
        [headerBgTransparentColor]: 'hsla(0, 0%, 7%, 0)',
      },
      color: bodyTextColor,
      backgroundColor: bodyBgColor,
    },
  },
})
