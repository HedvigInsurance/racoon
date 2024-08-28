import { ComponentProps } from 'react'
import { base, infoTagStyle } from './InfoTag.css'
import clsx from 'clsx'

type Props = {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral'
} & ComponentProps<'span'>

export type InfoTagVariant = Props['variant']

export const InfoTag = (props: Props) => {
  const { variant = 'success', className, ...rest } = props

  return (
    <span className={clsx(base, infoTagStyle[variant], className)} {...rest} />
  )
}
