import styled from '@emotion/styled'
import { Fragment } from 'react'
import { mq, Space } from 'ui'

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
          <Fragment key={item.key}>{children(item)}</Fragment>
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
  gap: '1.5rem 0.5rem',
  alignItems: 'baseline',
  gridTemplateColumns: `repeat(auto-fit, minmax(20rem, 1fr))`,

  [mq.md]: {
    gap: '2rem 1rem',
  },
})
