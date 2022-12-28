import { IconRoot, IconRootProps } from './Root'

export const PauseIcon = ({ size = '1.5rem', ...props }: IconRootProps) => (
  <IconRoot
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    size={size}
    {...props}
  >
    <rect fill="none" height="256" width="256" />
    <path d="M216,48V208a16,16,0,0,1-16,16H164a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h36A16,16,0,0,1,216,48ZM92,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H92a16,16,0,0,0,16-16V48A16,16,0,0,0,92,32Z" />
  </IconRoot>
)
