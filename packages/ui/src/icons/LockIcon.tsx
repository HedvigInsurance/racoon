import type { IconRootProps } from './Root'
import { IconRoot } from './Root'

export const LockIcon = ({ size = '1.5rem', color = 'currentColor', ...props }: IconRootProps) => {
  return (
    <IconRoot
      size={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 5.25C13.7949 5.25 15.25 6.70507 15.25 8.5L15.25 9.75H8.75L8.75 8.5C8.75 6.70507 10.2051 5.25 12 5.25ZM7.25 9.76121V8.5C7.25 5.87665 9.37665 3.75 12 3.75C14.6234 3.75 16.75 5.87665 16.75 8.5L16.75 9.76121C18.1516 9.88752 19.25 11.0655 19.25 12.5V17.5C19.25 19.0188 18.0188 20.25 16.5 20.25H7.5C5.98122 20.25 4.75 19.0188 4.75 17.5V12.5C4.75 11.0655 5.84838 9.88752 7.25 9.76121Z"
        fill={color}
      />
    </IconRoot>
  )
}
