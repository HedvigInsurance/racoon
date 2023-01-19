import { IconRoot, IconRootProps } from './Root'

export const PauseIcon = ({ size = '1.5rem', ...props }: IconRootProps) => (
  <IconRoot
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    size={size}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.5 4.5C6.67157 4.5 6 5.17157 6 6V18C6 18.8284 6.67157 19.5 7.5 19.5H9C9.82843 19.5 10.5 18.8284 10.5 18V6C10.5 5.17157 9.82843 4.5 9 4.5H7.5ZM15 4.5C14.1716 4.5 13.5 5.17157 13.5 6V18C13.5 18.8284 14.1716 19.5 15 19.5H16.5C17.3284 19.5 18 18.8284 18 18V6C18 5.17157 17.3284 4.5 16.5 4.5H15Z"
      fill="currentColor"
    />
  </IconRoot>
)
