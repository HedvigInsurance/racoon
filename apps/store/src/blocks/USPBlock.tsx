import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { Badge, Text, theme, mq } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import {
  type SbBaseBlockProps,
  type ExpectedBlockType,
  type GridColumnsField,
} from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type USPBlockProps = SbBaseBlockProps<{
  items: ExpectedBlockType<USPItemBlockProps>
  layout?: GridColumnsField
}>

export const USPBlock = ({ blok }: USPBlockProps) => {
  const uspItems = filterByBlockType(blok.items, USPBlockItem.blockName)

  return (
    <GridLayout.Root {...storyblokEditable(blok)}>
      <GridLayout.Content
        width={blok.layout?.widths ?? '1'}
        align={blok.layout?.alignment ?? 'center'}
      >
        <List>
          {uspItems.map((nestedBlock) => (
            <USPBlockItem
              key={nestedBlock._uid}
              blok={nestedBlock}
              numberOfItems={uspItems.length}
            />
          ))}
        </List>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}
USPBlock.blockName = 'usp'

type USPItemBlockProps = SbBaseBlockProps<{
  title: string
  content: string
}> & { numberOfItems: number }

export const USPBlockItem = ({ blok, numberOfItems }: USPItemBlockProps) => {
  return (
    <ListItem numberOfItems={numberOfItems}>
      <Badge>{blok.title}</Badge>
      <Text size={{ _: 'xl' }}>{blok.content}</Text>
    </ListItem>
  )
}
USPBlockItem.blockName = 'uspItem'

const List = styled.ul({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(21.875rem, 1fr))',
  gap: theme.space.xxl,

  [mq.md]: {
    columnGap: theme.space.md,
  },
})

const ListItem = styled.li<{ numberOfItems: number }>(({ numberOfItems }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.space.md,

  [mq.md]: {
    gap: theme.space.lg,
  },

  [`${List.toString()} > &`]: {
    maxWidth: numberOfItems >= 3 ? '28.125rem' : '40.625rem',
  },
}))
