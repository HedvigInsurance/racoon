import { buttonSizeBase, buttonSizeLarge } from './Button.css'

type ButtonSizeVariant = 'small' | 'medium' | 'large'
type ButtonLevels = 'base' | 'lg'

export type ButtonSize = ButtonSizeVariant | Record<ButtonLevels, ButtonSizeVariant>

export const getButtonSizeStyles = (buttonSize: ButtonSize) => {
  if (typeof buttonSize !== 'object') {
    return buttonSizeBase[buttonSize]
  }

  const responsiveStyles = Object.entries(buttonSize).map(([level, size]) => {
    if (level === 'base') return buttonSizeBase[size]
    if (level === 'lg') return buttonSizeLarge[size]
  })

  return responsiveStyles
}
