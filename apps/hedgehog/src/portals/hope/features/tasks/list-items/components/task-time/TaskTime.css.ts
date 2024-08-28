import { theme } from '@hedvig-ui/redesign/theme'
import { styleVariants } from '@vanilla-extract/css'

const TaskTime = styleVariants({
  base: {
    width: '4rem',
    textAlign: 'center',
  },
  neutral: {
    color: theme.colors.textSecondary,
  },
  success: {
    color: theme.colors.signalGreenElement,
  },
  warning: {
    color: theme.colors.amber700,
  },
  danger: {
    color: theme.colors.signalRedElement,
  },
})

export const css = {
  TaskTime,
}
