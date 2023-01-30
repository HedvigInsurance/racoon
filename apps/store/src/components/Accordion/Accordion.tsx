import styled from '@emotion/styled'
import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { PropsWithChildren, ReactElement } from 'react'
import { mq, theme } from 'ui'
import { PlusIcon } from '@/components/Perils/PlusIcon'

export const Root = styled(AccordionPrimitives.Root)({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xxs,

  [mq.lg]: {
    gap: theme.space.xs,
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
})

const Header = AccordionPrimitives.Header

const Trigger = styled(AccordionPrimitives.Trigger)({
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: theme.fontSizes.md,
  WebkitTapHighlightColor: 'transparent',

  [mq.lg]: {
    fontSize: theme.fontSizes.lg,
  },
})

type HeaderWithTriggerProps = PropsWithChildren<unknown> & {
  icon?: ReactElement
}

export const HeaderWithTrigger = ({
  children,
  icon = <TriggerIcon size="1.375rem" />,
}: HeaderWithTriggerProps) => {
  return (
    <Header>
      <Trigger>
        {children}
        {icon}
      </Trigger>
    </Header>
  )
}

const TriggerIcon = styled(PlusIcon)({
  transition: 'transform 200ms',
  '[data-state=open] &': { transform: 'rotate(-45deg)' },
})

export const Content = styled(AccordionPrimitives.Content)({
  paddingTop: theme.space.md,
  fontSize: theme.fontSizes.md,
  color: theme.colors.textSecondary,
  lineHeight: 1.32,
})
