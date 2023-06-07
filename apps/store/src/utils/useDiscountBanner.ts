import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { useGlobalBanner } from '@/components/GlobalBanner/useGlobalBanner'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export const useDiscountBanner = () => {
  const { t } = useTranslation()
  const { shopSession } = useShopSession()
  const { banner, addBanner } = useGlobalBanner()

  const hasDiscount = !!shopSession?.cart.redeemedCampaigns.length

  useEffect(() => {
    if (hasDiscount && banner === null) {
      addBanner(t('GLOBAL_BANNER_CAMPAIGN'), 'campaign')
    }
  }, [hasDiscount, banner, addBanner, t])
}
