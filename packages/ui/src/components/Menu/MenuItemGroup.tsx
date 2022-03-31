import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import { ReactNode } from 'react'
import { mq } from '../../lib/media-query'
import { LinkButton } from '../Button/button'

const Group = styled.div({
  display: 'inline-flex',
  flexDirection: 'column',
})

const MenuGroupHeader = styled.span({
  fontSize: '0.75rem',

  paddingLeft: '0.325rem',
  marginBottom: '0.625rem',

  [mq.md]: {
    paddingLeft: '0.325rem',
    paddingRight: '0.75rem',
    marginBottom: '0.625rem',
  },
})

const MenuGroupLabel = styled.span({
  textTransform: 'uppercase',
  color: colorsV3.gray500,

  fontSize: '0.75rem',

  [mq.md]: {
    color: colorsV3.gray700,
  },
})

type MenuItemGroupProps = {
  title: string
  href?: string
  children: ReactNode
}

export const MenuItemGroup = ({ title, href, children }: MenuItemGroupProps) => {
  return (
    <Group>
      <MenuGroupHeader>
        {href ? (
          <LinkButton $variant="text" $size="sm" href={href}>
            <MenuGroupLabel>{title}</MenuGroupLabel>
          </LinkButton>
        ) : (
          <LinkButton as="span" $variant="text" $size="sm">
            <MenuGroupLabel>{title}</MenuGroupLabel>
          </LinkButton>
        )}
      </MenuGroupHeader>

      {children}
    </Group>
  )
}

const GroupContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',

  [mq.md]: {
    flexDirection: 'row',
  },
})
type MenuItemGroupContainerProps = {
  children: ReactNode
}

export const MenuItemGroupContainer = ({ children }: MenuItemGroupContainerProps) => {
  return <GroupContainer>{children}</GroupContainer>
}
