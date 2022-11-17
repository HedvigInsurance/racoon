import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { InsurableLimits } from '@/components/InsurableLimits/InsurableLimits'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { Statistic } from '@/components/Statistic/Statistic'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type InsurableLimitsBlockProps = SbBaseBlockProps<unknown>

const StyledInsurableLimits = styled(InsurableLimits)(({ theme }) => ({
  padding: theme.space[4],
}))

export const InsurableLimitsBlock = ({ blok }: InsurableLimitsBlockProps) => {
  const { productData, selectedVariant } = useProductPageContext()

  const selectedProductVariant = productData.variants.find(
    (item) => item.typeOfContract === selectedVariant?.typeOfContract,
  )

  const productVariant = selectedProductVariant ?? productData.variants[0]

  return (
    <StyledInsurableLimits {...storyblokEditable(blok)}>
      {productVariant.insurableLimits.map((item) => (
        <Statistic key={item.label} label={item.label} value={item.limit} />
      ))}
    </StyledInsurableLimits>
  )
}
InsurableLimitsBlock.blockName = 'insurableLimits'
