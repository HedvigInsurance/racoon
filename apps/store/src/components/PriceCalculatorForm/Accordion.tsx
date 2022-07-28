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

export const Root = Accordion.Root
export const Item = Accordion.Item

const TriggerIcon = styled(ChevronIcon)({
  transition: 'transform 300ms',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
})

export const Trigger = () => {
  return (
    <Accordion.Trigger>
      <TriggerIcon size="1rem" />
    </Accordion.Trigger>
  )
}
