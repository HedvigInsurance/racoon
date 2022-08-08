import { theme } from 'ui'

export type MinusIconProps = {
  color?: string
  size?: string
}

export const MinusIcon = ({ color = theme.colors.gray900, size = '24px' }: MinusIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
    >
      <path
        d="M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
