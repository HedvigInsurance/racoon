import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { Heading, Space, mq } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useProductMetadata } from '@/components/LayoutWithMenu/ProductMetadataContext'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQueryParam'
import { ProductItem } from '@/components/SelectInsuranceGrid/ProductItem'
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

  return (
    <Root data-nested={nested}>
      <GridLayout.Content width="1" align="center">
        <Space y={{ base: 2, md: 4 }}>
          {blok.title && (
            <Heading as="h2" variant={{ _: 'serif.32', lg: 'serif.48' }} align="center">
              {blok.title}
            </Heading>
          )}

          <SelectInsuranceGrid {...storyblokEditable(blok)}>
            {products?.map((item) => (
              <ProductItem.Root key={item.id}>
                <ProductItem.Pillow {...item.pillowImage} />
                <ProductItem.Content>
                  <ProductItem.TitleLink
                    href={getProductLink(item.pageLink, openPriceCalculator)}
                    title={item.displayNameFull}
                  >
                    {item.displayNameShort}
                  </ProductItem.TitleLink>
                  <ProductItem.Tagline>{item.tagline}</ProductItem.Tagline>
                </ProductItem.Content>
              </ProductItem.Root>
            ))}
          </SelectInsuranceGrid>
        </Space>
      </GridLayout.Content>
    </Root>
  )
}

const Root = styled(GridLayout.Root)({
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
