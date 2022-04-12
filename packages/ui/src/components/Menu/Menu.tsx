import styled from '@emotion/styled'
import { createContext, ReactNode } from 'react'
import AnimateHeight from 'react-animate-height'
import { mq } from '../../lib/media-query'
import { ConditionalWrapper } from '../ConditionalWrapper'
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
  // Set to `true` to render with an animated open/close
  collapsible?: boolean
  // Used when `collapsible` is set to `true` to indicate whether the menu is shown or not
  isOpen?: boolean
}

const Menu = ({ children, collapsible, isOpen, theme = 'dark' }: MenuProps) => {
  return (
    <MenuThemeContext.Provider value={theme}>
      <ConditionalWrapper
        if={collapsible}
        with={(c) => <AnimateHeight height={isOpen ? '100vh' : 0}>{c}</AnimateHeight>}
      >
        <MenuList>{children}</MenuList>
      </ConditionalWrapper>
    </MenuThemeContext.Provider>
  )
}

Menu.Item = MenuItem
Menu.SubMenu = SubMenu
Menu.ItemGroup = MenuItemGroup
Menu.GroupContainer = MenuItemGroupContainer

export { Menu }
