import styled from '@emotion/styled'
import Link from 'next/link'
import { type ReactNode } from 'react'
import { theme } from 'ui'

const Root = (props: { children: ReactNode }) => {
  return <Wrapper>{props.children}</Wrapper>
}

const Wrapper = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.space.xxs,
  justifyContent: 'center',
})

const Item = styled(Link)({
  borderRadius: theme.radius.sm,
  padding: theme.space.md,
  fontSize: theme.fontSizes.md,
  textAlign: 'center',
  whiteSpace: 'nowrap',

  ':focus-visible': {
    backgroundColor: theme.colors.opaque1,
  },

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.opaque1,
    },
  },
})

const ActiveItem = styled.div({
  borderRadius: theme.radius.sm,
  padding: theme.space.md,
  fontSize: theme.fontSizes.md,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  backgroundColor: theme.colors.blueFill1,
})

export const ArticleCategoryList = {
  Root,
  Item,
  ActiveItem,
} as const
