import type { IconRootProps } from './Root'
import { IconRoot } from './Root'

export const CrossIcon = ({ size = '1.5rem', color = 'currentColor', ...props }: IconRootProps) => (
  <IconRoot size={size} {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.87348 5.81276C6.58059 5.51987 6.10571 5.51987 5.81282 5.81276C5.51993 6.10566 5.51993 6.58053 5.81282 6.87342L10.9393 11.9999L5.81284 17.1265C5.51995 17.4194 5.51995 17.8943 5.81285 18.1871C6.10574 18.48 6.58062 18.48 6.87351 18.1871L12 13.0606L17.1265 18.1871C17.4194 18.48 17.8943 18.48 18.1872 18.1871C18.4801 17.8942 18.4801 17.4194 18.1872 17.1265L13.0606 11.9999L18.1871 6.87334C18.48 6.58045 18.48 6.10557 18.1871 5.81268C17.8942 5.51979 17.4193 5.5198 17.1265 5.81269L12 10.9393L6.87348 5.81276Z"
      fill={color}
    />
  </IconRoot>
)
