import styled from '@emotion/styled'
import { ConditionalWrapper, theme, mq } from 'ui'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { ProductVariantSelector } from '@/components/ProductVariantSelector/ProductVariantSelector'
import { zIndexes } from '@/utils/zIndex'
import { NAVIGATION_LIST_HEIGHT } from './ProductPageBlock'

type ProductVariantSelectorBlockProps = {
  nested?: boolean
}

export const ProductVariantSelectorBlock = ({ nested }: ProductVariantSelectorBlockProps) => {
  const { productData } = useProductPageContext()

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
  backgroundColor: theme.colors.greenFill1,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',

  ':hover, :focus-within': {
    backgroundColor: theme.colors.greenFill3,
  },
})

ProductVariantSelectorBlock.blockName = 'productVariantSelector'
