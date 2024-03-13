'use client'

import { storyblokEditable } from '@storyblok/react'
import { InsurableLimits } from '@/components/InsurableLimits/InsurableLimits'
import {
  useProductData,
  useSelectedProductVariant,
} from '@/components/ProductData/ProductDataProvider'

export const InsurableLimitsBlock = () => {
  const selectedVariant = useSelectedProductVariant()
  const productData = useProductData()

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
