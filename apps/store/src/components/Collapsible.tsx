import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as RadixCollapsible from '@radix-ui/react-collapsible'

export const Root = RadixCollapsible.Root

export const Trigger = styled(RadixCollapsible.Trigger)({ cursor: 'pointer' })

const slideDown = keyframes({
  '0%': {
    height: 0,
    opacity: 0,
  },
  '50%': {
    // custom property reference: https://www.radix-ui.com/docs/primitives/components/collapsible
    height: 'var(--radix-collapsible-content-height)',
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
})

const slideUp = keyframes({
  '0%': {
    height: 'var(--radix-collapsible-content-height)',
    opacity: 1,
  },
  '50%': {
    height: 'var(--radix-collapsible-content-height)',
    opacity: 0,
  },
  '100%': {
    height: 0,
    opacity: 0,
  },
})

export const Content = styled(RadixCollapsible.Content)({
  '[data-state=open] &': {
    animation: `${slideDown} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
  },
  '[data-state=closed] &': {
    animation: `${slideUp} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
  },
})
