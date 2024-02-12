'use client'

import { useTranslation } from 'next-i18next'

export const ClientComponent = () => {
  const { t } = useTranslation('purchase-form')
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
