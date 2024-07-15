export { Alert } from './components/Alert/Alert'
export { HedvigLogo } from './components/HedvigLogo/HedvigLogo'
export { HedvigSymbol } from './components/HedvigSymbol/HedvigSymbol'
export { Space } from './components/Space'
export { Button, type ButtonProps } from './components/Button/Button'
export { InputBase } from './components/InputBase'
export type { InputBaseProps } from './components/InputBase'
export { Heading } from './components/Heading/Heading'
export type { HeadingProps, PossibleHeadingVariant } from './components/Heading/Heading'
export { Text } from './components/Text/Text'
export * as Dialog from './components/Dialog/Dialog'
export { Badge, type BadgeProps } from './components/Badge/Badge'
export { ConditionalWrapper } from './components/ConditionalWrapper'
export * from './components/ThemeProvider'

export { responsiveVariants } from './utils/responsiveVariants/responsiveVariants'
export * from './utils/responsiveVariants/repsonsiveVariants.types'
export { visuallyHidden } from './utils/visuallyHidden.css'

export * from './icons'

export * from './theme'

export * from './patterns'

// Overriding default of 75 to flush old image cache.  Do not change it back to 75 or 74
// unless you're ready to manually change every single storyblok image or solve it some other way
export const DEFAULT_IMAGE_QUALITY = 70
