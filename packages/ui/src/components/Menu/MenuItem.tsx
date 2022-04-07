import styled from '@emotion/styled'
import { ReactNode, useContext } from 'react'
import { mq } from '../../lib/media-query'
import { getColor } from '../../lib/theme'
import { LinkButton } from '../Button/button'
import { MenuThemeContext } from './Menu'

export const MenuListItem = styled.li({
  position: 'relative',
  margin: 0,
  padding: '0.25rem',
})

type MenuLinkProps = {
  href?: string
  children: ReactNode
}

export const MenuItem = ({ href, children }: MenuLinkProps) => {

  const theme = useContext(MenuThemeContext)

  return (
    <MenuListItem>
      <LinkButton size="sm" variant="text" href={href || ''}>
        {children}
      </LinkButton>
    </MenuListItem>
  )
}
