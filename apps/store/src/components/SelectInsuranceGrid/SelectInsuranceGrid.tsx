import styled from '@emotion/styled'
import { Heading, Space, mq, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ProductItem } from '@/components/SelectInsuranceGrid/ProductItem'
import { Product as APIProduct } from '@/services/apollo/generated'

const ITEM_THRESHOLD = 4
const LAYOUT = { GRID: 'grid', COLUMN: 'column' }

export type Product = Pick<
  APIProduct,
  'id' | 'displayNameFull' | 'displayNameShort' | 'tagline' | 'pageLink' | 'pillowImage'
>

type Props = {
  products: Product[]
  heading?: string
  className?: string
}

export const SelectInsuranceGrid = ({ className, heading, products, ...others }: Props) => {
  return (
    <GridLayout.Root className={className} {...others}>
      <GridLayout.Content width="1" align="center">
        <Space y={{ base: 2, md: 4 }}>
          {heading && (
            <Heading as="h2" variant={{ _: 'serif.32', lg: 'serif.48' }} align="center">
              {heading}
            </Heading>
          )}

          <Grid data-layout={products.length > ITEM_THRESHOLD ? LAYOUT.GRID : LAYOUT.COLUMN}>
            {products.map((product) => (
              <ProductItem.Root key={product.id}>
                <ProductItem.Pillow {...product.pillowImage} />
                <ProductItem.Content>
                  <ProductItem.TitleLink href={product.pageLink} title={product.displayNameFull}>
                    {product.displayNameShort}
                  </ProductItem.TitleLink>
                  <ProductItem.Tagline>{product.tagline}</ProductItem.Tagline>
                </ProductItem.Content>
              </ProductItem.Root>
            ))}
          </Grid>
        </Space>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

const Grid = styled.div({
  '--column-width': '21rem',
  '--max-no-columns': 3,
  '--grid-gap': '1rem',

  '--gap-count': 'calc(var(--max-no-columns) - 1)',
  '--gap-width': 'calc(var(--gap-count) * var(--grid-gap))',

  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,

  [mq.lg]: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, var(--column-width))',
    justifyContent: 'center',
    maxWidth: 'calc((var(--max-no-columns) * var(--column-width)) + var(--gap-width))',
    marginInline: 'auto',

    [`&[data-layout=${LAYOUT.COLUMN}]`]: {
      gridTemplateColumns: 'var(--column-width)',
    },
  },
})
