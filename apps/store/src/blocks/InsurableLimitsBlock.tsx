import { storyblokEditable } from '@storyblok/react'
import { InsurableLimits } from '@/components/InsurableLimits/InsurableLimits'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'

export const InsurableLimitsBlock = () => {
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

  return <InsurableLimits items={items} {...storyblokEditable} />
}
InsurableLimitsBlock.blockName = 'insurableLimits'
