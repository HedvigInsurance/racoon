import styled from '@emotion/styled'
import { createContext, ReactNode } from 'react'
import { mq } from '../../lib/media-query'
import { MenuItem } from './MenuItem'
import { MenuItemGroup, MenuItemGroupContainer } from './MenuItemGroup'
import { SubMenu } from './SubMenu'

const MenuContainer = styled.div({
  // backgroundColor: getColor('dark'),
  // [mq.md]: {
  //   backgroundColor: 'transparent',
  // },
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

export const MenuThemeContext = createContext<MenuTheme>('dark')

export type MenuTheme = 'dark' | 'light'

export type MenuProps = {
  children?: ReactNode
  theme?: MenuTheme
}

const Menu = ({ children, theme = 'dark' }: MenuProps) => {
  return (
    <MenuThemeContext.Provider value={theme}>
    <MenuContainer>
      <MenuList>{children}</MenuList>
    </MenuContainer>
    </MenuThemeContext.Provider>
  )
}

Menu.Item = MenuItem
Menu.SubMenu = SubMenu
Menu.ItemGroup = MenuItemGroup
Menu.GroupContainer = MenuItemGroupContainer

export { Menu }
