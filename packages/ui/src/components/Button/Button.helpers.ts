import { buttonSizeStyles } from './Button.css'

type ButtonSizeVariant = 'small' | 'medium' | 'large' | 'icon'
type ButtonLevels = 'base' | 'lg'

export type ButtonSize = ButtonSizeVariant | Record<ButtonLevels, ButtonSizeVariant>

export const getButtonSizeStyles = (buttonSize: ButtonSize) => {
  if (typeof buttonSize !== 'object') {
    return buttonSizeStyles.base[buttonSize]
  }

  const responsiveStyles = Object.entries(buttonSize).map(([level, size]) => {
    return buttonSizeStyles[level as ButtonLevels][size]
  })

  return responsiveStyles
}
