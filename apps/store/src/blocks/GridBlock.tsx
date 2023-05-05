import styled, { CSSObject } from '@emotion/styled'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { ImageTextBlockProps } from './ImageTextBlock'
import { Layout } from './TextContentBlock'

type ColumnBloks = ExpectedBlockType<ImageTextBlockProps>

type ColumnProps = { columns: 2 | 3 | 4 }

type GridBlockProps = SbBaseBlockProps<{
  title?: string
  columns: ColumnBloks
  layout?: Layout
}>

const COLUMN_STYLES: Record<number, CSSObject> = {
  2: {
    [mq.md]: { gridColumn: 'auto / span 6' },
  },
  3: {
    [mq.md]: { gridColumn: 'auto / span 4' },
  },
  4: {
    [mq.md]: { gridColumn: 'auto / span 6' },
    [mq.lg]: { gridColumn: 'auto / span 3' },
  },
}

const getColumns = (items: ColumnBloks) => {
  const noOfItems = items.length
  switch (noOfItems) {
    case 1:
    case 2:
      return 2
    case 3:
      return 3
    default:
      return 4
  }
}

export const GridBlock = ({ blok }: GridBlockProps) => {
  const columns = getColumns(blok.columns)
  return (
    <GridLayout.Root {...storyblokEditable(blok)}>
      <GridLayout.Content width={blok.layout?.widths ?? { base: '1' }} align="center">
        <Wrapper>
          {blok.columns.map((nestedBlock) => (
            <Column key={nestedBlock._uid} columns={columns}>
              <StoryblokComponent blok={nestedBlock} nested={true} />
            </Column>
          ))}
        </Wrapper>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

GridBlock.blockName = 'grid'

const Wrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  columnGap: theme.space.md,
  rowGap: theme.space.xxl,
})

const Column = styled.div<ColumnProps>(({ columns }) => ({
  gridColumn: '1 / span 12',
  ...COLUMN_STYLES[columns],
}))
