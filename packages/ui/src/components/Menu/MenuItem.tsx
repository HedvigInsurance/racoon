import styled from '@emotion/styled'
import { ReactNode, useContext } from 'react'
import { mq } from '../../lib/media-query'
import { getColor } from '../../lib/theme'
import { MenuThemeContext } from './Menu'

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

  color: getColor(color),
  ':hover, :focus': {
    color: getColor(color),
  },

  [mq.md]: {
    fontSize: 'initial',
    padding: '0.625rem',
  },
}))

type MenuItemProps = {
  children: ReactNode
}

export const MenuItem = ({ children, ...props }: MenuItemProps) => {
  const color = useContext(MenuThemeContext)

  return (
    <MenuItemElement {...props} color={color}>
      {children}
    </MenuItemElement>
  )
}
