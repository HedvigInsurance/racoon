import styled from '@emotion/styled'
import { useContext } from 'react'
import { ReactNode } from 'react'
import type { UIColor } from '../../lib/theme/colors'
import { getColor } from '../../lib/theme/theme'
import { MenuThemeContext } from './Menu'

export type MenuLinkProps = {
  // Override the theme of the menu
  // For example, links in a SubMenu will always be black on desktop
  color?: UIColor
  children?: ReactNode
  href?: string
}

const MenuLinkElement = styled.a<MenuLinkProps>(({ theme, color }) => ({
  textDecoration: 'none',
  ':focus': {
    outline: `5px auto ${theme.colors.purple700}`,
  },
  color: color ? getColor(color) : 'currentColor',
  ':hover, :focus': {
    color: color ? getColor(color) : 'currentColor',
  },
}))

/**
 * Links that are styled for being put in a Menu component
 * If no `href` is passed it will be rendered as a <span>
 */
export const MenuLink = ({ color: colorProp, ...props }: MenuLinkProps) => {
  const contextColor = useContext(MenuThemeContext)
  const color = colorProp || contextColor
  return <MenuLinkElement {...props} color={color} as={props.href ? 'a' : 'span'} />
}
