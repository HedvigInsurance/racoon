'use client'
import { QuickPurchase } from '@/components/QuickPurchase/QuickPurchase'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type QuickPurchaseBlockProps = SbBaseBlockProps<{
  products: Array<string>
  showSsnField: boolean
  campaignCode?: string
  attributedTo?: string
}>

export const QuickPurchaseBlock = ({ blok, nested }: QuickPurchaseBlockProps) => {
  return (
    <QuickPurchase
      products={blok.products}
      showSsnField={blok.showSsnField}
      campaignCode={blok.campaignCode}
      attributedTo={blok.attributedTo}
      nested={nested}
    />
  )
}
