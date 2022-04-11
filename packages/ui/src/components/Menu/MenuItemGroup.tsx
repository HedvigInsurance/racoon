import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import { ReactNode } from 'react'
import { mq } from '../../lib/media-query'
import { MenuLink } from './MenuLink'

const Group = styled.div({
  display: 'inline-flex',
  flexDirection: 'column',
})

const MenuGroupHeader = styled.span({
  fontSize: '0.75rem',

  padding: '0.5rem 1.125rem',

  textTransform: 'uppercase',
  color: colorsV3.gray500,
})

const MenuGroupList = styled.ul({
  listStyle: 'none',
  paddingInlineStart: 0,
  display: 'flex',
  flexDirection: 'column',
})

type MenuItemGroupProps = {
  title: string
  href?: string
  children: ReactNode
}

export const MenuItemGroup = ({ title, href, children }: MenuItemGroupProps) => {
  return (
    <Group>
      <MenuGroupHeader>
        <MenuLink color={colorsV3.gray500} href={href}>
          {title}
        </MenuLink>
      </MenuGroupHeader>
      <MenuGroupList>{children}</MenuGroupList>
    </Group>
  )
}

const GroupContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',

  [mq.md]: {
    flexDirection: 'row',
  },
})
type MenuItemGroupContainerProps = {
  children: ReactNode
}

export const MenuItemGroupContainer = ({ children }: MenuItemGroupContainerProps) => {
  return <GroupContainer>{children}</GroupContainer>
}
