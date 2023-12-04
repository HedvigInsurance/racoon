// Based on Radix Tooltip (https://www.radix-ui.com/docs/primitives/components/tooltip)
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { type ReactNode, useState } from 'react'
import { Text, theme } from 'ui'

type Props = {
  message: string
  children: ReactNode
}

export const Tooltip = ({ children, message }: Props) => {
  const [open, setOpen] = useState(false)
  const handleClick = () => setOpen((prevOpen) => !prevOpen)

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={0} open={open} onOpenChange={setOpen}>
        <Trigger asChild={true} onClick={handleClick}>
          {children}
        </Trigger>
        <TooltipPrimitive.Portal>
          <Content sideOffset={5} onClick={(event) => event.stopPropagation()}>
            <Text size="xs" color="textNegative" align="center">
              {message}
            </Text>
            <TooltipPrimitive.Arrow />
          </Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

const slideUpAndFadeAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const slideDownAndFadeAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const Content = styled(TooltipPrimitive.Content)({
  paddingInline: theme.space.sm,
  paddingBlock: theme.space.xs,
  paddingBottom: `calc(${theme.space.xs} + 2px)`,
  backgroundColor: theme.colors.gray1000,
  borderRadius: theme.radius[1],

  maxWidth: '20rem',
  maxHeight: 'var(--radix-tooltip-content-available-height)',

  animationDuration: '0.6s',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  transformOrigin: 'var(--radix-tooltip-content-transform-origin)',

  '&[data-side="top"]': {
    animationName: slideUpAndFadeAnimation,
  },

  '&[data-side="bottom"]': {
    animationName: slideDownAndFadeAnimation,
  },
})

const Trigger = styled(TooltipPrimitive.Trigger)({
  position: 'relative',

  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
  },

  '@media (pointer: coarse)': {
    '::after': {
      '--click-target-minimum': '2.75rem', // 44px --> minimal tap target size recommended by Apple
      // Will evaluate to the number of pixels needed so the tap target is at least 44px.
      // Consider the following example:
      // width: 60px and height: 24px
      // left/right = min(0px, calc((60px - 44px) / 2)) = min(0px, 8px) = 0px
      // top/bottom = min(0px, calc((24px - 44px) / 2)) = min(0px, -10px) = -10px
      // So the tap target will be 60px x 44px
      '--inset-by': 'min(0px, calc((100% - var(--click-target-minimum)) / 2))',
      inset: 'var(--inset-by)',
    },
  },
})
