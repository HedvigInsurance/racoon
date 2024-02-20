'use client'

import { useAtomValue } from 'jotai'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { productsMetadataAtom } from '@/components/LayoutWithMenu/productMetadataAtom'
import { useAppRouterLocale } from '../useAppRouterLocale'

export const ClientComponent = () => {
  const { t } = useTranslation('purchase-form')
  const searchParams = useSearchParams()
  if (searchParams?.get('error')) {
    throw new Error('test error')
  }
  const locale = useAppRouterLocale()
  // Read jotai value from provider
  const productMetadata = useAtomValue(productsMetadataAtom(locale))
  console.log('productMetadata@ClientComponent, items:', productMetadata?.length)
  return (
    <div>
      Text below uses client i18n:
      <hr />
      {t('SECTION_TOOLTIP_YOUR_CAR')}
      <hr />
      {t('PRODUCT_REVIEWS_DISCLAIMER', { ns: 'common' })}
    </div>
  )
}
