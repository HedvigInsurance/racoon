import type { IconRootProps } from './Root'
import { IconRoot } from './Root'

export const PhoneIcon = ({ className, size = '1.5rem' }: IconRootProps) => (
  <IconRoot
    size={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.94976 11.5355C2.99714 9.58291 2.99714 6.41709 4.94976 4.46447L6.36397 3.05025C6.75449 2.65973 7.38766 2.65973 7.77818 3.05025L10.8637 6.13581C11.2543 6.52633 11.2543 7.1595 10.8637 7.55002L9.80308 8.61068C9.02203 9.39173 9.02203 10.6581 9.80308 11.4391L12.8244 14.4604C13.6054 15.2414 14.8717 15.2414 15.6528 14.4604L16.7134 13.3997C17.104 13.0092 17.7371 13.0092 18.1277 13.3997L21.2132 16.4853C21.6037 16.8758 21.6037 17.509 21.2132 17.8995L19.799 19.3137C17.8464 21.2663 14.6806 21.2663 12.7279 19.3137L4.94976 11.5355Z"
      fill="currentColor"
    />
  </IconRoot>
)
