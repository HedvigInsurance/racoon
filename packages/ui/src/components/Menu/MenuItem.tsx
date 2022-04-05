import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { mq } from '../../lib/media-query'
import { getColor } from '../../lib/theme'
import { LinkButton } from '../Button/button'

export const MenuListItem = styled.li({
  position: 'relative',
  margin: 0,
  padding: 0,

  paddingLeft: '1rem',
  paddingBottom: '1rem',

  color: getColor('light'),

  [mq.md]: {
    color: getColor('dark'),
  },

  [mq.xl]: {
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    paddingBottom: 0,
  },
})

type MenuLinkProps = {
  href?: string
  children: ReactNode
}

export const MenuItem = ({ href, children }: MenuLinkProps) => {
  return (
    <MenuListItem>
      <LinkButton size="xs" variant="text" href={href || ''}>
        {children}
      </LinkButton>
    </MenuListItem>
  )
}
