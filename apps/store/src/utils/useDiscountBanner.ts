import { useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { globalBannerAtom } from '@/components/GlobalBanner/globalBannerState'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'

export const useDiscountBanner = () => {
  const { t } = useTranslation()
  const { shopSession } = useShopSession()
  const setGlobalBanner = useSetAtom(globalBannerAtom)

  const campaign = shopSession?.cart.redeemedCampaign
  useEffect(() => {
    if (campaign) {
      setGlobalBanner({ id: 'campaign', content: t('GLOBAL_BANNER_CAMPAIGN'), variant: 'campaign' })
    }
  }, [campaign, setGlobalBanner, t])
}
