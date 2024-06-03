import { keyframes, style } from '@vanilla-extract/css'
import { theme } from 'ui/src/theme'

const pulsingAnimation = keyframes({
  '0%': { opacity: 0.5 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.5 },
})

export const skeleton = style({
  backgroundColor: theme.colors.grayTranslucent100,
  borderRadius: theme.radius.sm,
  animation: `${pulsingAnimation} 1.5s ease-in-out infinite`,
})
