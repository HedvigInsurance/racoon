import { IconRoot, IconRootProps } from './Root'

export const ChevronIcon = ({ size = '1.5rem', ...props }: IconRootProps) => (
  <IconRoot
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    size={size}
    {...props}
  >
    <path
      fill="currentColor"
      d="M8 10.873L1.127 4 0 5.127l7.437 7.436a.797.797 0 001.126 0L16 5.127 14.873 4 8 10.873z"
    />
  </IconRoot>
)
