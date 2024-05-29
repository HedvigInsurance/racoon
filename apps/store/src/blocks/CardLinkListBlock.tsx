'use client'
import styled from '@emotion/styled'
import { theme, mq } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import type { CardLinkBlockProps } from './CardLinkBlock'
import { CardLinkBlock } from './CardLinkBlock'

type CardLinkListBlockProps = SbBaseBlockProps<{
  cardLinks: ExpectedBlockType<CardLinkBlockProps>
}>

export const CardLinkListBlock = ({ blok }: CardLinkListBlockProps) => {
  return (
    <Grid>
      {blok.cardLinks.map((nestedBlock) => (
        <Content key={nestedBlock._uid}>
          <CardLinkBlock blok={nestedBlock} />
        </Content>
      ))}
    </Grid>
  )
}

export const Grid = styled(GridLayout.Root)({
  gap: theme.space.xs,
  gridAutoRows: '9rem', // 144px

  [mq.lg]: {
    gap: theme.space.md,
    gridAutoRows: '16rem', // 256px
  },
})

const Content = styled.div({
  gridColumn: '1 / span 12',

  [mq.md]: {
    [':nth-of-type(odd)']: {
      gridColumn: '2 / span 5',
    },
    [':nth-of-type(even)']: {
      gridColumn: '7 / span 5',
    },
  },
  [mq.lg]: {
    [':nth-of-type(odd)']: {
      gridColumn: '3 / span 4',
    },
    [':nth-of-type(even)']: {
      gridColumn: '7 / span 4',
    },
  },
})
