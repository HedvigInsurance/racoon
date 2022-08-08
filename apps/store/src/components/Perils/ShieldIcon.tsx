import { theme } from 'ui'

export type ShieldIconProps = {
  color?: string
  size?: string
}

export const ShieldIcon = ({ color = theme.colors.gray900, size = '24px' }: ShieldIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 22"
      fill="none"
    >
      <path
        d="M9 21C9 21 17 17 17 11V4L9 1L1 4V11C1 17 9 21 9 21Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
