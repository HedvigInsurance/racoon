import { HTMLAttributes } from 'react'
import { colors } from '@hedvig-ui/redesign/palette'

type Props = HTMLAttributes<HTMLOrSVGElement>

export const XIcon = (props: Props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.9697 13.0303C12.2626 13.3232 12.7374 13.3232 13.0303 13.0303C13.3232 12.7374 13.3232 12.2626 13.0303 11.9697L9.06066 8L13.0303 4.03033C13.3232 3.73744 13.3232 3.26256 13.0303 2.96967C12.7374 2.67678 12.2626 2.67678 11.9697 2.96967L8 6.93934L4.03033 2.96967C3.73744 2.67678 3.26256 2.67678 2.96967 2.96967C2.67678 3.26256 2.67678 3.73744 2.96967 4.03033L6.93934 8L2.96967 11.9697C2.67678 12.2626 2.67678 12.7374 2.96967 13.0303C3.26256 13.3232 3.73744 13.3232 4.03033 13.0303L8 9.06066L11.9697 13.0303Z"
      fill={colors.textPrimary}
    />
  </svg>
)