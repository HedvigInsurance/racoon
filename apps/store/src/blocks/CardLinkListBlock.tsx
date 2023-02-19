import styled from '@emotion/styled'
import { theme, mq } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { CardLinkBlock, CardLinkBlockProps } from './CardLinkBlock'

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
CardLinkListBlock.blockName = 'cardLinkList'

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
    [':nth-child(odd)']: {
      gridColumn: '2 / span 5',
    },
    [':nth-child(even)']: {
      gridColumn: '7 / span 5',
    },
  },
  [mq.lg]: {
    [':nth-child(odd)']: {
      gridColumn: '3 / span 4',
    },
    [':nth-child(even)']: {
      gridColumn: '7 / span 4',
    },
  },
})
