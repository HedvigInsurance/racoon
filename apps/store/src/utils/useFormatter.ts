import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { Formatter } from '@/utils/formatter'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export const useFormatter = (): Formatter => {
  const { locale } = useCurrentLocale()
  const { i18n } = useTranslation()
  const { shopSession } = useShopSession()
  return useMemo(() => {
    if (!shopSession?.currencyCode) {
      throw new Error('Cannot use useFormatter until shopSession is ready')
    }
    return new Formatter({ locale, currencyCode: shopSession.currencyCode, i18n })
  }, [shopSession?.currencyCode, locale, i18n])
}
