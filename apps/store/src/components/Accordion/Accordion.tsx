import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { PropsWithChildren, ReactElement } from 'react'
import { MinusIcon, mq, PlusIcon, theme } from 'ui'

export const Root = styled(AccordionPrimitives.Root)({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xxs,

  [mq.lg]: {
    gap: theme.space.xs,
  },
})

const Trigger = styled(AccordionPrimitives.Trigger)({
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.xs,
  fontSize: theme.fontSizes.md,

  [mq.lg]: {
    fontSize: theme.fontSizes.lg,
  },

  '@media (hover: hover)': {
    ':hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.gray200,
    },
  },
})

export const Item = styled(AccordionPrimitives.Item)({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,
  paddingInline: theme.space.md,
  paddingBlock: theme.space.sm,

  [mq.lg]: {
    paddingInline: theme.space.lg,
    paddingBlock: theme.space.md,
  },

  '@media (hover: hover)': {
    [`:has(${Trigger}:hover)`]: {
      backgroundColor: theme.colors.gray200,
    },
  },
})

type HeaderWithTriggerProps = PropsWithChildren<unknown> & {
  icon?: ReactElement
}

export const HeaderWithTrigger = ({ children }: HeaderWithTriggerProps) => {
  return (
    <AccordionPrimitives.Header>
      <Trigger>
        {children}

        <OpenIcon size="1rem" />
        <CloseIcon size="1rem" />
      </Trigger>
    </AccordionPrimitives.Header>
  )
}

const OpenIcon = styled(PlusIcon)({
  display: 'block',
  '[data-state=open] &': { display: 'none' },
})

const CloseIcon = styled(MinusIcon)({
  display: 'none',
  '[data-state=open] &': { display: 'block' },
})

const slideDown = keyframes({
  from: {
    height: 0,
  },
  to: {
    // custom property reference: https://www.radix-ui.com/docs/primitives/components/accordion
    height: 'var(--radix-accordion-content-height)',
  },
})
const slideUp = keyframes({
  from: {
    height: 'var(--radix-accordion-content-height)',
  },
  to: {
    height: 0,
  },
})

export const Content = styled(AccordionPrimitives.Content)({
  fontSize: theme.fontSizes.md,
  color: theme.colors.textSecondary,
  lineHeight: 1.32,
  overflow: 'hidden',

  '[data-state=open] &': {
    animation: `${slideDown} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
  },
  '[data-state=closed] &': {
    animation: `${slideUp} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
  },
})
