import { IconRoot, IconRootProps } from './Root'

export const MinusIcon = ({ size = '1.5rem', color = 'currentColor', ...props }: IconRootProps) => {
  return (
    <IconRoot
      size={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.25 7.99878C1.25 7.58457 1.58579 7.24878 2 7.24878H14C14.4142 7.24878 14.75 7.58457 14.75 7.99878C14.75 8.41299 14.4142 8.74878 14 8.74878H2C1.58579 8.74878 1.25 8.41299 1.25 7.99878Z"
        fill={color}
      />
    </IconRoot>
  )
}
