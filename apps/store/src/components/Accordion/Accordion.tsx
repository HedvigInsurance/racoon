import styled from '@emotion/styled'
import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { PropsWithChildren } from 'react'
import { ChevronIcon } from 'ui'

export const Root = AccordionPrimitives.Root

export const Item = styled(AccordionPrimitives.Item)(({ theme }) => ({
  padding: theme.space[2],
  borderBottom: `1px solid ${theme.colors.gray500}`,
}))

const Header = AccordionPrimitives.Header

const Trigger = styled(AccordionPrimitives.Trigger)(() => ({
  height: '3rem',
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}))

export const HeaderWithTrigger = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <Header>
      <Trigger>
        {children}
        <TriggerIcon size="1rem" />
      </Trigger>
    </Header>
  )
}

const TriggerIcon = styled(ChevronIcon)({
  transition: 'transform 300ms',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
})

export const Content = AccordionPrimitives.Content
