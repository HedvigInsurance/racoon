import { buttonSizeDefault, buttonSizeLarge } from './Button.css'

type ButtonSizeVariant = 'small' | 'medium' | 'large'
type ButtonLevels = 'base' | 'lg'

export type ButtonSize = ButtonSizeVariant | Record<ButtonLevels, ButtonSizeVariant>

export const getButtonSize = (buttonSize: ButtonSize) => {
  if (typeof buttonSize !== 'object') {
    return buttonSizeDefault[buttonSize]
  }

  const responsiveStyles = Object.entries(buttonSize).map(([level, size]) => {
    if (level === 'base') return buttonSizeDefault[size]
    if (level === 'lg') return buttonSizeLarge[size]
  })

  return responsiveStyles
}
