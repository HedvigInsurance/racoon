'use client'
import { type ReactNode } from 'react'
import { useSyncPriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { type TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'

type Props = {
  priceTemplate: TemplateV2
  children: ReactNode
}
export function PriceTemplateProvider({ priceTemplate, children }: Props) {
  useSyncPriceTemplate(priceTemplate)
  return children
}
