import { HTMLAttributes } from 'react'
import { colors } from '@hedvig-ui/redesign/palette'

type Props = {
  fillColor?: string
} & HTMLAttributes<HTMLOrSVGElement>

export const ChevronLeftIcon = ({ fillColor, ...rest }: Props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5303 4.96967C14.8232 5.26256 14.8232 5.73744 14.5303 6.03033L8.73744 11.8232C8.63981 11.9209 8.63981 12.0791 8.73744 12.1768L14.5303 17.9697C14.8232 18.2626 14.8232 18.7374 14.5303 19.0303C14.2374 19.3232 13.7626 19.3232 13.4697 19.0303L7.67678 13.2374C6.99336 12.554 6.99336 11.446 7.67678 10.7626L13.4697 4.96967C13.7626 4.67678 14.2374 4.67678 14.5303 4.96967Z"
      fill={fillColor ?? colors.textPrimary}
    />
  </svg>
)
