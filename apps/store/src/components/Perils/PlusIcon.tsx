import { theme } from 'ui'

export type PlusIconProps = {
  color?: string
  size?: string
  className?: string
}

export const PlusIcon = (props: PlusIconProps) => {
  const { color = theme.colors.gray900, size = '1.5rem', className } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 5V19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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