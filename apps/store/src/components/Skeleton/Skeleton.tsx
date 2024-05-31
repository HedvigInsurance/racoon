import { clsx } from 'clsx'
import type { ComponentProps } from 'react'
import { skeleton } from '@/components/Skeleton/Skeleton.css'

type Props = ComponentProps<'div'>

export function Skeleton({ className, ...forwardedProps }: Props) {
  return <div className={clsx(className, skeleton)} {...forwardedProps}></div>
}
