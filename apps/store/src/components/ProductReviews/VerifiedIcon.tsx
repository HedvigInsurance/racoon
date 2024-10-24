import { IconRoot, type IconRootProps } from 'ui/src/icons/Root'
import { theme } from 'ui/src/theme/theme'

type Props = IconRootProps

export const VerifiedIcon = ({
  size = '1.5rem',
  color = theme.colors.signalGreenElement,
  ...props
}: Props) => {
  return (
    <IconRoot
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      size={size}
      color={color}
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25ZM15.5303 9.46967C15.8232 9.76256 15.8232 10.2374 15.5303 10.5303L12.2374 13.8232C11.554 14.5066 10.446 14.5066 9.76256 13.8232L8.46967 12.5303C8.17678 12.2374 8.17678 11.7626 8.46967 11.4697C8.76256 11.1768 9.23744 11.1768 9.53033 11.4697L10.8232 12.7626C10.9209 12.8602 11.0791 12.8602 11.1768 12.7626L14.4697 9.46967C14.7626 9.17678 15.2374 9.17678 15.5303 9.46967Z"
      />
    </IconRoot>
  )
}
