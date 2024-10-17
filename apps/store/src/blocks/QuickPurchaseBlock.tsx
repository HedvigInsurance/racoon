'use client'
import { QuickPurchase } from '@/components/QuickPurchase/QuickPurchase'
import { QuickPurchaseV2 } from '@/components/QuickPurchaseV2/QuickPurchase'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { Features } from '@/utils/Features'

type QuickPurchaseBlockProps = SbBaseBlockProps<{
  products: Array<string>
  productByline?: string
  preSelectFirstProduct?: boolean
  showSsnField: boolean
  campaignCode?: string
  attributedTo?: string
}>

export const QuickPurchaseBlock = ({ blok, nested }: QuickPurchaseBlockProps) => {
  if (Features.enabled('QUICK_PURCHASE_V2')) {
    return (
      <QuickPurchaseV2
        products={blok.products}
        productByline={blok.productByline}
        preSelectFirstProduct={blok.preSelectFirstProduct}
        showSsnField={blok.showSsnField}
        campaignCode={blok.campaignCode}
        attributedTo={blok.attributedTo}
        nested={nested}
      />
    )
  }

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
