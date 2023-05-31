import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import {
  useSetGlobalBanner,
  useGlobalBannerClosed,
} from '@/components/GlobalBanner/useGlobalBanner'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export const useDiscountBanner = () => {
  const { t } = useTranslation()
  const { shopSession } = useShopSession()
  const setGlobalBanner = useSetGlobalBanner()
  const [closed] = useGlobalBannerClosed()
  const hasDiscount = !!shopSession?.cart.redeemedCampaigns.length

  useEffect(() => {
    if (hasDiscount && !closed) {
      setGlobalBanner(t('GLOBAL_BANNER_CAMPAIGN'), 'campaign')
    }
  }, [t, setGlobalBanner, hasDiscount, closed])
}
