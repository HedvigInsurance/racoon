import { IconRoot, IconRootProps } from './Root'

export const PlayIcon = ({ size = '1.5rem', ...props }: IconRootProps) => (
  <IconRoot
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    size={size}
    {...props}
  >
    <g id="info" />
    <g id="icons">
      <path
        d="M3.9,18.9V5.1c0-1.6,1.7-2.6,3-1.8l12,6.9c1.4,0.8,1.4,2.9,0,3.7l-12,6.9C5.6,21.5,3.9,20.5,3.9,18.9z"
        id="play"
      />
    </g>
  </IconRoot>
)
