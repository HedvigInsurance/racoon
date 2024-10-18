import styled from '@emotion/styled'
import * as Accordion from '@radix-ui/react-accordion'
import type { ReactNode } from 'react'
import { theme } from 'ui/src/theme/theme'

export const Header = Accordion.Header

export const Content = styled(Accordion.Content)({
  paddingTop: theme.space.sm,
})

export const Root = Accordion.Root
export const Item = styled(Accordion.Item)({
  paddingTop: theme.space.sm,

  '&[data-state=closed]:not(:last-child)': {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: theme.colors.borderTranslucent1,
    paddingBottom: theme.space.sm,
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
