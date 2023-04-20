import styled from '@emotion/styled'
import Link from 'next/link'
import { ComponentProps } from 'react'
import { Text, mq, theme } from 'ui'
import { Pillow as BasePillow } from '@/components/Pillow/Pillow'

const Item = styled(Link)({
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

const Pillow = (props: ComponentProps<typeof BasePillow>) => {
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

export const ProductItem = {
  Root: Item,
  Pillow,
  Content,
  Title: Text,
  Tagline,
} as const
