'use client'

import { useAtomValue } from 'jotai'
import { notFound, useSearchParams } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { productsMetadataAtom } from '@/components/LayoutWithMenu/productMetadataAtom'
import { DiscountTooltip } from '@/components/ProductPage/PurchaseForm/DiscountTooltip/DiscountTooltip'
import { CurrencyCode } from '@/services/graphql/generated'
import { useFormatter } from '@/utils/useFormatter'
import { useAppRouterLocale } from '../useAppRouterLocale'

export const ClientComponent = () => {
  const { t } = useTranslation('purchase-form')
  const searchParams = useSearchParams()
  if (searchParams?.get('error')) {
    throw new Error('Debug: client component error')
  } else if (searchParams?.get('notFound')) {
    throw notFound()
  }
  const locale = useAppRouterLocale()
  // Read jotai value from provider
  const productMetadata = useAtomValue(productsMetadataAtom(locale))
  console.log('productMetadata@ClientComponent, items:', productMetadata?.length)
  const formatter = useFormatter()
  const priceReduction = formatter.monthlyPrice({ amount: 20.0, currencyCode: CurrencyCode.Sek })
  return (
    <div>
      Text below uses client i18n:
      <hr />
      {t('SECTION_TOOLTIP_YOUR_CAR')}
      <hr />
      {t('PRODUCT_REVIEWS_DISCLAIMER', { ns: 'common' })}
      <hr />
      <DiscountTooltip
        subtitle={t('PRICE_MATCH_BUBBLE_SUCCESS_TITLE', {
          amount: priceReduction,
        })}
      >
        Discount tooltip title
      </DiscountTooltip>
    </div>
  )
}
