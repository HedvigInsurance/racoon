'use client'

import styled from '@emotion/styled'
import { ConditionalWrapper, theme, mq } from 'ui'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { ProductVariantSelector } from '@/components/ProductVariantSelector/ProductVariantSelector'
import { zIndexes } from '@/utils/zIndex'

// FIXME: copied from ProductPageBlock, move to common module
const NAVIGATION_LIST_HEIGHT = '2.5rem'

type ProductVariantSelectorBlockProps = {
  nested?: boolean
}

export const ProductVariantSelectorBlock = ({ nested }: ProductVariantSelectorBlockProps) => {
  const productData = useProductData()

  if (productData.variants.length < 2) return null

  return (
    <ConditionalWrapper
      condition={!nested}
      wrapWith={(children) => <VariantSelectorWrapper>{children}</VariantSelectorWrapper>}
    >
      <StyledProductVariantSelector />
    </ConditionalWrapper>
  )
}

const VariantSelectorWrapper = styled.div({
  position: 'sticky',
  top: `calc(${NAVIGATION_LIST_HEIGHT} + 1.2rem)`,
  width: 'fit-content',
  minWidth: '12.5rem',
  paddingInline: theme.space.md,
  zIndex: zIndexes.tabs,

  [mq.md]: {
    top: `calc(${NAVIGATION_LIST_HEIGHT} + 1.5rem)`,
    paddingInline: theme.space.lg,
  },
})

const StyledProductVariantSelector = styled(ProductVariantSelector)({
  backgroundColor: theme.colors.signalGreenFill,
  boxShadow: theme.shadow.default,

  ':hover, :focus-within': {
    backgroundColor: theme.colors.signalGreenHighlight,
  },
})
