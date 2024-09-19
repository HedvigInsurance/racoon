import clsx from 'clsx'
import { type ComponentProps } from 'react'
import { type Level } from '../../theme'
import { pillowSizeStyles } from './BasePillow.css'

type PillowSize =
  | 'mini'
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge'

export type PillowSizeProp = PillowSize | Partial<Record<Level | '_', PillowSize>>

type Props = ComponentProps<'svg'> & {
  size?: PillowSizeProp
}

export const BasePillow = ({ size = 'medium', className, fill, ...props }: Props) => {
  return (
    <svg
      className={clsx(pillowSizeStyles(size), className)}
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.79613e-05 240C2.56137e-05 428.992 101.382 480 240.298 480C379.214 480 480 432.012 480 240C480 47.9875 396.228 -5.43757e-05 240.298 -4.198e-05C84.3668 -6.01019e-05 5.03089e-05 51.0075 3.79613e-05 240Z"
        fill={fill}
      />
    </svg>
  )
}
