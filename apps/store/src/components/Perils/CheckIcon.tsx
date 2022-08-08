import { theme } from 'ui'

export type CheckIconProps = {
  color?: string
  size?: string
}

export const CheckIcon = ({ color = theme.colors.gray900, size = '24px' }: CheckIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      width={size}
      height={size}
    >
      <polygon
        fillRule="evenodd"
        points="9.707 14.293 19 5 20.414 6.414 9.707 17.121 4 11.414 5.414 10"
      />
    </svg>
  )
}
