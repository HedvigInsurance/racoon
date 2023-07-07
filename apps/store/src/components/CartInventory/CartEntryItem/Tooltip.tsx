// Based on Radix Tooltip (https://www.radix-ui.com/docs/primitives/components/tooltip)

import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Text, theme } from 'ui'

type Props = {
  message: string
  children: React.ReactNode
}

export const Tooltip = ({ children, message }: Props) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={0}>
        <TooltipPrimitive.Trigger asChild={true}>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <Content sideOffset={5} onClick={(event) => event.stopPropagation()}>
            <Text size="xs" color="textNegative" align="center" balance={true}>
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
  backgroundColor: theme.colors.gray900,
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
