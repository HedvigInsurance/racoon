import type { IconRootProps } from './Root'
import { IconRoot } from './Root'

export const WarningTriangleIcon = ({
  color = 'currentColor',
  size = '1.5rem',
  ...props
}: IconRootProps) => (
  <IconRoot size={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.8487 4.87385C10.2222 2.37539 13.7778 2.37538 15.1513 4.87384L21.0412 15.5877C22.3761 18.0159 20.6386 21 17.8899 21H6.11015C3.36142 21 1.62394 18.0159 2.95884 15.5877L8.8487 4.87385ZM12 7.75C12.4142 7.75 12.75 8.08579 12.75 8.5V13.5C12.75 13.9142 12.4142 14.25 12 14.25C11.5858 14.25 11.25 13.9142 11.25 13.5V8.5C11.25 8.08579 11.5858 7.75 12 7.75ZM12 17.5C12.5523 17.5 13 17.0523 13 16.5C13 15.9477 12.5523 15.5 12 15.5C11.4477 15.5 11 15.9477 11 16.5C11 17.0523 11.4477 17.5 12 17.5Z"
      fill={color}
    />
  </IconRoot>
)
