import styled from '@emotion/styled'
import * as Accordion from '@radix-ui/react-accordion'
import { ReactNode } from 'react'
import { theme } from 'ui'

export const Header = styled(Accordion.Header)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}))

export const Content = styled(Accordion.Content)({
  paddingTop: theme.space[3],
})

export const Root = Accordion.Root
export const Item = styled(Accordion.Item)({
  paddingTop: theme.space[3],
  '&:not(:last-child)': {
    borderBottom: '1px solid hsla(0, 0%, 7%, 0.15)',
    paddingBottom: theme.space[3],
  },
})

type TriggerProps = { children: ReactNode }

export const Trigger = ({ children }: TriggerProps) => {
  return <StyledTrigger>{children}</StyledTrigger>
}

const StyledTrigger = styled(Accordion.Trigger)({
  cursor: 'pointer',

  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
    outlineOffset: 2,
  },
})
