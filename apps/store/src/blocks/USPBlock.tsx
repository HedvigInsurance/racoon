import styled from '@emotion/styled'
import { HeadingLabel, Text, Space, theme, mq } from 'ui'
import { SbBaseBlockProps, ExpectedBlockType } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type USPBlockProps = SbBaseBlockProps<{
  items: ExpectedBlockType<USPItemBlockProps>
}>

export const USPBlock = ({ blok }: USPBlockProps) => {
  const uspItems = filterByBlockType(blok.items, USPBlockItem.blockName)

  return (
    <Wrapper numberOfItems={uspItems.length}>
      {uspItems.map((nestedBlock) => (
        <USPBlockItem key={nestedBlock._uid} blok={nestedBlock} />
      ))}
    </Wrapper>
  )
}
USPBlock.blockName = 'usp'

type USPItemBlockProps = SbBaseBlockProps<{
  title: string
  content: string
}>

export const USPBlockItem = ({ blok }: USPItemBlockProps) => {
  return (
    <li>
      <Space y={{ base: 1, md: 1.5 }}>
        <HeadingLabel>{blok.title}</HeadingLabel>
        <Text size={{ _: 'xl' }}>{blok.content}</Text>
      </Space>
    </li>
  )
}
USPBlockItem.blockName = 'uspItem'

const Wrapper = styled.ul<{ numberOfItems: number }>(({ numberOfItems }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(21.875rem, 1fr))',
  gap: theme.space.xxl,
  paddingInline: theme.space.md,

  [mq.md]: {
    gap: theme.space.md,
    paddingInline: theme.space.lg,
  },

  '& > li': {
    maxWidth: numberOfItems >= 3 ? '28.125rem' : '40.625rem',
  },
}))
