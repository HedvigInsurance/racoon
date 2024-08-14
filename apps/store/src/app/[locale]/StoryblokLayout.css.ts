import { style } from '@vanilla-extract/css'
import { bodyBgColor, bodyTextColor, footerBgColor } from 'ui/src/theme/vars.css'
import { tokens } from 'ui'

export const wrapper = style({
  display: 'grid',
  // 'Sticky' footer at the bottom of the page.
  // Based on 'GlobalStory' type a 'header' and a 'footer' are always expected
  gridTemplateRows: 'auto 1fr auto',
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
