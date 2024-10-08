import type { IconRootProps } from './Root'
import { IconRoot } from './Root'

export const InfoIcon = ({ className, color = 'currentColor', size = '1rem' }: IconRootProps) => (
  <IconRoot
    size={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM9 4.625C9 5.17728 8.55228 5.625 8 5.625C7.44772 5.625 7 5.17728 7 4.625C7 4.07272 7.44772 3.625 8 3.625C8.55228 3.625 9 4.07272 9 4.625ZM8.76984 7.31898C8.76984 6.90477 8.43405 6.56898 8.01984 6.56898C7.60562 6.56898 7.26984 6.90477 7.26984 7.31898V11.3077C7.26984 11.7219 7.60562 12.0577 8.01984 12.0577C8.43405 12.0577 8.76984 11.7219 8.76984 11.3077V7.31898Z"
      fill={color}
    />
  </IconRoot>
)
