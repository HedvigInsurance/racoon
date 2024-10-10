import clsx from 'clsx'
import { type ComponentProps } from 'react'
import { Text } from '../Text/Text'
import { supTextStyles } from './SupText.css'

type Props = ComponentProps<typeof Text>
export function SupText({ className, children, ...props }: Props) {
  return (
    <Text as="sup" className={clsx(supTextStyles, className)} {...props}>
      {children}
    </Text>
  )
}
