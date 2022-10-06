import styled from '@emotion/styled'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronIcon } from 'ui'

export const Header = styled(Accordion.Header)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.space[4],
  paddingRight: theme.space[5],
  height: '4rem',
  borderBottom: '1px solid transparent',

  '&[data-state=closed]': {
    borderBottomColor: theme.colors.gray500,
  },
}))

export const Content = styled(Accordion.Content)(({ theme }) => ({
  borderBottom: `1px solid ${theme.colors.gray500}`,
  padding: theme.space[4],
  paddingTop: theme.space[0],
}))

const StyledTrigger = styled(Accordion.Trigger)(({ theme }) => ({
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
    outlineOffset: 2,
  },
}))

export const Root = Accordion.Root
export const Item = Accordion.Item

const TriggerIcon = styled(ChevronIcon)({
  transition: 'transform 300ms',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
})

export const Trigger = () => {
  return (
    <StyledTrigger>
      <TriggerIcon size="1rem" />
    </StyledTrigger>
  )
}
