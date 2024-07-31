import { IconRoot, type IconRootProps } from 'ui'

type Props = IconRootProps & {
  borderColor?: string
  fillColor?: string
  innerColor?: string
}

// Single icon can cover 3 possible radio indicator states
// - initial (border, no fill, no center color)
// - selected (no border, green fill, optionally white center)
// - selected disabled (no border, gray fill, optionally white center)
export function RadioIndicatorIcon({
  size = '1.5rem',
  borderColor,
  fillColor = 'currentColor',
  innerColor = 'transparent',
  ...props
}: Props) {
  return (
    <IconRoot size={size} {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" stroke={borderColor ?? fillColor} strokeWidth={2} />
      <circle cx="12" cy="12" r="12" fill={fillColor} />
      <circle cx="12" cy="12" r="4" fill={innerColor} />
    </IconRoot>
  )
}
