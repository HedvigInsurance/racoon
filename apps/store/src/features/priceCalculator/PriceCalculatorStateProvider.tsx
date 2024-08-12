'use client'
import { type ReactNode } from 'react'
import { JotaiScopeProvider } from '@/components/JotaiScopeProvider'
import type { ProductData } from '@/components/ProductData/ProductData.types'
import {
  productDataAtom,
  selectedTypeOfContractAtom,
} from '@/components/ProductData/ProductDataProvider'
import { priceTemplateAtom } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { priceCalculatorDeductibleInfoAtom } from '@/features/priceCalculator/priceCalculatorAtoms'
import { type TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'
import { type PriceCalculatorPageStory } from '@/services/storyblok/storyblok'

type Props = {
  children: ReactNode
  priceTemplate: TemplateV2
  productData: ProductData
  priceCalculatorPageStory: PriceCalculatorPageStory
}
export function PriceCalculatorStateProvider({
  children,
  priceCalculatorPageStory,
  priceTemplate,
  productData,
}: Props) {
  const atomsWithValues = [
    [priceTemplateAtom, priceTemplate],
    [productDataAtom, productData],
    [selectedTypeOfContractAtom, null],
    [priceCalculatorDeductibleInfoAtom, priceCalculatorPageStory.content.deductibleInfo ?? null],
  ] as const
  return (
    <JotaiScopeProvider key={priceCalculatorPageStory.full_slug} atomsWithValues={atomsWithValues}>
      {children}
    </JotaiScopeProvider>
  )
}
