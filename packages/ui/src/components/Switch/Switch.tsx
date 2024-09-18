import * as RadixSwitch from '@radix-ui/react-switch'
import clsx from 'clsx'
import { switchStyles, thumbStyles } from './Switch.css'

export type SwitchProps = RadixSwitch.SwitchProps

export const Switch = ({ className, ...props }: SwitchProps) => {
  return (
    <RadixSwitch.Root className={clsx(switchStyles, className)} {...props}>
      <RadixSwitch.Thumb className={thumbStyles} />
    </RadixSwitch.Root>
  )
}
