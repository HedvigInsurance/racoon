import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { mq } from '../../lib/media-query'
import { getColor } from '../../lib/theme'
import { LinkButton } from '../Button/button'

export const MenuListItem = styled.li({
  position: 'relative',
  margin: 0,
  padding: '0.25rem',

  color: getColor('light'),

  [mq.md]: {
    color: getColor('dark'),
  },
})

type MenuLinkProps = {
  href?: string
  children: ReactNode
}

export const MenuItem = ({ href, children }: MenuLinkProps) => {
  return (
    <MenuListItem>
      <LinkButton size="sm" variant="text" href={href || ''}>
        {children}
      </LinkButton>
    </MenuListItem>
  )
}
