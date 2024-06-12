import { globalStyle, keyframes, style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme'

// Using globalStyle until vanilla-extract support properties
// https://github.com/vanilla-extract-css/vanilla-extract/pull/1092
globalStyle('@property --gradient-position', {
  // @ts-expect-error not supported by Vanilla-extract types yet
  syntax: `'<percentage>'`,
  inherits: false,
  initialValue: '75%',
})

const gradientAnimation = keyframes({
  '0%': {
    // @ts-expect-error not supported by Vanilla-extract types yet
    '--gradient-position': '0%',
  },
  '100%': {
    // @ts-expect-error not supported by Vanilla-extract types yet
    '--gradient-position': '75%',
  },
})

export const contentWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: tokens.space[10],

  height: '80vh',
  background: `linear-gradient(180deg, ${tokens.colors.signalAmberFill} var(--gradient-position), ${tokens.colors.backgroundStandard})`,
  animation: `${gradientAnimation} 2s cubic-bezier(0.65, 0.05, 0.36, 1)`,
  animationIterationCount: 1,
})
