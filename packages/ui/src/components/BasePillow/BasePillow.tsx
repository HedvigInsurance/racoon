import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'
import { type ComponentProps, type PropsWithChildren } from 'react'
import { type Level } from '../../theme'
import { pillowVariants } from './BasePillow.css'
export { pillowSize } from './BasePillow.css'

type PillowSize =
  | 'mini'
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge'

type BasePillowProps = {
  src?: string
  alt?: string | null
  priority?: boolean
  className?: string
}

type SharedProps = {
  size?: PillowSize | Partial<Record<Level | '_', PillowSize>>
}

export type PillowProps = SharedProps & BasePillowProps

type BasePillowComponentProps = { shouldFallback: false } & PropsWithChildren<BasePillowProps>
type SVGComponentProps = { shouldFallback: true } & ComponentProps<'svg'>

type Props = SharedProps & (BasePillowComponentProps | SVGComponentProps)

export const BasePillow = ({ size = 'medium', className, children, ...props }: Props) => {
  // Need to check with `prop.shouldFallback` for the type guard to work
  if (props.shouldFallback === true) {
    // Omit `shouldFallback` from props as it's not a native attribute
    // `fill` is only available when  `shouldFallback` is true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { shouldFallback: _, fill = '#F5F5F5', ...svgProps } = props

    return (
      <svg
        className={clsx(pillowVariants(size), className)}
        viewBox="0 0 480 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...svgProps}
      >
        <path
          d="M3.79613e-05 240C2.56137e-05 428.992 101.382 480 240.298 480C379.214 480 480 432.012 480 240C480 47.9875 396.228 -5.43757e-05 240.298 -4.198e-05C84.3668 -6.01019e-05 5.03089e-05 51.0075 3.79613e-05 240Z"
          fill={fill}
        />
      </svg>
    )
  }

  return (
    <Slot className={clsx(pillowVariants(size), className)} {...props}>
      {children}
    </Slot>
  )
}
