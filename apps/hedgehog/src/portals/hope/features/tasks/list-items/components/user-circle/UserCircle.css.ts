import { theme } from '@hedvig-ui/redesign/theme'
import { styleVariants } from '@vanilla-extract/css'

const UserCircle = styleVariants({
  base: {
    display: 'grid',
    placeItems: 'center',

    height: theme.fontSizes.xxl,
    aspectRatio: '1/1',
    borderRadius: '50%',

    color: theme.colors.textNegative,
    fontWeight: 'bold',
  },
  neutral: {
    backgroundColor: theme.colors.gray500,
  },
  darkNeutral: {
    backgroundColor: theme.colors.gray700,
  },
  warning: {
    backgroundColor: theme.colors.amber200,
    color: theme.colors.textPrimary,
  },
  darkWarning: {
    backgroundColor: theme.colors.amber500,
    color: theme.colors.textPrimary,
  },
  danger: {
    backgroundColor: theme.colors.signalRedHighlight,
  },
})

export const css = { UserCircle }
