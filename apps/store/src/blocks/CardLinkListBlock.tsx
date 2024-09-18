'use client'
import styled from '@emotion/styled'
import { mq } from 'ui'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import type { CardLinkBlockProps } from './CardLinkBlock'
import { CardLinkBlock, Grid } from './CardLinkBlock'

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
