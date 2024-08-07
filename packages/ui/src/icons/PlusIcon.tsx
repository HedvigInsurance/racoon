import type { IconRootProps } from './Root'
import { IconRoot } from './Root'

export const PlusIcon = ({ size = '1.5rem', color = 'currentColor', ...props }: IconRootProps) => {
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
        d="M8.74881 2C8.74881 1.58579 8.41303 1.25 7.99881 1.25C7.5846 1.25 7.24881 1.58579 7.24881 2V7.24881H2C1.58579 7.24881 1.25 7.5846 1.25 7.99881C1.25 8.41302 1.58579 8.74881 2 8.74881H7.24881V14C7.24881 14.4142 7.5846 14.75 7.99881 14.75C8.41303 14.75 8.74881 14.4142 8.74881 14V8.74881H14C14.4142 8.74881 14.75 8.41303 14.75 7.99881C14.75 7.5846 14.4142 7.24881 14 7.24881H8.74881V2Z"
        fill={color}
      />
    </IconRoot>
  )
}
