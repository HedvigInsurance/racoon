import { theme } from 'ui'

export type TickIconProps = {
  color?: string
  size?: number
}

export const TickIcon = ({ color = theme.colors.gray900, size = 24 }: TickIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 26 26">
    <g transform="translate(1 1)" fill="none" fillRule="evenodd">
      <path
        stroke={color}
        strokeWidth={2}
        fill={color}
        d="M9.646 15.322l-3.32-3.357L5.2 13.104 9.646 17.6 19.2 7.94 18.073 6.8z"
      />
    </g>
  </svg>
)
