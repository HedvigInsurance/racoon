import styled from '@emotion/styled'
import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { PropsWithChildren, ReactElement } from 'react'
import { mq } from 'ui'
import { PlusIcon } from '@/components/Perils/PlusIcon'

export const Root = styled(AccordionPrimitives.Root)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[1],
}))

export const Item = styled(AccordionPrimitives.Item)(({ theme }) => ({
  backgroundColor: theme.colors.gray200,
  borderRadius: theme.radius.xs,
  padding: `${theme.space[3]} ${theme.space[4]}`,
  [mq.md]: {
    padding: `${theme.space[4]} ${theme.space[5]}`,
  },
}))

const Header = AccordionPrimitives.Header

const Trigger = styled(AccordionPrimitives.Trigger)(({ theme }) => ({
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: theme.fontSizes[3],
  lineHeight: '1.375rem',
}))

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

export const Content = styled(AccordionPrimitives.Content)(({ theme }) => ({
  paddingTop: theme.space[4],
  color: theme.colors.gray700,
}))
