import { style } from '@vanilla-extract/css'
import { bodyBgColor, bodyTextColor, footerBgColor } from 'ui/src/theme/vars.css'
import { tokens } from 'ui'

export const wrapper = style({
  minHeight: '100vh',
  isolation: 'isolate',
  selectors: {
    '&:has(main[data-dark-background=true])': {
      vars: {
        [bodyBgColor]: tokens.colors.dark,
        [bodyTextColor]: tokens.colors.textNegative,
        [footerBgColor]: tokens.colors.dark,
      },
      color: bodyTextColor,
      backgroundColor: bodyBgColor,
    },
  },
})
