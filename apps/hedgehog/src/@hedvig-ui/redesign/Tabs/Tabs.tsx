import type { HTMLAttributes } from 'react'
import styled from '@emotion/styled'
import { colors } from '@hedvig-ui/redesign/palette'
import { Tab, type TabProps } from '@hedvig-ui/redesign/Tab/Tab'
import { Grid } from '../Grid/Grid'

type DataProps = {
  list: (TabProps & { key?: string })[]
}

type TabsProps = DataProps & HTMLAttributes<HTMLDivElement>

export const Tabs = (props: TabsProps) => {
  const { list, children, ...rest } = props

  // If we have too few tabs, they become so stretched that it looks
  // uncanny. In those cases we instead push them to the left by
  // making them 1/5 of the total width.
  const equalColumns = list.length < 3 ? 5 : list.length

  return (
    <StyledTabs equalColumns={equalColumns} columnGap="tiny" {...rest}>
      {list.map(({ key, title, ...rest }) => (
        <Tab key={key ?? title} title={title} {...rest} />
      ))}
    </StyledTabs>
  )
}

const StyledTabs = styled(Grid)`
  width: 100%;

  border-radius: 12px;
  padding: 4px;

  background-color: ${colors.gray200};

  & > * {
    flex-basis: 100%;
  }
`
