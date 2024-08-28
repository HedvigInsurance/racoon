import { ComponentProps, ReactNode } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { css } from './Tooltip.css'

function TooltipRoot(props: ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={100} {...props}>
        {props.children}
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

function TooltipTrigger(
  props: ComponentProps<typeof TooltipPrimitive.Trigger>,
) {
  return (
    <TooltipPrimitive.Trigger {...props}>
      {props.children}
    </TooltipPrimitive.Trigger>
  )
}

function TooltipContent(
  props: ComponentProps<typeof TooltipPrimitive.Content>,
) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={4}
        className={css.TooltipContent}
        {...props}
      >
        {props.children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
}

export function LegacyTooltip(props: { children: ReactNode; content: string }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <span>{props.children}</span>
      </Tooltip.Trigger>
      <Tooltip.Content>{props.content}</Tooltip.Content>
    </Tooltip.Root>
  )
}
