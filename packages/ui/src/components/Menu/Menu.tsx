import styled from '@emotion/styled'
import { createContext, ReactNode } from 'react'
import { mq } from '../../lib/media-query'
import { MenuItem } from './MenuItem'
import { MenuItemGroup, MenuItemGroupContainer } from './MenuItemGroup'
import { MenuLink } from './MenuLink'
import { SubMenu } from './SubMenu'

const MenuList = styled.ul(({ theme }) => ({
  fontFamily: theme.fonts.body,

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',

  margin: 0,
  padding: 0,
  listStyle: 'none',

  [mq.md]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}))

export const MenuThemeContext = createContext<MenuTheme>('dark')

export type MenuTheme = 'dark' | 'light'

export type MenuProps = {
  children?: ReactNode
  // `dark` or `light`. Sets the color of text and buttons. Default is "dark".
  theme?: MenuTheme
}

const Menu = ({ children, theme = 'dark' }: MenuProps) => {
  return (
    <MenuThemeContext.Provider value={theme}>
      <MenuList>{children}</MenuList>
    </MenuThemeContext.Provider>
  )
}

Menu.Item = MenuItem
Menu.SubMenu = SubMenu
Menu.ItemGroup = MenuItemGroup
Menu.GroupContainer = MenuItemGroupContainer
Menu.Link = MenuLink

export { Menu }
