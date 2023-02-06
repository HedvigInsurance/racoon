import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { HeadingLabel, Space, theme } from 'ui'
import { InsurableLimits } from '@/components/InsurableLimits/InsurableLimits'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type InsurableLimitsBlockProps = SbBaseBlockProps<{
  headline: string
}>

export const InsurableLimitsBlock = ({ blok }: InsurableLimitsBlockProps) => {
  const { productData, selectedVariant } = useProductPageContext()

  const selectedProductVariant = productData.variants.find(
    (item) => item.typeOfContract === selectedVariant?.typeOfContract,
  )

  const productVariant = selectedProductVariant ?? productData.variants[0]

  const items = productVariant.insurableLimits.map((item) => ({
    label: item.label,
    description: item.description,
    value: item.limit,
  }))

  return (
    <Wrapper {...storyblokEditable}>
      <Space y={1}>
        <HeadingLabel>{blok.headline}</HeadingLabel>
        <InsurableLimits items={items} />
      </Space>
    </Wrapper>
  )
}
InsurableLimitsBlock.blockName = 'insurableLimits'

const Wrapper = styled.div({ padding: theme.space.md })
