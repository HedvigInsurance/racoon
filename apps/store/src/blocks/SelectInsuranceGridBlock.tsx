import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { mq } from 'ui'
import { useProductMetadata } from '@/components/LayoutWithMenu/ProductMetadataContext'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { SelectInsuranceGrid } from '@/components/SelectInsuranceGrid/SelectInsuranceGrid'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { getParameterizedLink } from '@/utils/getParameterizedLink'

type Props = SbBaseBlockProps<{
  title?: string
  openPriceCalculator?: boolean
}>

export const SelectInsuranceGridBlock = ({ blok, nested }: Props) => {
  const products = useProductMetadata()
  const openPriceCalculator = blok.openPriceCalculator ?? true

  const parsedProducts = (products ?? []).map((product) => ({
    ...product,
    pageLink: openPriceCalculator
      ? getParameterizedLink(product.pageLink, [[OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1']])
      : product.pageLink,
  }))

  return (
    <StyledSelectInsuranceGrid
      data-nested={nested}
      heading={blok.title}
      products={parsedProducts}
      {...storyblokEditable(blok)}
    />
  )
}

const StyledSelectInsuranceGrid = styled(SelectInsuranceGrid)({
  // When using the component in a Modal we need to center align it in larger viewports

  '&[data-nested=true]': {
    [mq.lg]: {
      paddingTop: '16vh',
    },

    [mq.xxl]: {
      paddingTop: '20vh',
    },
  },
})

SelectInsuranceGridBlock.blockName = 'selectInsuranceGrid'
