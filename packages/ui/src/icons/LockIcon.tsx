import type { IconRootProps } from './Root'
import { IconRoot } from './Root'

export const LockIcon = ({ size = '1.5rem', color = 'currentColor', ...props }: IconRootProps) => {
  return (
    <IconRoot
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1.25C5.92893 1.25 4.25 2.92893 4.25 5V7H4C2.89543 7 2 7.89543 2 9V13C2 14.1046 2.89543 15 4 15H12C13.1046 15 14 14.1046 14 13V9C14 7.89543 13.1046 7 12 7H11.75V5C11.75 2.92893 10.0711 1.25 8 1.25ZM10.25 7V5C10.25 3.75736 9.24264 2.75 8 2.75C6.75736 2.75 5.75 3.75736 5.75 5V7H10.25Z"
        fill={color}
      />
    </IconRoot>
  )
}
