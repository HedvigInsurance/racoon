'use client'
import type { IconRootProps } from './Root'
import { IconRoot } from './Root'

export const ArrowForwardIcon = ({ size = '1.5rem', ...props }: IconRootProps) => (
  <IconRoot
    viewBox="0 0 19 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    size={size}
    {...props}
  >
    <path
      fill="currentColor"
      d="M10.5303 0.469666L19.0607 9L10.5303 17.5303L9.46967 16.4697L16.1893 9.75H0V8.25L16.1893 8.25L9.46967 1.53033L10.5303 0.469666Z"
    />
  </IconRoot>
)
