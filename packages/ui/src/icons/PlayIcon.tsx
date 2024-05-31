import type { IconRootProps } from './Root'
import { IconRoot } from './Root'

export const PlayIcon = ({ size = '1.5rem', ...props }: IconRootProps) => (
  <IconRoot
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    size={size}
    {...props}
  >
    <path
      d="M19.6063 10.7138C20.5773 11.2964 20.5773 12.7036 19.6063 13.2862L9.02174 19.637C8.02196 20.2368 6.75 19.5167 6.75 18.3507L6.75 5.64929C6.75 4.48335 8.02196 3.76318 9.02174 4.36305L19.6063 10.7138Z"
      fill="currentColor"
    />
  </IconRoot>
)
