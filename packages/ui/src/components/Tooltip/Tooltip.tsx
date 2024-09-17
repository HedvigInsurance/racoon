import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import { type ComponentProps } from 'react'
import { Text } from '../Text/Text'
import { content, trigger } from './Tooltip.css'

type RootProps = ComponentProps<typeof TooltipPrimitive.Root>
const TooltipRoot = ({ children, ...props }: RootProps) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={0} {...props}>
        {children}
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

type TriggerProps = ComponentProps<typeof TooltipPrimitive.Trigger>
const TooltipTrigger = ({ className, children, ...props }: TriggerProps) => {
  return (
    <TooltipPrimitive.Trigger className={clsx(trigger, className)} {...props}>
      {children}
    </TooltipPrimitive.Trigger>
  )
}

type ContentProps = ComponentProps<typeof TooltipPrimitive.Content>
const TooltipContent = ({ className, children, ...props }: ContentProps) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content className={clsx(content, className)} sideOffset={5} {...props}>
        <Text size="xs" color="textNegative" align="center">
          {children}
        </Text>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
}
