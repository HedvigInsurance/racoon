import styled from '@emotion/styled'
import { Space } from 'ui'
import { PRODUCT_CARD_IMAGE_WIDTH_SMALL } from '@/components/ProductCard/ProductCard'

export type ProductGridProps<Item> = {
  title?: string
  items: Array<Item>
  children: (item: Item) => React.ReactNode
}

export const ProductGrid = <ItemType extends { key: string }>({
  title,
  items,
  children,
}: ProductGridProps<ItemType>) => {
  return (
    <Wrapper y={1.5}>
      {title && <Title>{title}</Title>}
      <Grid>
        {items.map((item) => (
          <GridItem key={item.key}>{children(item)}</GridItem>
        ))}
      </Grid>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  height: '100%',
})

const Title = styled.p(({ theme }) => ({
  fontSize: theme.fontSizes[2],
  color: theme.colors.gray600,
  textTransform: 'uppercase',
  textAlign: 'center',
}))

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, minmax(${PRODUCT_CARD_IMAGE_WIDTH_SMALL}, 1fr))`,
  gap: '1.5rem 0.5rem',
})

const GridItem = styled.div({
  display: 'flex',
  justifyContent: 'center',
})
