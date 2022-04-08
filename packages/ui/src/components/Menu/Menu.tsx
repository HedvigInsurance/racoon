import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { mq } from '../../lib/media-query'
import { getColor } from '../../lib/theme'
import { ButtonColors } from '../Button/button'
import { MenuItem } from './MenuItem'
import { MenuItemGroup, MenuItemGroupContainer } from './MenuItemGroup'
import { SubMenu } from './SubMenu'

const MenuContainer = styled.div({
  backgroundColor: getColor('dark'),
  [mq.md]: {
    backgroundColor: 'transparent',
  },
})

const MenuList = styled.ul({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'start',
  margin: 0,
  padding: 0,
  listStyle: 'none',

  [mq.md]: {
    flexDirection: 'row',
  },
})

export type MenuProps = {
  children?: ReactNode
  theme?: ButtonColors
}

const Menu = ({ children, theme }: MenuProps) => {
  return (
    <MenuContainer>
      <MenuList>{children}</MenuList>
    </MenuContainer>
  )
}

Menu.Item = MenuItem
Menu.SubMenu = SubMenu
Menu.ItemGroup = MenuItemGroup
Menu.GroupContainer = MenuItemGroupContainer

export { Menu }
