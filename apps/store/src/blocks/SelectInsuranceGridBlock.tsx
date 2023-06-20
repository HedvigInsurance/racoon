import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { mq } from 'ui'
import { useProductMetadata } from '@/components/LayoutWithMenu/ProductMetadataContext'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { SelectInsuranceGrid } from '@/components/SelectInsuranceGrid/SelectInsuranceGrid'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { ORIGIN_URL } from '@/utils/PageLink'

type Props = SbBaseBlockProps<{
  title?: string
  openPriceCalculator?: boolean
}>

export const SelectInsuranceGridBlock = ({ blok, nested }: Props) => {
  const products = useProductMetadata()
  const openPriceCalculator = blok.openPriceCalculator ?? true

  const parsedProducts = (products ?? []).map((product) => ({
    ...product,
    pageLink: getProductLink(product.pageLink, openPriceCalculator),
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

const getProductLink = (pageLink: string, openPriceCalculator: boolean) => {
  return openPriceCalculator
    ? addSearchParam(pageLink, OPEN_PRICE_CALCULATOR_QUERY_PARAM, '1')
    : pageLink
}

const addSearchParam = (url: string, param: string, value: string) => {
  const urlObj = new URL(url, ORIGIN_URL)
  urlObj.searchParams.set(param, value)
  return urlObj.toString()
}

SelectInsuranceGridBlock.blockName = 'selectInsuranceGrid'
