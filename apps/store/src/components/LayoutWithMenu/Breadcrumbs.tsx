import styled from '@emotion/styled'
import Link from 'next/link'
import { Children, type ReactNode } from 'react'
import { Text, theme } from 'ui'
import { linkStyles } from '@/components/RichText/RichText.styles'

const BreadcrumbList = ({ children }: { children: ReactNode }) => {
  const count = Children.count(children)

  return (
    <>
      <StyledBreadcrumbList>
        {Children.map(children, (child, index) => (
          <BreadcumbItem>
            {child}
            {index < count - 1 && <Text color="textSecondaryOnGray">&middot;</Text>}
          </BreadcumbItem>
        ))}
      </StyledBreadcrumbList>
    </>
  )
}

const StyledBreadcrumbList = styled.ul({
  display: 'flex',
  flexFlow: 'row nowrap',
  gap: theme.space.xxs,
  overflowX: 'auto',

  padding: theme.space.sm,
  backgroundColor: theme.colors.opaque2,

  '::before, ::after': {
    content: '""',
    margin: 'auto',
  },
})

const BreadcumbItem = styled.li({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xxs,
  flexShrink: 0,
})

const BreadcrumbLink = styled(Link)(linkStyles, {
  fontSize: theme.fontSizes.sm,
  color: theme.colors.textPrimary,
  textDecorationColor: 'transparent',
})

export const Breadcrumbs = {
  Root: BreadcrumbList,
  Link: BreadcrumbLink,
}
