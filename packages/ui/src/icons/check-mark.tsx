import { IconRoot, IconRootProps } from './root'

export const CheckIcon = ({ className, size = '0.875rem' }: IconRootProps) => {
  return (
    <IconRoot
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 14 11"
      fill="none"
      size={size}
    >
      <path d="M1 5L5 9L13 1" stroke="#FAFAFA" strokeWidth="2" />
    </IconRoot>
  )
}
