import { style } from '@vanilla-extract/css'
import { colors } from 'ui/src/theme'
import { bodyBgColor, bodyTextColor, footerBgColor } from 'ui/src/theme/vars.css'

export const wrapper = style({
  minHeight: '100vh',
  isolation: 'isolate',
  selectors: {
    '&:has(main[data-dark-background=true])': {
      vars: {
        [bodyBgColor]: colors.dark,
        [bodyTextColor]: colors.textNegative,
        [footerBgColor]: colors.dark,
      },
      color: bodyTextColor,
      backgroundColor: bodyBgColor,
    },
  },
})
