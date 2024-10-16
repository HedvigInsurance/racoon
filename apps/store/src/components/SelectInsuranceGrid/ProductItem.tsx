import styled from '@emotion/styled'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import type { ComponentProps } from 'react'
import { Text, mq, theme } from 'ui'
import { Pillow as BasePillow } from '@/components/Pillow/Pillow'

const Item = styled.div({
  position: 'relative',

  display: 'flex',
  gap: theme.space.md,
  alignItems: 'center',

  paddingBlock: theme.space.xs,
  paddingInline: theme.space.sm,

  cursor: 'pointer',
  borderRadius: theme.radius.sm,

  '@media (hover: hover)': {
    ':hover': {
      // TODO: update after translucent colors are added to theme
      backgroundColor: 'hsla(0, 0%, 0%, 0.045)',
    },
  },

  ':active': {
    // TODO: update after translucent colors are added to theme
    backgroundColor: 'hsla(0, 0%, 0%, 0.02)',
    userSelect: 'none',
  },

  [mq.lg]: {
    padding: theme.space.md,
  },
})

const Content = styled.div({ flex: 1, width: 0 })

const Pillow = (props: Omit<ComponentProps<typeof BasePillow>, 'size'>) => {
  return <BasePillow size="small" {...props} />
}

const SingleLineText = styled(Text)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const Tagline = (props: ComponentProps<typeof Text>) => {
  return <SingleLineText size="xs" color="textSecondary" {...props} />
}

type TitleProps = LinkProps & { children: string; title?: string }

const TitleLink = ({ children, ...props }: TitleProps) => {
  return (
    <ExtendedLink {...props}>
      <Text as="span">{children}</Text>
    </ExtendedLink>
  )
}

const ExtendedLink = styled(Link)({
  // Make the whole product item clickable
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
  },
})

export const ProductItem = {
  Root: Item,
  Pillow,
  Content,
  TitleLink,
  Tagline,
} as const
