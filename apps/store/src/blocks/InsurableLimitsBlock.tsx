import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { HeadingLabel, theme } from 'ui'
import { InsurableLimits } from '@/components/InsurableLimits/InsurableLimits'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import * as Statistic from '@/components/Statistic/Statistic'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type InsurableLimitsBlockProps = SbBaseBlockProps<unknown>

export const InsurableLimitsBlock = ({ blok }: InsurableLimitsBlockProps) => {
  const { productData, selectedVariant } = useProductPageContext()

  const selectedProductVariant = productData.variants.find(
    (item) => item.typeOfContract === selectedVariant?.typeOfContract,
  )

  const productVariant = selectedProductVariant ?? productData.variants[0]

  return (
    <StyledInsurableLimits {...storyblokEditable(blok)}>
      {productVariant.insurableLimits.map((item) => (
        <Statistic.Root key={item.label}>
          <HeadingLabel color="#D2E6F1">{item.label}</HeadingLabel>
          <Statistic.Description>{item.description}</Statistic.Description>
          <Statistic.Value>{item.limit}</Statistic.Value>
        </Statistic.Root>
      ))}
    </StyledInsurableLimits>
  )
}
InsurableLimitsBlock.blockName = 'insurableLimits'

const StyledInsurableLimits = styled(InsurableLimits)({
  padding: theme.space.md,
})
