import styled, { CSSObject } from '@emotion/styled'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import {
  type ExpectedBlockType,
  type GridColumnsField,
  type SbBaseBlockProps,
} from '@/services/storyblok/storyblok'
import { ImageTextBlockProps } from './ImageTextBlock'

type ColumnBloks = ExpectedBlockType<ImageTextBlockProps>

type ColumnProps = { columns: number }

type GridBlockProps = SbBaseBlockProps<{
  title?: string
  columns: ColumnBloks
  layout?: GridColumnsField
}>

export const GridBlock = ({ blok }: GridBlockProps) => {
  // Define a grid with 2-4 columns based on no. of items
  const columns = Math.min(4, Math.max(2, blok.columns.length))

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
  columnGap: theme.space.md,
  rowGap: theme.space.xxl,
  marginInline: 'auto',

  [mq.md]: {
    gridTemplateColumns: 'repeat(12, 1fr)',
  },
})

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

const Column = styled.div<ColumnProps>(({ columns }) => ({
  ...COLUMN_STYLES[columns],
}))
