import styled from '@emotion/styled'
import { ReactNode, useContext } from 'react'
import { mq } from '../../lib/media-query'
import { getColor } from '../../lib/theme'
import { MenuThemeContext } from './Menu'
import { MenuLink, MenuLinkProps } from './MenuLink'

const MenuItemElement = styled.li<MenuItemProps>(({ color }) => ({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'start',
  flexDirection: 'column',
  boxSizing: 'border-box',

  margin: 0,
  padding: '0.625rem',
  fontSize: '1.5rem',
  whiteSpace: 'nowrap',
  width: '100%',

  // This needs to be set both here and in MenuLink,
  // since we do not know if `children` is a component
  // that also picks up MenuThemeContext or just a text node
  color: getColor(color),
  ':hover, :focus': {
    color: getColor(color),
  },

  [mq.md]: {
    fontSize: 'initial',
    padding: '0.625rem',
  },
}))

type MenuItemProps = Pick<MenuLinkProps, 'href'> & {
  children: ReactNode
}

export const MenuItem = ({ children, href }: MenuItemProps) => {
  const color = useContext(MenuThemeContext)

  return (
    <MenuItemElement color={color}>
      {href ? <MenuLink href={href}>{children}</MenuLink> : <>{children}</>}
    </MenuItemElement>
  )
}
